(function () {
	let galleryTextSlide = () => {
		$(".gallery-with-text__card").hover(function () {
			$(this).addClass('active');
			$(this).siblings(".gallery-with-text__card").removeClass('active');
		});
	}

	document.addEventListener('shopify:section:load', function () {
		galleryTextSlide();
	});

	galleryTextSlide();

})();
