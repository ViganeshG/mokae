(function () {
	const tickSlider = () => {
		$(".product-ticker1").each(function () {
			const tickerId = $(this).data("ticker-id");
			const tickerSpeed = $(this).data("ticker-speed") * 1000;
			const tickerSwiper = new Swiper(`.product-ticker-js-${tickerId}`, {
				slidesPerView: "auto",
				speed: tickerSpeed,
				initialSlide: 0,
				loop: true,
				allowTouchMove: false,
				waitForTransition: false,
				watchSlidesProgress: false,
				autoplay: {
					delay: 0,
					disableOnInteraction: false,
				},
			});
		});

		$(".product-ticker2").each(function () {
			const tickerId = $(this).data("ticker-id");
			const tickerSpeed = $(this).data("ticker-speed") * 1000;
			const tickerSwiper2 = new Swiper(`.product-ticker-js-${tickerId}`, {
				slidesPerView: "auto",
				speed: tickerSpeed,
				initialSlide: 0,
				loop: true,
				allowTouchMove: false,
				waitForTransition: false,
				watchSlidesProgress: false,
				autoplay: {
					delay: 0,
					disableOnInteraction: false,
				},
			});
		});
	};

	document.addEventListener("DOMContentLoaded", function () {
		tickSlider();
		document.addEventListener("shopify:section:load", function () {
			tickSlider();
		});
	});
})();
