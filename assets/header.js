(function () {
	const header = () => {
		const body = document.querySelector("body");
		const openBtn = document.querySelector(".header__offcanvas-toggle");
		const closeBtn = document.querySelector(
			".header__offcanvas-toggle-link--close"
		);
		const offMenu = document.querySelector(".header__offcanvas-menu");
		const searchDetails = document.querySelector(".header__details");
		const submenuDetails = document.querySelectorAll(
			".header__submenu li details"
		);

		const headerHiddenMenu = document.querySelector(".header__inline-menu");
		const openSearchBtn = document.querySelector(".header__search");

		const openMenu = (e) => {
			e.preventDefault();
			offMenu.classList.remove("header__offcanvas-menu--close");
			offMenu.classList.add("header__offcanvas-menu--open");
			openBtn.classList.add("active");
			body.classList.add("body--hidden");
			closeBtn.style.display = "block";
			openBtn.style.display = "none";
			headerHiddenMenu.style.display = "none";
		};

		const closeMenu = () => {
			offMenu.classList.remove("header__offcanvas-menu--open");
			offMenu.classList.add("header__offcanvas-menu--close");
			openBtn.classList.remove("active");
			body.classList.remove("body--hidden");
			closeBtn.style.display = "none";
			openBtn.style.display = "block";
			headerHiddenMenu.style.display = "block";
			document
				.querySelector(".header")
				.classList.remove("search-header--opened");
		};

		openBtn && openBtn.addEventListener("click", openMenu);
		closeBtn &&
			closeBtn.addEventListener("click", function (e) {
				e.preventDefault();
				closeMenu();
			});

		submenuDetails.forEach((targetDetail) => {
			targetDetail.addEventListener("click", () => {
				submenuDetails.forEach((detail) => {
					if (detail !== targetDetail) {
						detail.removeAttribute("open");
						document
							.querySelector(".header")
							.classList.remove("search-header--opened");
					}
				});
			});
		});

		document.addEventListener("keyup", (e) => {
			if (e.key === "Escape") {
				closeMenu();
				searchDetails.removeAttribute("open");
				body.classList.remove("overflow-hidden");
				body.classList.remove("search-overflow-hidden");
				document
					.querySelector(".header")
					.classList.remove("search-header--opened");

				//document
				//	.querySelector(".header__icons")
				//	.classList.remove("hide-header-line");
				//document
				//	.querySelector(".header__inline-menu")
				//	.classList.remove("hide-header-line");
				//document
				//	.querySelector(".header__offcanvas")
				//	.classList.remove("hide-header-line");
			}
		});

		openSearchBtn.addEventListener("click", () => {
			if (searchDetails.open) {
				body.classList.add("overflow-hidden");
				body.classList.add("search-overflow-hidden");
				document
					.querySelector(".header")
					.classList.add("search-header--opened");

				//document
				//	.querySelector(".header__icons")
				//	.classList.add("hide-header-line");
				//document
				//	.querySelector(".header__inline-menu")
				//	.classList.add("hide-header-line");
				//document.querySelector(
				//	".header__search .modal-close-button"
				//).style.display = "block";
				//document
				//	.querySelector(".header__offcanvas")
				//	.classList.add("hide-header-line");
			} else {
				body.classList.remove("overflow-hidden");
				body.classList.remove("search-overflow-hidden");
				document
					.querySelector(".header")
					.classList.remove("search-header--opened");

				//document
				//	.querySelector(".header__icons")
				//	.classList.remove("hide-header-line");
				//document
				//	.querySelector(".header__inline-menu")
				//	.classList.remove("hide-header-line");
				//document
				//	.querySelector(".header__offcanvas")
				//	.classList.remove("hide-header-line");
			}
		});

		let headerOverlayAlways = document.querySelector(".overlay");

		$(window).scroll(function () {
			if ($(this).scrollTop() > 50) {
				headerOverlayAlways && $(".header").addClass("header_overlay-scroll");
			} else {
				headerOverlayAlways &&
					$(".header").removeClass("header_overlay-scroll");
			}
		});
	};

	document
		.querySelector(".search-modal-close-button")
		.addEventListener("click", function () {
			document
				.querySelector(".header")
				.classList.remove("search-header--opened");
			document.querySelector(".header__details").removeAttribute("open");
			document
				.querySelector(".header")
				.classList.remove("search-header--opened");
		});

	let searchTabs = document.querySelectorAll(".predictive-search__result-tab");
	let results = document.querySelectorAll(".search__items-list");

	if (results.length != 0) {
		results[0].classList.add("active");
		searchTabs[0].classList.add("active");
	}
	searchTabs.forEach((tab) => {
		tab.addEventListener("click", (event) => {
			event.preventDefault();
			let typeTarget = tab.dataset.typeTarget;

			searchTabs.forEach((element) => {
				element.classList.remove("active");
			});
			tab.classList.add("active");

			results.forEach((element) => {
				let resultsType = element.dataset.type;
				if (resultsType == typeTarget) {
					element.classList.add("active");
				} else {
					element.classList.remove("active");
				}
			});
		});
	});

	const announcementBar = document.querySelector(".announcement-bar");
	const headerOffcanvas = document.querySelector(".header__offcanvas-wrapper");

	announcementBar &&
		headerOffcanvas &&
		headerOffcanvas.classList.add("announcement-bar-show");

	$(window).scroll(function () {
		if ($(window).scrollTop() > 100) {
			announcementBar &&
				headerOffcanvas &&
				headerOffcanvas.classList.add("announcement-bar-hide");
			announcementBar &&
				headerOffcanvas &&
				headerOffcanvas.classList.remove("announcement-bar-show");
		} else {
			announcementBar &&
				headerOffcanvas &&
				headerOffcanvas.classList.remove("announcement-bar-hide");
			announcementBar &&
				headerOffcanvas &&
				headerOffcanvas.classList.add("announcement-bar-show");
		}
	});

	document.addEventListener("shopify:section:load", header);

	header();
})();

//button-with-underline
if (window.screen.width > 990) {
	let attachedHeader = false;

	let headerSection = document.querySelector(".shopify-section-header");

	let imageContainerHeader = headerSection.querySelector(
		".button--with-underline--container"
	);

	const followMouseHeader = (event) => {
		if (imageContainerHeader) {
			imageContainerHeader.style.left = event.pageX + "px";
			let mouseEvent =
				event.pageY - window.scrollY - headerSection.offsetHeight + 30;
			imageContainerHeader.style.top = mouseEvent + "px";
		}
	};

	function showTextHeader() {
		if (!attachedHeader && imageContainerHeader) {
			attachedHeader = true;
			imageContainerHeader.style.display = "block";
			document.addEventListener("pointermove", followMouseHeader);
		}
	}

	function hideTextHeader() {
		if (imageContainerHeader) {
			attachedHeader = false;
			imageContainerHeader.style.display = "";
			document.removeEventListener("pointermove", followMouseHeader);
		}
	}
}
