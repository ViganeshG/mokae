(function () {
	let prodcarousel = () => {
		$(".product-carousel-section").each(function () {
			let slideEl = $(this).find(".product-carousel__wrapper");
			let carousel = $(this).find(".swiper-carousel");
			let slide = $(this).find(".swiper-slide");
			let buttonNext = $(this).find(".swiper-button-next");
			let prodCountHalf = parseFloat(slideEl.data("count")) + 0.1;
			if ($(this).hasClass("slider_started")) {
				return "";
			}

			$(this).addClass("slider_started");
			let id = $(this).attr("id");

			let prodSwiperParams = {
				centeredSlides: false,
				slidesPerView: 1.1,
				waitForTransition: false,
				watchSlidesProgress: true,
				updateOnWindowResize: true,
				preloadImages: true,
				allowTouchMove: true,
				spaceBetween: 4,
				breakpoints: {
					990: {
						slidesPerView: 2.1,
					},
					1200: {
						slidesPerView: 3.1,
					},
					1360: {
						slidesPerView: prodCountHalf,
					},
				},
				on: {
					slideChange: function () {
						if (this.activeIndex === 0) {
							Array.from(slide).forEach((element) => {
								element.classList.remove("slide_change-postion");
							});
							Array.from(carousel).forEach((element) => {
								element.classList.add("carousel_change-postion_next");
								element.classList.remove("carousel_change-postion_prev");
								element.classList.remove("carousel_change-postion_next-2");
							});
							this.update();
						} else {
							if (this.activeIndex > this.previousIndex) {
								Array.from(carousel).forEach((element) => {
									element.classList.remove("carousel_change-postion_next");
									element.classList.remove("carousel_change-postion_next-2");
									element.classList.add("carousel_change-postion_prev");
								});
								Array.from(slide).forEach((element) => {
									if (buttonNext.hasClass("swiper-button-disabled")) {
										element.classList.remove("slide_change-postion");
									} else {
										element.classList.add("slide_change-postion");
									}
								});
							} else {
								Array.from(carousel).forEach((element) => {
									element.classList.add("carousel_change-postion_next-2");
									element.classList.remove("carousel_change-postion_prev");
								});
								Array.from(slide).forEach((element) => {
									element.classList.remove("slide_change-postion");
								});
							}
							this.update();
						}
					},
				},
			};

			let swiperSlider = new Swiper(`#${id} .swiper-carousel`, {
				navigation: {
					nextEl: `#${id} .swiper-button-next__prod`,
					prevEl: `#${id} .swiper-button-prev__prod`,
				},
				...prodSwiperParams,
			});
		});
	};

	document.addEventListener("DOMContentLoaded", function () {
		prodcarousel();
	});

	document.addEventListener("shopify:section:load", function () {
		prodcarousel();
	});

	document.addEventListener("resize", function () {
		prodcarousel();
	});

	document.addEventListener("visibilitychange", function () {
		prodcarousel();
	});

	prodcarousel();
})();

//button-with-underline
if (window.screen.width > 990) {
	let attachedProductCarousel = false;

	let carouselSection = document.querySelector(".product-carousel-section");

	let imageContainerCarousel = carouselSection.querySelector(
		".button--with-underline--container"
	);

	let followMouseCarousel = (event) => {
		if (imageContainerCarousel) {
			imageContainerCarousel.style.left = event.pageX + "px";
			imageContainerCarousel.style.top = event.pageY + 30 + "px";
		}
	};

	function showTextCarousel() {
		if (!attachedProductCarousel && imageContainerCarousel) {
			attachedProductCarousel = true;
			imageContainerCarousel.style.display = "block";
			document.addEventListener("pointermove", followMouseCarousel);
		}
	}

	function hideTextCarousel() {
		if (imageContainerCarousel) {
			attachedProductCarousel = false;
			imageContainerCarousel.style.display = "";
			document.removeEventListener("pointermove", followMouseCarousel);
		}
	}
}
