(function () {
	const slideshow = () => {
		$(".slideshow-section").each(function () {
			if ($(this).hasClass("slider_started")) {
				return "";
			}
			$(this).addClass("slider_started");
			const id = $(this).attr("id");
			const box = $(this).find(".slideshow");
			const autoplay = box.data("autoplay");
			const stopAutoplay = box.data("stop-autoplay");
			const delay = box.data("delay") * 1000;
			const slideCount = box.data("count");
			const loop = slideCount == 1 ? false : true;

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
				spaceBetween: 0,
				speed: box.data("speed") * 1000,
				loop: loop,
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
			const swiper = new Swiper(`#${id} .slideshow__swiper`, swiperParms);
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
					.find(".slideshow-slide")
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
		const sections = document.querySelectorAll(".slideshow-section");

		if (!sections.length) return;

		// Always initialize the FIRST slideshow immediately — it is the
		// above-fold hero and must render without delay.
		slideshow();

		// If additional slideshow sections exist below the fold, initialize
		// them lazily via IntersectionObserver so they do not add to the
		// DOMContentLoaded execution burst.
		if (sections.length > 1 && "IntersectionObserver" in window) {
			const io = new IntersectionObserver(
				function (entries) {
					entries.forEach(function (entry) {
						if (entry.isIntersecting) {
							slideshow(); // existing guard (slider_started) prevents re-init
							io.unobserve(entry.target);
						}
					});
				},
				{ rootMargin: "300px 0px" }
			);
			// Observe all but the first (already initialized above)
			for (let i = 1; i < sections.length; i++) {
				if (!sections[i].classList.contains("slider_started")) {
					io.observe(sections[i]);
				}
			}
		}

		document.addEventListener("shopify:section:load", function () {
			slideshow();
		});
	});
})();
