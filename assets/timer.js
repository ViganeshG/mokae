// (function () {
// 	const initTimer = () => {
// 		const element = document.getElementById("js-carousel");
// 		const userDate = element.getAttribute("data-date");
// 		const countdownDate = new Date(`${userDate}T00:00:00`);
// 		const now = new Date();
// 		const distance = countdownDate.getTime() - now.getTime();
// 		const days = Math.floor(distance / (1000 * 60 * 60 * 24));
// 		const hours = Math.floor(
// 			(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
// 		);
// 		const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
// 		const seconds = Math.floor((distance % (1000 * 60)) / 1000);
// 		const daysEl = document.querySelector(".timer__block__days");
// 		const hoursEl = document.querySelector(".timer__block__hours");
// 		const minutesEl = document.querySelector(".timer__block__minutes");
// 		const secondsEl = document.querySelector(".timer__block__seconds");
// 		if (distance < 0) {
// 			clearInterval(initTimer);
// 			daysEl.textContent = "00";
// 			hoursEl.textContent = "00";
// 			minutesEl.textContent = "00";
// 			secondsEl.textContent = "00";
// 		} else {
// 			daysEl.textContent = days < 10 ? "0" + days : days;
// 			hoursEl.textContent = hours < 10 ? "0" + hours : hours;
// 			minutesEl.textContent = minutes < 10 ? "0" + minutes : minutes;
// 			secondsEl.textContent = seconds < 10 ? "0" + seconds : seconds;
// 		}
// 	};
// 	document.addEventListener("shopify:section:load", function () {
// 		if (!document.hidden) {
// 			setInterval(initTimer, 1000);
// 		}

// 	});
// 	if (!document.hidden) {
// 		setInterval(initTimer, 1000);
// 	}
// })();
