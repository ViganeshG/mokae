(function () {
	const productSliderV1 = () => {
		$(".product-slideshow-section").each(function () {
			if ($(this).hasClass("slider_started")) {
				return "";
			}
			$(this).addClass("slider_started");
			const id = $(this).attr("id");
			const box = $(this).find(".js-product-slideshow-slider");
			const autoplay = box.data("autoplay");
			const stopAutoplay = box.data("stop-autoplay");
			const delay = box.data("delay") * 1000;
			if (autoplay) {
				autoplayParm = {
					autoplay: {
						delay: delay,
						pauseOnMouseEnter: stopAutoplay,
						disableOnInteraction: false,
					},
				};
			} else {
				autoplayParm = { autoplay: false };
			}
			let swiperParms = {
				effect: box.data("effect"),
				speed: box.data("speed") * 1000,
				creativeEffect: {
					prev: {
						shadow: false,
						translate: [0, 0, -400],
					},
					next: {
						translate: ["100%", 0, 0],
					},
				},
				coverflowEffect: {
					rotate: 50,
					stretch: 0,
					depth: 100,
					modifier: 1,
					slideShadows: false,
				},
				loop: true,
				autoHeight: false,
				calculateHeight: false,
				keyboard: true,
				slideShadows: false,
				flipEffect: {
					slideShadows: false,
				},
				pagination: {
					el: `#${id} .swiper-pagination`,
					clickable: true,
				},
				...autoplayParm,
			};
			const swiperText = new Swiper(
				`#${id} .js-product-slider-v1-swiper`,
				swiperParms
			);
		});
	};

	document.addEventListener("DOMContentLoaded", function () {
		productSliderV1();
		document.addEventListener("shopify:section:load", function () {
			productSliderV1();
		});
	});
})();

//button-with-underline
if (window.screen.width > 990) {
	let attachedSlideshow = false;

	let slideshowSection = document.querySelector(".product-slider-v1");

	let imageContainerSlideshow = slideshowSection.querySelector(
		".button--with-underline--container"
	);

	const followMouseSlideshow = (event) => {
		if (imageContainerSlideshow) {
			imageContainerSlideshow.style.left = event.pageX - 63 + "px";
			imageContainerSlideshow.style.top = event.pageY + 30 + "px";
		}
	};

	function showTextSlideshow() {
		if (!attachedSlideshow && imageContainerSlideshow) {
			attachedSlideshow = true;
			imageContainerSlideshow.style.display = "block";
			document.addEventListener("pointermove", followMouseSlideshow);
		}
	}

	function hideTextSlideshow() {
		if (imageContainerSlideshow) {
			attachedSlideshow = false;
			imageContainerSlideshow.style.display = "";
			document.removeEventListener("pointermove", followMouseSlideshow);
		}
	}
}
