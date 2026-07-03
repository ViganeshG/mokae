(function () {
	const initTimer = () => {
		$(".js-product-countdown").each(function () {
			const userDate = $(this).data("date");
			const userTime = $(this).data("time");
			const timerSection = $(".js-product-timer-slider").data("id");
			const completedCountdown = $(this).data("completed");
			const countdown = $(this).find(".product-countdown__body");
			const countdownHeading = $(this).find(".product-countdown__heading");
			const daysEl = $(this).find(".product-countdown_block_days");
			const hoursEl = $(this).find(".product-countdown_block_hours");
			const minutesEl = $(this).find(".product-countdown_block_minutes");
			const secondsEl = $(this).find(".product-countdown_block_seconds");
			const section = $(this).parent(".shopify-section");
			// ----------------------------------------------------------------
			const countdownDate = new Date(`${userDate}T${userTime}`);
			const now = new Date();
			const distance = countdownDate.getTime() - now.getTime();
			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor(
				(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			);
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((distance % (1000 * 60)) / 1000);
			// ----------------------------------------------------------------
			if (distance < 0 && completedCountdown === "hide_section") {
				clearInterval(initTimer);
				section.stop(false, false).fadeOut(0);
				const sec = $(this).closest(".js-product-timer-slider");
				sec.hide();
				sec.css("display", "none");
			} else if (distance < 0 && completedCountdown === "show_text") {
				countdown.stop(false, false).fadeOut(0);
				countdownHeading.stop(false, false).fadeIn();
			} else {
				daysEl.html(days < 10 ? "0" + days : days);
				hoursEl.html(hours < 10 ? "0" + hours : hours);
				minutesEl.html(minutes < 10 ? "0" + minutes : minutes);
				secondsEl.html(seconds < 10 ? "0" + seconds : seconds);
			}
			// ----------------------------------------------------------------
		});
	};
	document.addEventListener("shopify:section:load", function () {
		if (!document.hidden) {
			setInterval(initTimer, 1000);
		}
	});
	if (!document.hidden) {
		setInterval(initTimer, 1000);
	}
})();

//button-with-underline
if (window.screen.width > 990) {
	let attachedTimer = false;

	let timerSection = document.querySelector(".product-timer-section");

	let imageContainerTimer = timerSection.querySelector(
		".button--with-underline--container"
	);

	const followMouseTimer = (event) => {
		if (imageContainerTimer) {
			imageContainerTimer.style.left = event.pageX + "px";
			imageContainerTimer.style.top = event.pageY + 30 + "px";
		}
	};

	function showTextTimer() {
		if (!attachedTimer && imageContainerTimer) {
			attachedTimer = true;
			imageContainerTimer.style.display = "block";
			document.addEventListener("pointermove", followMouseTimer);
		}
	}

	function hideTextTimer() {
		if (imageContainerTimer) {
			attachedTimer = false;
			imageContainerTimer.style.display = "";
			document.removeEventListener("pointermove", followMouseTimer);
		}
	}
}
