(function () {
	let swiperMulticolumn;
	const multicolumnSwipeEnabled = document.querySelector(
		".swiper--multicolumn"
	);

	const initSlider = () => {
		const slides = document.querySelectorAll(".multicolumn-list__item");

		slides.forEach((slide) => {
			slide.classList.add("swiper-slide");
		});

		swiperMulticolumn = new Swiper(".swiper--multicolumn", {
			loop: false,
			speed: 1100,
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			},
		});
	};

	const destroySlider = () => {
		const slides = document.querySelectorAll(".multicolumn-list__item");

		swiperMulticolumn.destroy(true, true);
		swiperMulticolumn = undefined;

		slides.forEach((slide) => {
			slide.removeAttribute("style");
			slide.classList.remove("swiper-slide");
		});
	};

	const initMulticolumn = () => {
		const multicolumnSection = document.querySelector(".multicolumn-section");

		const sectionResizeObserver = new ResizeObserver((entries) => {
			const [entry] = entries;

			if (entry.contentRect.width < 990 && multicolumnSwipeEnabled) {
				initSlider();
			} else if (swiperMulticolumn) {
				destroySlider();
			}
		});

		sectionResizeObserver.observe(multicolumnSection);
	};

	if (swiperMulticolumn) {
		destroySlider();
	}
	initMulticolumn();
	document.addEventListener("shopify:section:load", function () {
		if (swiperMulticolumn) {
			destroySlider();
		}
		initMulticolumn();
	});
})();
