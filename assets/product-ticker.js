(function () {
	const tickSlider2 = () => {
		const tickerSwiper2 = new Swiper(".product-ticker", {
			slidesPerView:"auto",
			speed: 10000,
			initialSlide: 3,
			loop: true,
			loopedSlides: 10,
			allowTouchMove: false,
			waitForTransition: false,
			watchSlidesProgress: false,
			autoplay: {
				delay: 0,
				disableOnInteraction: false,
			},
		});
	};
	
	tickSlider2();
	document.addEventListener("shopify:section:load", function () {
		setTimeout(() => {
			tickSlider2();
		}, 100);
	});

	document.addEventListener("visibilitychange", function () {
		if (!document.hidden) {
			$(".product-ticker").each(function () {
				this.swiper.destroy();
			});
			tickSlider2();
		}
	});

	setTimeout(() => {
		tickSlider2();
	}, 100);
})();
