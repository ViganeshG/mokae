(function () {
  const productTags = () => {
    const pullsBtns = document.querySelectorAll(".pulsating");

    const products = document.querySelectorAll(".collection-tags-card");
    products[0].classList.add("active");

    pullsBtns.forEach((elem) => {
      elem.addEventListener("click", function (e) {
        let clickedBtnData = e.target.getAttribute("data-index");

        products.forEach((e) => {
          const clickedDataIndex = e.getAttribute("data-index");
          e.classList.remove("active");

          if (clickedBtnData == clickedDataIndex) {
            e.classList.add("active");
          }
        });
      });
    });
  };

  document.addEventListener("shopify:section:load", function () {
    setTimeout(() => {
      productTags();
    }, 200);
  });

  setTimeout(() => {
    productTags();
  }, 200);
})();
