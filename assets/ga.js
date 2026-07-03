const GA_THEME = {
  isDesktopProductGallery() {
    return window.matchMedia("(min-width: 1200px)").matches;
  },

  normalizeProductGallery(swiper) {
    if (!swiper) return;

    const desktop = GA_THEME.isDesktopProductGallery();

    if (swiper.wrapperEl) swiper.wrapperEl.style.removeProperty("height");
    if (swiper.el) swiper.el.style.removeProperty("height");

    if (swiper.params.loop) {
      const index =
        typeof swiper.realIndex === "number"
          ? swiper.realIndex
          : swiper.activeIndex;

      swiper.params.loop = false;

      if (swiper.loopedSlides && typeof swiper.loopDestroy === "function") {
        swiper.loopDestroy();
      }

      swiper.update();
      swiper.slideTo(index, 0);
    }

    if (swiper.params.rewind !== desktop) {
      swiper.params.rewind = desktop;
      swiper.update();
    }

    swiper.slideTo(swiper.activeIndex, 0);
    swiper.updateSize();
    swiper.updateSlides();
  },

  initProductSwiper(selector) {
    const swiperEl = document.querySelector(selector);
    if (!swiperEl) return;

    const { thumbId } = swiperEl.dataset;
    const thumbEl = document.querySelector(`#swiper-thumb-${thumbId}`);

    if (swiperEl.swiper) {
      GA_THEME.normalizeProductGallery(swiperEl.swiper);
      const thumbSwiper = thumbEl && thumbEl.swiper;
      if (thumbSwiper) thumbSwiper.slideTo(swiperEl.swiper.activeIndex, 0);
      return;
    }

    const swiperThumb = thumbEl
      ? new Swiper(thumbEl, {
          spaceBetween: 6,
          slidesPerView: 3,
          watchSlidesProgress: true,
          direction: "horizontal",
          breakpoints: {
            1200: {
              direction: "vertical",
              slidesPerView: "auto",
            },
          },
        })
      : null;

    const desktopGallery = GA_THEME.isDesktopProductGallery();

    const mainSwiper = new Swiper(swiperEl, {
      loop: false,
      rewind: desktopGallery,
      autoHeight: false,
      slidesPerView: 1,
      spaceBetween: 0,
      centeredSlides: false,
      watchOverflow: true,
      observer: true,
      observeParents: true,
      navigation: {
        nextEl: swiperEl.querySelector(".swiper-button-next"),
        prevEl: swiperEl.querySelector(".swiper-button-prev"),
      },
      thumbs: swiperThumb
        ? {
            swiper: swiperThumb,
          }
        : undefined,
      breakpoints: {
        769: {
          navigation: {
            enabled: true,
          },
        },
        0: {
          navigation: {
            enabled: false,
          },
        },
      },
      on: {
        init(swiper) {
          GA_THEME.normalizeProductGallery(swiper);
          swiperEl
            .querySelectorAll(".product__modal-opener .product__media img")
            .forEach((img) => {
              if (img.complete) return;
              img.addEventListener(
                "load",
                () => GA_THEME.normalizeProductGallery(swiper),
                { once: true }
              );
            });
        },
        slideChangeTransitionEnd(swiper) {
          swiper.updateSize();
        },
        resize(swiper) {
          GA_THEME.normalizeProductGallery(swiper);
        },
      },
    });

    window.addEventListener(
      "resize",
      () => GA_THEME.normalizeProductGallery(mainSwiper),
      { passive: true }
    );
  },
};

document.addEventListener("DOMContentLoaded", () => {
  GA_THEME.initProductSwiper(".js-product-media-gallery");
});

const GA = {
  aslider: function () {
    $("#a-slider").slick({
      slidesToShow: 1,
      arrows: false,
      dots: false,
      loop: true,
      autoplay: true,
      pauseOnHover: false,
      fade: false,
      pauseOnFoucus: false,
      autoplaySpeed: 4000,
    });
  },
  productMessage: function () {
    let checkbox = document.getElementById("ga-message-checkbox");
    if (checkbox) {
      checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
          document.getElementById("message").style.display = "block";
        } else {
          document.getElementById("message").style.display = "none";
          document.getElementById("message").value = "";
        }
      });
    }
  },
  setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie =
      name + "=" + encodeURIComponent(value) + expires + "; path=/";
  },
  getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }
    return null;
  },
  popup: function () {
    // Check if popup was already shown before
    let hasShown = GA.getCookie("ga_show_popup");

    // Do NOT show popup on contact form pages
    if (
      window.location.href.includes("customer_posted=true#contact_form") ||
      window.location.href.includes("form_type=customer#contact_form")
    ) {
      $(".popup").fadeOut();
      GA.setCookie("ga_show_popup", "true", 30); // store as shown
      return;
    }

    // If popup has already been shown once → do nothing
    if (hasShown === "true") {
      return;
    }

    // Show popup after 45 seconds (only first visit)
    setTimeout(function () {
      $(".popup").fadeIn();
      GA.setCookie("ga_show_popup", "true", 1); // mark as shown for 30 days
    }, 45000);

    // When popup is closed → hide it and mark as shown permanently
    $(".popup-close").on("click", function () {
      $(".popup").fadeOut();
      GA.setCookie("ga_show_popup", "true", 1);
    });
  },
  slideshow: function () {
    $(".ga-slideshow").slick({
      slidesToShow: 1,
      arrows: false,
      dots: true,
      loop: true,
      autoplay: true,
      pauseOnHover: false,
      fade: true,
      pauseOnFoucus: false,
      autoplaySpeed: 4000,
    });
  },

  hideHomeLogo: function () {
    if (document.body.classList.contains("template-index") == false) {
      return false;
    }
    if (window.scrollY > 400) {
      document.body.classList.add("ga-show-logo");
    } else {
      document.body.classList.remove("ga-show-logo");
    }

    window.addEventListener("scroll", function () {
      if (window.scrollY > 400) {
        document.body.classList.add("ga-show-logo");
      } else {
        document.body.classList.remove("ga-show-logo");
      }
    });
  },
  testimonials: function () {
    $(".ga-testimonials-slider").slick({
      slidesToShow: 2,
      arrows: true,
      dots: false,
      infinite: false,
      autoplay: true,
      pauseOnHover: false,
      pauseOnFoucus: false,
      autoplaySpeed: 4000,
      prevArrow: ".ga-tn-prev",
      nextArrow: ".ga-tn-next",
      responsive: [
        {
          breakpoint: 700,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  },

  //hide discount price for Cosmic Eyes Kajal Trio


  init: function () {
    document.addEventListener("DOMContentLoaded", function () {
      // Run critical/lightweight tasks in the first task — these are cheap
      // or have internal delays (popup has a 45s setTimeout)
      GA.hideHomeLogo();
      GA.popup();
      GA.productMessage();

      // Guard against calling undefined method — putReviewsInLogo was removed
      // from this file. Calling undefined() throws TypeError on every page load.
      if (typeof GA.putReviewsInLogo === "function") {
        GA.putReviewsInLogo();
      }

      // Below-fold Slick slider inits: stagger with setTimeout so each one
      // becomes a SEPARATE browser task. Without this, both run synchronously
      // inside the DOMContentLoaded task, adding ~100-200ms to a single long task.
      // 150ms / 300ms delays are imperceptible for below-fold content.
      setTimeout(function () { GA.slideshow(); }, 150);
      setTimeout(function () { GA.testimonials(); }, 300);
    });
  },
};
GA.init();
