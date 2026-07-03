(function () {
	const twentytwentyTwo = () => {
		const twentytwentySlider = $(".twentytwenty-container").twentytwenty({
			default_offset_pct: 0.6,
		});
	};

	document.addEventListener("shopify:section:load", function () {
		twentytwentyTwo();
	});

	twentytwentyTwo();
})();

//button-with-underline
if (window.screen.width > 990) {
	let attachedCompare = false;

	let compareSection = document.querySelector(".product-compare-section");

	let imageContainerCompare = compareSection.querySelector(
		".button--with-underline--container"
	);

	const followMouseCompare = (event) => {
		if (imageContainerCompare) {
			imageContainerCompare.style.left = event.pageX + "px";
			imageContainerCompare.style.top = event.pageY + 30 + "px";
		}
	};

	function showTextCompare() {
		if (!attachedCompare && imageContainerCompare) {
			attachedCompare = true;
			imageContainerCompare.style.display = "block";
			document.addEventListener("pointermove", followMouseCompare);
		}
	}

	function hideTextCompare() {
		if (imageContainerCompare) {
			attachedCompare = false;
			imageContainerCompare.style.display = "";
			document.removeEventListener("pointermove", followMouseCompare);
		}
	}
}
