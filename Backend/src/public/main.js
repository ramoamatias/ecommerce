document.addEventListener("click", (e) => {
  let url = "http://localhost:8080/api/user/getCart";

  if (e.target.id ==="addCart") {
    let $dataProduct = e.target.parentNode.parentNode;
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

  if (e.target.id === "addNewProduct") {
    // Obtenemos el carrito del usuario.
    e.preventDefault();
    let $formAddNewProduct = document.getElementById("formAddNewProduct"),
      $name = $formAddNewProduct.querySelector("#name"),
      $description = $formAddNewProduct.querySelector("#description"),
      $code = $formAddNewProduct.querySelector("#code"),
      $photo = $formAddNewProduct.querySelector("#photo"),
      $price = $formAddNewProduct.querySelector("#price"),
      $stock = $formAddNewProduct.querySelector("#stock"),
      $isAdmin = $formAddNewProduct.querySelector("#isAdmin"),
      $responseContainer = document.querySelector(".responseContainer");

    let data = {
      name: $name.value,
      description: $description.value,
      code: $code.value,
      photo: $photo.value,
      price: $price.value,
      stock: $stock.value,
      stock: $stock.value,
      isAdmin: $isAdmin.value,
    };

    fetch(`http://localhost:8080/api/products`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((resp) => {
        $name.value = "";
        $description.value = "";
        $code.value = "";
        $photo.value = "";
        $price.value = "";
        $stock.value = "";
        $stock.value = "";
        $isAdmin.value = "";
        $responseContainer.innerHTML = `
        <p>Producto Agregado con exito</p>
        <p>Product Id:<b>${resp.id}</b></p>`;
      })
      .catch((er) => console.log("error", er));
  }

  if (e.target.id === "searchProductDelete") {
    e.preventDefault();

    let $idProduct = document.getElementById("idProductDelete"),
      $containerProductDeleted = document.getElementById(
        "containerProductDeleted"
      ),
      $name = $containerProductDeleted.querySelector(".nameProduct"),
      $description = $containerProductDeleted.querySelector(
        ".descriptionProduct"
      ),
      $code = $containerProductDeleted.querySelector(".codeProduct"),
      $id = $containerProductDeleted.querySelector(".idProduct"),
      $price = $containerProductDeleted.querySelector(".priceProduct");
    $img = $containerProductDeleted.querySelector(".imgProduct");
    $messageError = document.querySelector(".messageError");
    $messageDeleted = document.querySelector(".messageDeleteProduct");

    if ($idProduct.value !== "") {
      fetch(`http://localhost:8080/api/products/${$idProduct.value}`)
        .then((res) => res.json())
        .then((resp) => {
          if (resp.error) {
            $containerProductDeleted.setAttribute("hidden", "true");
            $messageDeleted.setAttribute("hidden", "true");
            $messageError.removeAttribute("hidden");
            $messageError.innerHTML = resp.error;
            $messageError.classList.add("alert", "alert-danger", "text-center");
          } else {
            $messageDeleted.setAttribute("hidden", "true");
            $messageError.setAttribute("hidden", "true");
            $containerProductDeleted.removeAttribute("hidden");
            $name.innerHTML = resp.name;
            $description.innerHTML = resp.description;
            $code.innerHTML = resp.code;
            $id.innerHTML = resp._id;
            $price.innerHTML = resp.price;
            $img.src = resp.photo;
          }
        });
    }
  }

  if (e.target.matches(".btnDeleteAcept")) {
    let $idProduct = document.getElementById("idProductDelete"),
      $containerProductDeleted = document.getElementById(
        "containerProductDeleted"
      );
    $messageDelete = document.querySelector(".messageDeleteProduct");

    fetch(`http://localhost:8080/api/products/${$idProduct.value}`, {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({ isAdmin: "true" }),
    })
      .then((res) => res.json())
      .then((resp) => {
        $containerProductDeleted.setAttribute("hidden", "true");
        $messageDelete.removeAttribute("hidden");
        $messageDelete.classList.add("alert", "alert-success", "text-center");
        $messageDelete.innerHTML = `Product Removed Successfully`;
      })
      .catch((er) => console.log("error", er));
  }

  if (e.target.matches(".btnCancelDelete")) {
    let $containerProductDeleted = document.getElementById(
      "containerProductDeleted"
    );

    $containerProductDeleted.setAttribute("hidden", "true");
  }

  if (e.target.id === "searchProductUpdate") {
    e.preventDefault();

    let $idProduct = document.getElementById("idProductUpdate"),
      $containerProductUpdated = document.getElementById(
        "containerProductUpdated"
      ),
      $name = $containerProductUpdated.querySelector("#name"),
      $description = $containerProductUpdated.querySelector("#description"),
      $code = $containerProductUpdated.querySelector("#code"),
      $price = $containerProductUpdated.querySelector("#price"),
      $stock = $containerProductUpdated.querySelector("#stock"),
      $isAdmin = $containerProductUpdated.querySelector("#isAdmin"),
      $img = $containerProductUpdated.querySelector("#photo");

    $messageError = document.querySelector(".messageError");
    $messageUpdated = document.querySelector(".messageUpdateProduct");

    if ($idProduct.value !== "") {
      fetch(`http://localhost:8080/api/products/${$idProduct.value}`)
        .then((res) => res.json())
        .then((resp) => {
          if (resp.error) {
            $containerProductUpdated.setAttribute("hidden", "true");
            $messageUpdated.setAttribute("hidden", "true");
            $messageError.removeAttribute("hidden");
            $messageError.innerHTML = resp.error;
            $messageError.classList.add("alert", "alert-danger", "text-center");
          } else {
            $messageUpdated.setAttribute("hidden", "true");
            $messageError.setAttribute("hidden", "true");
            $containerProductUpdated.removeAttribute("hidden");
            $name.value = resp.name;
            $description.value = resp.description;
            $code.value = resp.code;
            $price.value = resp.price;
            $img.value = resp.photo;
            $stock.value = resp.stock;
          }
        });
    }
  }

  if (e.target.matches(".btnUpdateAcept")) {
    e.preventDefault();
    let $idProduct = document.getElementById("idProductUpdate"),
      $containerProductUpdated = document.getElementById(
        "containerProductUpdated"
      ),
      $name = $containerProductUpdated.querySelector("#name"),
      $description = $containerProductUpdated.querySelector("#description"),
      $code = $containerProductUpdated.querySelector("#code"),
      $price = $containerProductUpdated.querySelector("#price"),
      $stock = $containerProductUpdated.querySelector("#stock"),
      $isAdmin = $containerProductUpdated.querySelector("[name = isAdmin]"),
      $photo = $containerProductUpdated.querySelector("#photo");
    $messageUpdate = document.querySelector(".messageUpdateProduct");

    const data = {
      name: $name.value,
      description: $description.value,
      code: $code.value,
      photo: $photo.value,
      price: $price.value,
      stock: $stock.value,
      isAdmin: $isAdmin.value,
    };

    fetch(`http://localhost:8080/api/products/${$idProduct.value}`, {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((resp) => {
        $containerProductUpdated.setAttribute("hidden", "true");
        $messageUpdate.removeAttribute("hidden");
        $messageUpdate.classList.add("alert", "alert-success", "text-center");
        $messageUpdate.innerHTML = `Product Updated Successfully`;
      })
      .catch((er) => console.log("error", er));
  }

  if (e.target.matches(".btnCancelUpdate")) {
    e.preventDefault();
    let $containerProductUpdated = document.getElementById(
      "containerProductUpdated"
    );

    $containerProductUpdated.setAttribute("hidden", "true");
  }
});
