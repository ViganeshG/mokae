(function () {
	const calcHeight = () => {
		const card = document.querySelector('.collection-hero--overlay .collection-hero__product-card');
		const collectionBannerSection = document.querySelector('.collection-hero--overlay');

    if (card) {
      const cardRect = card.getBoundingClientRect();
		  const cardHeight = cardRect.height;
			collectionBannerSection.style.paddingBottom = '0';
      collectionBannerSection.style.marginBottom = '0';
			if (window.screen.width > 749) {
				collectionBannerSection.style.paddingBottom = `${cardHeight / 2}px`;
      	collectionBannerSection.style.marginBottom = `${cardHeight / 2 + 64}px`;
			}
    }
	};

	const initCollectionBanner = () => {
		const collectionBannerSection = document.querySelector('.collection-banner-section');

		const sectionResizeObserver = new ResizeObserver((entries) => {

			const [entry] = entries;
      calcHeight();
		});

		sectionResizeObserver.observe(collectionBannerSection);
	}

	document.addEventListener('shopify:section:load', function () {
		initCollectionBanner();
	});

	initCollectionBanner();
})();
