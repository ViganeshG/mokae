(function () {
	const logoSlideshow = () => {
		$(".logo-slideshow-section").each(function () {
			if ($(this).hasClass("slider_started")) {
				return "";
			}
			$(this).addClass("slider_started");
			const id = $(this).attr("id");
			const box = $(this).find(".logo-slideshow");
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
				autoplayParm = {};
			}
			let swiperParms = {
				parallax: true,
				speed: box.data("speed") * 1000,
				loop: true,
				navigation: {
					nextEl: `#${id} .swiper-button-next`,
					prevEl: `#${id} .swiper-button-prev`,
				},
				pagination: {
					el: `#${id} .swiper-pagination`,
					clickable: true,
				},
				...autoplayParm,
			};
			const swiper = new Swiper(`#${id} .logo-slideshow__swiper`, swiperParms);
			colorScheme(swiper);
			swiper.on("beforeTransitionStart", function () {
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
				const colorScheme = $(activeSlide)
					.find(".logo-slideshow-slide")
					.data("color-scheme");
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
		const logoSection = document.querySelector(".logo-slideshow-section");

		if (logoSection) {
			if ("IntersectionObserver" in window) {
				// Defer Swiper+parallax init until the section is near the viewport.
				// This removes one full Swiper init (~80-100ms) from the
				// DOMContentLoaded execution burst.
				const io = new IntersectionObserver(
					function (entries) {
						if (entries[0].isIntersecting) {
							logoSlideshow();
							io.disconnect();
						}
					},
					{ rootMargin: "300px 0px" }
				);
				io.observe(logoSection);
			} else {
				// Fallback for older browsers: delay by 500ms to clear
				// the DOMContentLoaded burst before initializing
				setTimeout(logoSlideshow, 500);
			}
		}

		document.addEventListener("shopify:section:load", function () {
			logoSlideshow();
		});
	});
})();
