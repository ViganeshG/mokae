(function () {
	const prodSlider = () => {
		$(".product-own-slider-section").each(function () {
			if ($(this).hasClass("slider_started")) {
				return "";
			}

			$(this).addClass("slider_started");
			const id = $(this).attr("id");

			let prodSliderSwiperParams = {
				centeredSlides: false,
				slidesPerView: 1,
				autoHeight: false,
				calculateHeight: false,
				waitForTransition: false,
				watchSlidesProgress: false,
				updateOnWindowResize: true,
				preloadImages: false,
				spaceBetween: 4,
				allowTouchMove: true,
			};
			const swiperRightImg = new Swiper(`#${id} .product-slider__right-block`, {
				...prodSliderSwiperParams,
				autoplay: false,
				// allowTouchMove: false,
			});
			const prodSlider = new Swiper(`#${id} .swiper-product-slider`, {
				navigation: {
					nextEl: `#${id} .swiper-button-next__prod-slider`,
					prevEl: `#${id} .swiper-button-prev__prod-slider`,
				},
				pagination: {
					el: `#${id} .swiper-pagination`,
					clickable: true,
				},
				...prodSliderSwiperParams,
			});
			swiperRightImg.controller.control = prodSlider;
			prodSlider.controller.control = swiperRightImg;
			colorScheme(prodSlider);
			prodSlider.on("beforeTransitionStart", function () {
				colorScheme(this);
			});
			function colorScheme(context) {
				const activeIndex = context.activeIndex;
				const activeSlide = context.slides[activeIndex];
				const changeItems = [
					context.navigation.nextEl,
					context.navigation.prevEl,
					context.pagination.el,
				];
				const colorScheme = $(activeSlide).data("color-scheme");
				changeItems.forEach((item) => {
					$(item)
						.removeClass("color-background-1")
						.removeClass("color-background-4")
						.addClass(colorScheme);
				});
			}
		});
	};

	document.addEventListener("DOMContentLoaded", function () {
		prodSlider();
	});

	document.addEventListener("shopify:section:load", function () {
		prodSlider();
	});

	prodSlider();
})();

//button-with-underline

if (window.screen.width > 990) {
	let attachedSlider = false;

	let sliderSection = document.querySelector(".product-own-slider-section");

	let imageContainerSlider = sliderSection.querySelector(
		".button--with-underline--container"
	);

	const followMouseSlider = (event) => {
		if (imageContainerSlider) {
			imageContainerSlider.style.left = event.pageX + "px";
			imageContainerSlider.style.top = event.pageY + 30 + "px";
		}
	};

	function showTextSlider() {
		if (!attachedSlider && imageContainerSlider) {
			attachedSlider = true;
			imageContainerSlider.style.display = "block";
			document.addEventListener("pointermove", followMouseSlider);
		}
	}

	function hideTextSlider() {
		if (imageContainerSlider) {
			attachedSlider = false;
			imageContainerSlider.style.display = "";
			document.removeEventListener("pointermove", followMouseSlider);
		}
	}
}
