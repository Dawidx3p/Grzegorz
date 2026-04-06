const galleryButtons = Array.from(document.querySelectorAll(".gallery-card"));
const heroButton = document.querySelector(".js-open-from-hero");

const lightbox = document.getElementById("lightbox");
const lightboxBackdrop = document.getElementById("lightboxBackdrop");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDescription = document.getElementById("lightboxDescription");
const lightboxMetaLine = document.getElementById("lightboxMetaLine");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const lightboxThumbs = document.getElementById("lightboxThumbs");

const items = galleryButtons.map((button) => {
  let details = [];

  try {
    details = JSON.parse(button.dataset.details || "[]");
  } catch (e) {
    details = [];
  }

  if (!details.length && button.dataset.full) {
    details = [button.dataset.full];
  }

  return {
    full: button.dataset.full,
    title: button.dataset.title,
    category: button.dataset.category,
    description: button.dataset.description,
    meta: button.dataset.meta || "",
    alt: button.querySelector("img")?.alt || button.dataset.title,
    details
  };
});

let currentIndex = 0;
let currentDetailIndex = 0;

function renderThumbs(item) {
  if (!lightboxThumbs) return;

  if (!item.details || item.details.length <= 1) {
    lightboxThumbs.innerHTML = "";
    lightboxThumbs.classList.remove("is-visible");
    return;
  }

  lightboxThumbs.classList.add("is-visible");
  lightboxThumbs.innerHTML = item.details
    .map((src, index) => {
      const active = index === currentDetailIndex;
      return `
        <button class="lightbox-thumb${active ? " is-active" : ""}" data-index="${index}">
          <img src="${src}" alt="${item.alt}" />
        </button>
      `;
    })
    .join("");

  Array.from(lightboxThumbs.querySelectorAll(".lightbox-thumb")).forEach((btn) => {
    btn.addEventListener("click", () => {
      currentDetailIndex = Number(btn.dataset.index);
      renderLightbox(currentIndex, currentDetailIndex);
    });
  });
}

function renderLightbox(index, detailIndex = 0) {
  const item = items[index];
  if (!item) return;

  currentIndex = index;
  currentDetailIndex = detailIndex;

  const src = item.details[currentDetailIndex] || item.full;

  lightboxImage.src = src;
  lightboxImage.alt = item.alt;
  lightboxCategory.textContent = item.category || "";
  lightboxTitle.textContent = item.title || "";
  lightboxDescription.textContent = item.description || "";

  if (lightboxMetaLine) {
    lightboxMetaLine.textContent = item.meta || "";
    lightboxMetaLine.style.display = item.meta ? "block" : "none";
  }

  renderThumbs(item);
}

function openLightbox(index) {
  renderLightbox(index, 0);
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function showNext() {
  const next = (currentIndex + 1) % items.length;
  renderLightbox(next, 0);
}

function showPrev() {
  const prev = (currentIndex - 1 + items.length) % items.length;
  renderLightbox(prev, 0);
}

galleryButtons.forEach((button, index) => {
  button.addEventListener("click", () => openLightbox(index));
});

if (heroButton) {
  heroButton.addEventListener("click", () => {
    const heroIndex = Number(heroButton.dataset.index || 0);
    openLightbox(heroIndex);
  });
}

lightboxClose.addEventListener("click", closeLightbox);
lightboxBackdrop.addEventListener("click", closeLightbox);
lightboxNext.addEventListener("click", showNext);
lightboxPrev.addEventListener("click", showPrev);

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("active")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") showNext();
  if (event.key === "ArrowLeft") showPrev();
});

lightboxImage.addEventListener("error", () => {
  lightboxTitle.textContent = "Nie udało się wczytać obrazu";
  lightboxDescription.textContent = "Sprawdź data-full i data-details.";

  if (lightboxMetaLine) {
    lightboxMetaLine.textContent = "";
    lightboxMetaLine.style.display = "none";
  }
});