document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuButton = header?.querySelector(".mobile-menu-btn");
  const mobileNav = document.getElementById("mobile-menu");
  if (!header || !menuButton || !mobileNav) return;

  function updateHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("pageshow", updateHeader);

  const mobileView = window.matchMedia("(max-width: 900px)");
  const links = Array.from(mobileNav.querySelectorAll("a"));

  function closeMenu({ restoreFocus = false } = {}) {
    const focusWasInside = mobileNav.contains(document.activeElement);
    menuButton.classList.remove("is-active");
    mobileNav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Otwórz menu");
    mobileNav.hidden = true;
    if (restoreFocus) menuButton.focus();
    else if (focusWasInside) document.activeElement.blur();
  }

  function openMenu() {
    if (!mobileView.matches) return;
    mobileNav.hidden = false;
    mobileNav.classList.add("is-open");
    menuButton.classList.add("is-active");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Zamknij menu");
    links[0]?.focus();
  }

  menuButton.addEventListener("click", () => {
    if (mobileNav.hidden) openMenu();
    else closeMenu({ restoreFocus: true });
  });

  links.forEach((link) => link.addEventListener("click", () => closeMenu()));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !mobileNav.hidden) {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
    }
  });

  document.addEventListener("click", (event) => {
    if (!mobileNav.hidden && !header.contains(event.target)) closeMenu();
  });

  // Touch browsers can blur a link before clicking the close button without
  // focusing that button. Wait for an actual new focus target instead.
  document.addEventListener("focusin", (event) => {
    if (!mobileNav.hidden && !header.contains(event.target)) closeMenu();
  });

  mobileView.addEventListener("change", () => closeMenu());
  window.addEventListener("pageshow", () => closeMenu());
});
