(function () {
	// Cache element list once. Re-querying on every scroll tick is expensive.
	// Refreshed when Shopify sections reload (see below).
	let parallaxItems = document.querySelectorAll('.js-parallax');

	let scrollAnimate = function (items) {
		if (!items.length) return;

		// ── STEP 1: BATCH ALL READS ─────────────────────────────────────────────
		// Read all layout-affecting values before writing anything.
		// The original code called getBoundingClientRect() twice per element
		// (once for .top, once for .height) and then wrote style, then repeated
		// the read in the next loop iteration — classic layout thrash.
		// Batching eliminates forced reflows.
		const cHeight = document.documentElement.clientHeight;
		const currentScrollY = pageYOffset;
		const scrollStartPoint = currentScrollY + cHeight;

		const measurements = [];
		for (let i = 0; i < items.length; i++) {
			const rect = items[i].getBoundingClientRect(); // single call per element
			measurements.push({
				elem: items[i],
				topPosition: rect.top,
				bottomPosition: rect.top + rect.height, // use cached rect, not a second getBoundingClientRect
			});
		}

		// ── STEP 2: BATCH ALL WRITES ─────────────────────────────────────────────
		// Write only after all reads are done. style.prop = value is more
		// targeted than setAttribute('style', ...) which overwrites all inline styles.
		for (let j = 0; j < measurements.length; j++) {
			const { elem, topPosition, bottomPosition } = measurements[j];

			if (
				scrollStartPoint > topPosition + currentScrollY &&
				bottomPosition + currentScrollY > currentScrollY
			) {
				let start = topPosition + currentScrollY - cHeight;
				let end = bottomPosition + currentScrollY;
				let percentScroll = parseInt(
					(currentScrollY - start) / ((end - start) / 100),
				);

				let property = elem.getAttribute('data-parallax-property');
				let propertyVal =
					(parseInt(elem.getAttribute('data-parallax-property-value')) / 100) *
					percentScroll;
				let parallaxSteps = elem.getAttribute('data-parallax-steps');

				switch (property) {
					case 'translateY':
						if (!parallaxSteps) {
							elem.style.transform = `translate3d(0px, ${propertyVal}px, 0px)`;
						} else {
							let tyArr = parallaxSteps.split(', ');
							let tyStart = parseInt(tyArr[0]);
							let tyEnd = parseInt(tyArr[1]);
							if (percentScroll >= tyStart && percentScroll <= tyEnd) {
								let stepPct = (100 / (tyEnd - tyStart)) * (percentScroll - tyStart);
								propertyVal =
									(parseInt(elem.getAttribute('data-parallax-property-value')) / 100) *
									stepPct;
							} else if (percentScroll > tyEnd) {
								propertyVal = parseInt(
									elem.getAttribute('data-parallax-property-value'),
								);
							} else {
								propertyVal = 0;
							}
							elem.style.transform = `translate3d(0px, ${propertyVal}px, 0px)`;
						}
						break;

					case 'rotate':
						elem.style.transform = `rotate(${propertyVal}deg)`;
						break;

					case 'translateX':
						elem.style.transform = `translateX(${propertyVal}px)`;
						break;

					case 'scaleY':
						if (!parallaxSteps) {
							elem.style.transform = `scaleY(${propertyVal / 100})`;
						} else {
							let syArr = parallaxSteps.split(', ');
							let syStart = parseInt(syArr[0]);
							let syEnd = parseInt(syArr[1]);
							if (percentScroll >= syStart && percentScroll <= syEnd) {
								propertyVal =
									(100 / (syEnd - syStart)) * (percentScroll - syStart) / 100;
							} else if (percentScroll > syEnd) {
								propertyVal =
									parseInt(elem.getAttribute('data-parallax-property-value')) / 100;
							} else {
								propertyVal = 0;
							}
							elem.style.transform = `scaleY(${propertyVal})`;
						}
						break;

					case 'opacity':
						if (!parallaxSteps) {
							elem.style.opacity = propertyVal / 100;
						} else {
							let opArr = parallaxSteps.split(', ');
							let opStart = parseInt(opArr[0]);
							let opEnd = parseInt(opArr[1]);
							if (percentScroll >= opStart && percentScroll <= opEnd) {
								propertyVal =
									(100 / (opEnd - opStart)) * (percentScroll - opStart) / 100;
							} else if (percentScroll > opEnd) {
								propertyVal = parseInt(
									elem.getAttribute('data-parallax-property-value'),
								);
							} else {
								propertyVal = 0;
							}
							elem.style.opacity = propertyVal;
						}
						break;

					case 'scaleX':
						if (!parallaxSteps) {
							// Preserving original behaviour: recalculates propertyVal
							// but does not write to DOM (matches original code)
							propertyVal = propertyVal / 100;
						} else {
							let sxArr = parallaxSteps.split(', ');
							let sxStart = parseInt(sxArr[0]);
							let sxEnd = parseInt(sxArr[1]);
							if (percentScroll >= sxStart && percentScroll <= sxEnd) {
								propertyVal =
									(100 / (sxEnd - sxStart)) * (percentScroll - sxStart) / 100;
							} else if (percentScroll > sxEnd) {
								propertyVal =
									parseInt(elem.getAttribute('data-parallax-property-value')) / 100;
							} else {
								propertyVal = 0;
							}
							elem.style.transform = `scaleX(${propertyVal})`;
						}
						break;
				}
			}
		}
	};

	// ── rAF THROTTLE ─────────────────────────────────────────────────────────────
	// Without this, scrollAnimate runs synchronously on EVERY scroll event,
	// which can fire 60+ times per second. requestAnimationFrame coalesces
	// multiple scroll events into a single visual update per frame.
	// passive:true tells the browser this handler never calls preventDefault(),
	// allowing smooth scrolling without waiting for JS execution.
	let rafScheduled = false;
	window.addEventListener(
		'scroll',
		function () {
			if (!rafScheduled) {
				rafScheduled = true;
				requestAnimationFrame(function () {
					scrollAnimate(parallaxItems);
					rafScheduled = false;
				});
			}
		},
		{ passive: true },
	);

	// Run once on initial load to set initial positions
	scrollAnimate(parallaxItems);

	// Refresh cached items when a Shopify section reloads (theme editor)
	document.addEventListener('shopify:section:load', function () {
		parallaxItems = document.querySelectorAll('.js-parallax');
		scrollAnimate(parallaxItems);
	});
})();
