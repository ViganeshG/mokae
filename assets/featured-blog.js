(function () {
	const blogSlider = () => {
		$(".section-featured-blog").each(function () {
			const slide = $(this).find(".swiper-slide");
			const carousel = $(this).find(".feat-blog-swiper");
			const buttonNext = $(this).find(".swiper-button-next");

			if ($(this).hasClass("slider_started")) {
				return "";
			}

			$(this).addClass("slider_started");
			const id = $(this).attr("id");

			let featBlogParams = {
				slidesPerView: 1.1,
				waitForTransition: false,
				updateOnWindowResize: true,
				preLoadImage: true,
				autoHeight: false,
				allowTouchMove: true,
				spaceBetween: 4,
				breakpoints: {
					576: {
						slidesPerView: 2.1,
					},

					1360: {
						slidesPerView: 3.1,
					},

					2340: {
						slidesPerView: 4.1,
					},

					2640: {
						slidesPerView: 5.1,
					},
				},
				on: {
					slideChange: function () {
						if (this.activeIndex === 0) {
							Array.from(slide).forEach((element) => {
								element.classList.remove("slide_change-postion");
							});
							Array.from(carousel).forEach((element) => {
								element.classList.add("carousel_change-postion_next");
								element.classList.remove("carousel_change-postion_prev");
								element.classList.remove("carousel_change-postion_next-2");
							});
							this.update();
						} else {
							if (this.activeIndex > this.previousIndex) {
								Array.from(carousel).forEach((element) => {
									element.classList.remove("carousel_change-postion_next");
									element.classList.remove("carousel_change-postion_next-2");
									element.classList.add("carousel_change-postion_prev");
								});
								Array.from(slide).forEach((element) => {
									if (buttonNext.hasClass("swiper-button-disabled")) {
										element.classList.remove("slide_change-postion");
									} else {
										element.classList.add("slide_change-postion");
									}
								});
							} else {
								Array.from(carousel).forEach((element) => {
									element.classList.add("carousel_change-postion_next-2");
									element.classList.remove("carousel_change-postion_prev");
								});
								Array.from(slide).forEach((element) => {
									element.classList.remove("slide_change-postion");
								});
							}
							this.update();
						}
					},
				},
			};

			const swiper1 = new Swiper(`#${id} .feat-blog-swiper`, {
				navigation: {
					nextEl: `#${id} .swiper-button-next_blog`,
					prevEl: `#${id} .swiper-button-prev_blog`,
				},
				...featBlogParams,
			});
		});
	};
	document.addEventListener("shopify:section:load", function () {
		setTimeout(() => {
			blogSlider();
		}, 100);
	});

	window.addEventListener("onload", function () {
		setTimeout(() => {
			blogSlider();
		}, 100);
	});

	setTimeout(() => {
		blogSlider();
	}, 100);
})();
