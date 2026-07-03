(function () {
	const slideshow = () => {
		$(document).ready(function () {
			$(".js-slideshow").each(function (index, parent) {
				let parentId = `#${$(parent).attr("id")}`;

				const params = document
					.querySelector(parentId)
					.querySelector(".js-data--slideshow");

				const speedSlideing = removeSpace(params.dataset.speedSlideing) * 1000;
				const delaySlideing = removeSpace(params.dataset.delaySlideing) * 1000;
				let isHoverStopAutoplay = toBoolean(params.dataset.isHoverStopAutoplay);
				const isAutoplay = toBoolean(params.dataset.isAutoplay);
				isHoverStopAutoplay =
					isAutoplay === false ? false : isHoverStopAutoplay;
				//console.log("isAutoplay slideshow ", isAutoplay);
				const parallax = toBoolean(params.dataset.parallax);
				const effects = params.dataset.effects;
				const sliderThumbnails = removeSpace(
					params.dataset.sliderThumbnails
				).split(",");

				const circleAnimateName = "circle-animate"; // !!! убрать
				const circleAnimate = `${parentId} .${circleAnimateName}`;

				const jsSwiperNavigationNextName = "swiper-button-next";
				const jsSwiperNavigationNext = `${parentId} .${jsSwiperNavigationNextName}`;

				const jsSwiperNavigationPrevName = "swiper-button-prev";
				const jsSwiperNavigationPrev = `${parentId} .${jsSwiperNavigationPrevName}`;

				const jsSwiperPaginationName = "js-slideshow-pagination";
				const jsSwiperPagination = `${parentId} .${jsSwiperPaginationName}`;

				const swiperPaginationBulletActiveName = // !!! убрать
					"swiper-pagination-bullet-active";
				const swiperPaginationBulletActive = `${parentId} .${swiperPaginationBulletActiveName}`;

				const jsSwiperName = "js-slideshow";
				const jsSwiper = `${parentId} .${jsSwiperName}`;

				const circleButtonName = "circle-button"; // !!! убрать
				const circleButton = `${parentId} .${circleButtonName}`;

				let btnsArray;
				let isHover = false;

				const slideEffects = (effects) => {
					// !!! убрать
					switch (effects) {
						case "slide":
							return {};
						case "fade":
							return { effect: "fade", parallax: false };
						case "coverflow":
							return {
								effect: "coverflow",
								coverflowEffect: {
									rotate: 50,
									stretch: 0,
									depth: 100,
									modifier: 1,
									slideShadows: true,
								},
							};
						case "creative":
							return {
								effect: "creative",
								creativeEffect: {
									prev: {
										shadow: true,
										translate: [0, 0, -400],
									},
									next: {
										translate: ["100%", 0, 0],
									},
								},
							};
						case "flip":
							return { effect: "flip" };
						default:
							return {};
					}
				};

				const insertAutoplay = () =>
					isAutoplay === true
						? {
								autoplay: {
									delay: delaySlideing,
									disableOnInteraction: false,
								},
						  }
						: {};

				// swiperParams
				const swiperParams = {
					centeredSlides: false,
					speed: speedSlideing,
					loop: false,
					parallax: true,
					...insertAutoplay(),
					navigation: {
						nextEl: jsSwiperNavigationNext,
						prevEl: jsSwiperNavigationPrev,
					},
					pagination: {
						el: "jsSwiperPagination",
						clickable: true,
					},
				};
				// end swiperParams

				const swiper = new Swiper(jsSwiper, swiperParams);

				$(`${jsSwiper}`).mouseenter(function () {
					if (isHoverStopAutoplay === true) {
						stopSlide();
					}
				});

				$(jsSwiper).mouseleave(function () {
					if (isHoverStopAutoplay === true) {
						startSlide();
					}
				});

				function startSlide() {
					if (isAutoplay === true) {
						swiper.autoplay.start();
					}
				}

				function stopSlide() {
					swiper.autoplay.stop();
				}
			});
		});
	};

	document.addEventListener("DOMContentLoaded", function () {
		slideshow();
		document.addEventListener("shopify:section:load", function () {
			slideshow();
		});
	});
})();
