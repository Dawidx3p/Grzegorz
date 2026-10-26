document.addEventListener("DOMContentLoaded", () => {
  const shortcut = document.querySelector(".mobile-contact");
  const contact = document.getElementById("kontakt");
  const menu = document.getElementById("mobile-menu");
  if (!shortcut || !contact) return;

  let contactVisible = false;
  const update = () => {
    shortcut.hidden = contactVisible || Boolean(menu && !menu.hidden);
  };
  const observer = new IntersectionObserver(([entry]) => {
    contactVisible = entry.isIntersecting;
    update();
  });
  observer.observe(contact);
  if (menu) new MutationObserver(update).observe(menu, { attributes: true, attributeFilter: ["hidden"] });
  update();
});
