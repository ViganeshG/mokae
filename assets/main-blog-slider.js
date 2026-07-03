(function () {
	const slideshow = () => {
		$(document).ready(function () {
			$(".js-slideshow-container").each(function () {
				const $this = $(this);
				const id = $this.attr("id");
				const sliderS = `#${id} .js-slideshow`;
				const paginationEl = `#${id} .swiper-pagination`;
				// ---
				let isHoverStopAutoplay = $this.data().isHoverStopAutoplay;
				const isAutoplay = $this.data().isAutoplay;
				const delaySlideing = $this.data().delaySlideing * 1000;
				const speedSlideing = $this.data().speedSlideing * 1000;
				isHoverStopAutoplay =
					isAutoplay === false ? false : isHoverStopAutoplay;

				const insertAutoplay = () =>
					isAutoplay === true
						? {
								autoplay: {
									delay: delaySlideing,
									disableOnInteraction: false,
								},
						  }
						: {};

				const swiperSlideshow = new Swiper(sliderS, {
					parallax: true,
					speed: speedSlideing,
					loop: true,
					allowTouchMove: true,
					...insertAutoplay(),
					pagination: {
						el: paginationEl,
						clickable: true,
					},
					keyboard: false,
					watchSlidesProgress: true,
				});

				$(`${sliderS}`).mouseenter(function () {
					if (isHoverStopAutoplay === true) {
						stopSlide();
					}
				});

				$(`${sliderS}`).mouseleave(function () {
					if (isHoverStopAutoplay === true) {
						startSlide();
					}
				});

				// functions
				function startSlide() {
					if (isAutoplay === true) {
						swiperSlideshow.autoplay.start();
					}
				}

				function stopSlide() {
					swiperSlideshow.autoplay.stop();
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
