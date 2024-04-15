document.addEventListener("DOMContentLoaded", function () {
  const sliderParty = new Swiper('[data-swiper="party"]', {
    slidesPerView: "auto",
    spaceBetween: 9,
    watchOverflow: true,
    slidesOffsetBefore: 16,
    slidesOffsetAfter: 16,
    breakpoints: {
      767: {
        slidesPerView: 5,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
      },
    },
  });

  const sliderProducts = new Swiper('[data-swiper="products"]', {
    slidesPerView: "auto",
    spaceBetween: 24,
    centeredSlides: true,
    watchOverflow: true,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
});
