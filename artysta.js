document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector(".mobile-menu-btn");
    const mobileNav = document.querySelector(".mobile-nav");
    const mobileNavLinks = document.querySelectorAll(".mobile-nav a");
  
    if (!menuButton || !mobileNav) return;
  
    const closeMenu = () => {
      menuButton.classList.remove("is-active");
      mobileNav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    };
  
    const openMenu = () => {
      menuButton.classList.add("is-active");
      mobileNav.classList.add("is-open");
      menuButton.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open");
    };
  
    const toggleMenu = () => {
      const isOpen = mobileNav.classList.contains("is-open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    };
  
    menuButton.addEventListener("click", toggleMenu);
  
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && mobileNav.classList.contains("is-open")) {
        closeMenu();
      }
    });
  
    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) {
        closeMenu();
      }
    });
  });