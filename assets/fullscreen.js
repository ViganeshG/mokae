//button-with-underline
if (window.screen.width > 990) {
	let attachedFullScreen = false;

	let fullScreenSection = document.querySelector(
		".product-full-screen-section"
	);

	let imageContainerFullScreen = fullScreenSection.querySelector(
		".button--with-underline--container"
	);

	const followMouseFullScreen = (event) => {
		if (imageContainerFullScreen) {
			imageContainerFullScreen.style.left = event.pageX + "px";
			imageContainerFullScreen.style.top = event.pageY + 30 + "px";
		}
	};

	function showTextFull() {
		if (!attachedFullScreen && imageContainerFullScreen) {
			attachedFullScreen = true;
			imageContainerFullScreen.style.display = "block";
			document.addEventListener("pointermove", followMouseFullScreen);
		}
	}

	function hideTextFull() {
		if (imageContainerFullScreen) {
			attachedFullScreen = false;
			imageContainerFullScreen.style.display = "";
			document.removeEventListener("pointermove", followMouseMarkers);
		}
	}
}
