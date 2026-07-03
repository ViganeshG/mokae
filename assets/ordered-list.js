(function () {
	const orderedListSection = document.querySelector('.ordered-list-section');
	const images = orderedListSection.querySelectorAll('.js-parallax');
	const arr = [-70, -15, -40, -10, -50, -20];

	images.forEach((image, i) => {
		image.setAttribute('data-parallax-property-value', arr[i]);
	});
})();
