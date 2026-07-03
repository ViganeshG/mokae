(function () {
	const initProductAccordion = () => {
		$(".about__wrapper").each(function () {
			const $wrapper = $(this);

			$wrapper.find(".about__accordion-title").off("click.mokaeAccordion").on("click.mokaeAccordion", function () {
				const $title = $(this);
				const $description = $title.siblings(".about__accordion-description");

				if (!$title.hasClass("active")) {
					$wrapper.find(".about__accordion-title.active").removeClass("active");
					$wrapper.find(".about__accordion-description").stop().slideUp(300);
					$title.addClass("active");
					$description.stop().slideDown(300);
				} else {
					$title.removeClass("active");
					$description.stop().slideUp(300);
				}
			});
		});
	};

	document.addEventListener("shopify:section:load", function () {
		initProductAccordion();
	});

	initProductAccordion();
})();
