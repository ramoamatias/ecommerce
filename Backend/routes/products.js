const { Router } = require("express");
const Contenedor = require("../src/js/Contenedor.js");
const {middlewareIsAdmin} = require("../src/js/middlewares.js");
const {PORT} = require("../src/js/config.js");
const router = Router();
const fileProducts = new Contenedor("../files/products.txt");

router.get("/", (req, res) => {  
  fileProducts
    .getAll()
    .then((resp) => {
      res.json(resp);
    })
    .catch((error) => console.log(error));
});

router.get("/:id", (req, res) => {
  let { id } = req.params;
  fileProducts.getById(id).then((resp) => {
    if (resp) {
      res.json(resp);
    } else {
      res.status(404).json({ error: "Product Does Not Exist" });
    }
  });
});

router.post("/", middlewareIsAdmin, (req, res) => {
  const { body } = req;
  fileProducts.save(body).then((id) => {
    res.json({ id });
  });
});

router.put("/:id",middlewareIsAdmin ,async (req, res) => {
  const { id } = req.params;
  const newData = req.body;
  const listProducts = await fileProducts.getAll();
  let product = listProducts.find((el) => el.id == id),
    indexProduct = listProducts.findIndex((el) => el.id == id);
  if (product) {
    let idProduct = product.id;
    product = { ...product, ...newData, id: idProduct };
    listProducts.splice(indexProduct, 1, product);
    fileProducts.overwriteFile(listProducts);
    res.json(product);
  } else {
    res.status(404).json({
      error: -1,
      description: `Ruta `
    });
  }
});

router.delete("/:id", middlewareIsAdmin ,(req, res) => {
  const { id } = req.params;
  fileProducts.deleteById(id).then((resp) => {
    if (resp) {
      res.json({ text: "Product Delete" });
    } else {
      res.status(404).json({ error: "Product Does Not Exist" });
    }
  });
});

module.exports = router;
