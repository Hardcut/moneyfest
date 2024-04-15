document.addEventListener("DOMContentLoaded", function () {
  const accordions = document.querySelectorAll("[data-select]");

  accordions.forEach((el) => {
    new Select(el, {});
  });
});
