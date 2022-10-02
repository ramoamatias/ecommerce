const { Router, json } = require("express");
const Contenedor = require("../src/js/Contenedor.js");
const { PORT } = require("../src/js/config.js");
const router = Router();
const fileCart = new Contenedor("../files/carts.txt");

router.get("/", (req, res) => {
  fileCart.getAll().then((resp) => res.json(resp));
});

router.post("/", (req, res) => {
  const date = new Date();
  let dateCreation = date.toLocaleDateString(),
    timeCreation = date.toLocaleTimeString();
  fileCart.save({ dateCreation, timeCreation, products: [] }).then((id) => {
    res.json({ id });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  fileCart.deleteById(id).then((resp) => {
    if (resp) {
      res.json({ text: "Cart Delete" });
    } else {
      res.status(404).json({ error: "Cart Does Not Exist" });
    }
  });
});

router.get("/:id/products", async (req, res) => {
  try {
    const { id } = req.params;
    let cart = await fileCart.getById(id);
    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: "Cart Does Not Exist" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/:id/products", async (req, res) => {
  try {
    const { id } = req.params;

    let { body } = req;
    let cartAll = await fileCart.getAll();
    let cart = cartAll.find((el) => el.id == id);
    if (cart) {
      let indexCart = cartAll.findIndex((el) => el.id == id);
      cart.products.push(body);
      cartAll.splice(indexCart, 1, cart);
      await fileCart.overwriteFile(cartAll);
      res.json(cartAll);
    } else {
      res.status(404).json({ error: "Cart Does Not Exist" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id/products/:idProd", async (req, res) => {
  const { id, idProd } = req.params;
  try {
    let cartAll = await fileCart.getAll();
    let cart = cartAll.find((el) => el.id == id);
    if (cart) {
      let listProducts = cart.products,
        indexProdDelete = listProducts.findIndex((el) => el.id == idProd);
        
      listProducts.splice(indexProdDelete, 1);
      await fileCart.overwriteFile(cartAll);
      res.json(cartAll);
    } else {
      res.status(404).json({ error: "Cart Does Not Exist" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", (req, res) => {
  let { id } = req.params;
  fileCart.getById(id).then((resp) => {
    if (resp) {
      res.json(resp);
    } else {
      res.status(404).json({ error: "Cart Does Not Exist" });
    }
  });
});

module.exports = router;
