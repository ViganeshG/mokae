(function () {
	const aboutCarousel = () => {
		$(document).ready(function () {
			const sliderSection = document.querySelector(".js-about-for-data-get");
			const getSpeedSlider = sliderSection.dataset.speedSlider;
			const getDelaySlider = sliderSection.dataset.delaySlider;
			const speedAboutCarousel = getSpeedSlider * 1000;
			const delayAboutCarousel = getDelaySlider * 1000;
			const sliderHoverAutoplayStop =
				sliderSection.dataset.sliderHoverAutoplayStop;

			const params = {
				// slidesPerView: "auto",
				slidesPerView: 1,
				spaceBetween: 0,
				// autoHeight: true,
				centeredSlides: false,
				speed: speedAboutCarousel,
				loop: false,
				// autoplay: {
				//   delay: delayAboutCarousel,
				//   disableOnInteraction: false,
				// },

				on: {
					init: function () {
						setDuration(delayAboutCarousel);
						setSelectorForAnimate(0);
					},
				},

				pagination: {
					el: ".js-about__swiper-pagination",
					clickable: true,
					renderBullet: function (index, className) {
						const svg = `<svg height="62"
                              width="62"
                              class="circle-button__svg"
                              preserveAspectRatio="xMidYMid meet"
                              viewBox="0 0 62 62"
                              xmlns="http://www.w3.org/2000/svg">
                                <circle cx="31" cy="31" r="31" />
                                <circle cx="31" cy="31" r="31" />
                          </svg>`;
						return `<button type="button" data-content='${
							index + 1
						}' class='${className} circle-button'            
            >${svg}</button>`;
					},
				},
				navigation: {
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev",
				},
			};

			const swiperAboutCarousel = new Swiper(".js-about__carousel", params);

			function stop() {
				swiperAboutCarousel.autoplay.stop();
			}

			function start() {
				swiperAboutCarousel.autoplay.start();
			}

			swiperAboutCarousel.on("resize", function () {
				if (sliderHoverAutoplayStop === "true") {
					start();
				}
			});

			swiperAboutCarousel.on("setTransition", function () {
				if (sliderHoverAutoplayStop === "true") {
					stop();
				}
			});

			swiperAboutCarousel.on("slideChangeTransitionEnd", function () {
				if (sliderHoverAutoplayStop === "true") {
					start();
					removeSelectorForAnimate();
					setSelectorForAnimate(swiperAboutCarousel.activeIndex);
				}
			});

			$(".js-about__carousel").mouseenter(function () {
				if (sliderHoverAutoplayStop === "true") {
					stop();
				}
			});

			$(".js-about__carousel").mouseleave(function () {
				if (sliderHoverAutoplayStop === "true") {
					start();
				}
			});

			const textSwiper = new Swiper(".text-carousel", {
				parallax: true,
				// autoHeight: true,
				// slidesPerView: "auto",
				slidesPerView: 1,
				spaceBetween: 0,
				centeredSlides: false,
				speed: speedAboutCarousel,
				loop: false,
				allowTouchMove: false,
			});
			swiperAboutCarousel.controller.control = textSwiper;
			textSwiper.controller.control = swiperAboutCarousel;
		});
	};

	// removeSelectorForAnimate
	function removeSelectorForAnimate() {
		$(".js-about__swiper-pagination .swiper-pagination-bullet").each(
			function () {
				$(this).find("svg circle:last-child").removeClass("circle-animate");
			}
		);
	}

	// setDuration
	function setDuration(delayAboutCarousel) {
		const bulletstList = document.querySelectorAll(
			".js-about__swiper-pagination .swiper-pagination-bullet"
		);

		bulletstList.forEach((item) => {
			item.style.setProperty(
				"--circle-button--progress-animation-duration",
				delayAboutCarousel + "ms"
			);
		});
	}

	// setSelectorForAnimate
	function setSelectorForAnimate(indexElement) {
		document
			.querySelectorAll(".swiper-pagination-bullet svg circle:last-child")
			[indexElement].classList.add("circle-animate");
	}

	document.addEventListener("DOMContentLoaded", function () {
		aboutCarousel();
		document.addEventListener("shopify:section:load", function () {
			aboutCarousel();
		});
	});
})();
