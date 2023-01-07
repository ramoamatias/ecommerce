document.addEventListener("click", (e) => {
  let url = "http://localhost:8080/api/user/getCart";

  if (e.target.matches(".addCart")) {
    let $dataProduct = e.target.parentNode;
    let nameProduct = $dataProduct.querySelector(".nameProduct").innerText,
      codeProduct = $dataProduct.querySelector(".codeProduct").innerText,
      priceProduct = $dataProduct.querySelector(".priceProduct").innerText,
      imgProduct = $dataProduct.querySelector(".imgProduct").src;

    fetch(url)
      .then((res) => res.json())
      .then((resp) => {
        let { idCart } = resp;

        let data = {
          name: nameProduct,
          code: codeProduct,
          price: priceProduct,
          urlPhoto: imgProduct,
          quantity: 1,
        };

        let urlCart = `http://localhost:8080/api/cart/${idCart}/products`;
        fetch(urlCart, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
          .then((res) => res.json())
          .then((resp) => {})
          .catch((er) => console.log("error", er));
      })
      .catch();
  }

  if (e.target.matches(".deletedCart")) {
    let $dataProduct = e.target.parentNode;
    let codeProduct = $dataProduct.querySelector(".codeProduct").innerText;


      fetch(url)
      .then((res) => res.json())
      .then((resp) => {
        let { idCart } = resp;

        let urlCart = `http://localhost:8080/api/cart/${idCart}/products/${codeProduct}`;
        fetch(urlCart, {
          method: "DELETE", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        })
          .then((res) => res.json())
          .then((resp) => location.reload())
          .catch((er) => console.log("error", er));
      })
      .catch();




















  }

  if (e.target.id === "bottonCart") {
    // Obtenemos el carrito del usuario.
    fetch(url)
      .then((res) => res.json())
      .then((resp) => {
        let { idCart } = resp;
        location.href = `http://localhost:8080/api/cart/${idCart}`;
      })
      .catch();
  }
});
