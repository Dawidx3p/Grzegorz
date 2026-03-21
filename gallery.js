const galleryButtons = Array.from(document.querySelectorAll(".gallery-card"));
const heroButton = document.querySelector(".js-open-from-hero");

const lightbox = document.getElementById("lightbox");
const lightboxBackdrop = document.getElementById("lightboxBackdrop");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDescription = document.getElementById("lightboxDescription");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

const items = galleryButtons.map((button) => ({
  full: button.dataset.full,
  title: button.dataset.title,
  category: button.dataset.category,
  description: button.dataset.description,
  alt: button.querySelector("img")?.alt || button.dataset.title
}));

let currentIndex = 0;

function renderLightbox(index) {
  const item = items[index];
  if (!item) return;

  currentIndex = index;

  lightboxImage.src = item.full;
  lightboxImage.alt = item.alt;
  lightboxCategory.textContent = item.category || "";
  lightboxTitle.textContent = item.title || "";
  lightboxDescription.textContent = item.description || "";
}

function openLightbox(index) {
  renderLightbox(index);
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
  const nextIndex = (currentIndex + 1) % items.length;
  renderLightbox(nextIndex);
}

function showPrev() {
  const prevIndex = (currentIndex - 1 + items.length) % items.length;
  renderLightbox(prevIndex);
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
  lightboxDescription.textContent = "Sprawdź ścieżkę w data-full oraz nazwę pliku w folderze images.";
});