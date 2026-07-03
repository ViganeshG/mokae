const facetsMenu = () => {
	$("html.js .no_submit").click(function (e) {
		e.preventDefault();
	});
	$(
		".open_filters,.facets-menu__close,.facets__submit,.facets__reset,.form-menu__mask"
	).click(function () {
		$("#open_filters_menu").toggleClass("show_menu");
		$("body").toggleClass("overflow-hidden");
		$("body").toggleClass("open-filters");
		$(".shopify-section-header").toggleClass("low_index");
		$(".section-announcement").toggleClass("low_index");
	});
};

document.addEventListener("DOMContentLoaded", function () {
	facetsMenu();
});
document.addEventListener("shopify:section:load", function () {
	facetsMenu();
});

let menu = document.querySelector(".facets-menu");

document
	.querySelector(".select__sort_by")
	.addEventListener("click", function () {
		document
			.querySelector(".facets__sort-by svg")
			.classList.toggle("rotateSvg");
	});
