(function () {
	function swiperInit() {
		subSliderInit(true);
		sliderInit(true);
		updatethumbnail(true);
	}

	document.addEventListener("shopify:section:load", function () {
		swiperInit();
	});

	document.addEventListener("resize", function () {
		swiperInit();
	});

	document.addEventListener("visibilitychange", function () {
		swiperInit();
	});

	swiperInit();
})();
