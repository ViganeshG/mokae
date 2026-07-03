(function () {
	document.addEventListener("shopify:section:load", function () {
		const slider = new Swiper(".js-media-list", getSliderSettings);
		const subSlider = new Swiper(
			".js-media-sublist",
			getSubSliderProductSettings
		);
		setTimeout(function () {
			slider.update();
			subSlider.update();
		}, 200);
	});
})();

//button-with-underline
if (window.screen.width > 990) {
	let attachedCompare = false;

	let mainProductSection = document.querySelector(".perfect-fit-description");

	if (mainProductSection) {
		let imageContainerMainProduct = mainProductSection.querySelector(
			".button--with-underline--container"
		);

		const followMouseMainProduct = (event) => {
			if (imageContainerMainProduct) {
				imageContainerMainProduct.style.left = event.pageX + "px";
				imageContainerMainProduct.style.top = event.pageY + 30 + "px";
			}
		};

		function showTextMainProduct() {
			if (!attachedCompare && imageContainerMainProduct) {
				attachedCompare = true;
				imageContainerMainProduct.style.display = "block";
				document.addEventListener("pointermove", followMouseMainProduct);
			}
		}

		function hideTextMainProduct() {
			if (imageContainerMainProduct) {
				attachedCompare = false;
				imageContainerMainProduct.style.display = "";
				document.removeEventListener("pointermove", followMouseMainProduct);
			}
		}
	}
}
