(function () {
	const imageCollageSection = document.querySelector('.image-collage-section');
	const images = imageCollageSection.querySelectorAll('.js-parallax');
	const arr = [-70, 70, 15, -30];

	images.forEach((image, i) => {
		image.setAttribute('data-parallax-property-value', arr[i]);
	});
})();
