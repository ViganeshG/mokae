(function () {
  const prodtimerSlider = () => {
    const prodSlider = new Swiper("#swiper-product-timer", {
        centeredSlides: false,
        loop: true,
        loopAdditionalSlides: 3,
        direction: 'horizontal',
        slidesPerView: 1,
        autoHeight: true,
        calculateHeight: true,
        waitForTransition: true,
        watchSlidesProgress: false,
        updateOnWindowResize: true,
        preloadImages: true,
        spaceBetween: 4,
        allowTouchMove: true,
        navigation: {
          nextEl: ".swiper-button-next__prod-timer",
          prevEl: ".swiper-button-prev__prod-timer",
        },
    });
  }

  document.addEventListener('shopify:section:load', function () {
    setTimeout(() => {
      prodtimerSlider();
    }, 1000);
    
  });

  setTimeout(() => {
    prodtimerSlider();
  }, 1000);
  })();