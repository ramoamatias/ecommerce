import { Router } from "express";
import { ProductsMongoDAO } from "../persistencia/daos/productsMongoDAO.js";
import { middlewareIsAdmin } from "../src/js/middlewares.js";
const router = Router();

const modelProduct = new ProductsMongoDAO(); 

router.get("/", async (req, res) => {
  try {
    const allProducts = await modelProduct.getAll();
    res.json({products:allProducts});
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  let { id } = req.params;
  try {
    const product = await modelProduct.getById(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product Does Not Exist" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/", middlewareIsAdmin, async (req, res) => {
  const obj = req.body;
  const date = new Date();
  obj.timestamp = date.toLocaleString();
  try {
    const productoSave = await modelProduct.createDocument(obj);
    res.json({ id: productoSave._id || productoSave });
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id", middlewareIsAdmin, async (req, res) => {
  const { id } = req.params;
  const newData = req.body;
  try {
    const productUpdated = await modelProduct.updateDocument(id, newData);
    if (productUpdated) {
      res.json({ product: productUpdated });
    } else {
      res.status(404).json({ error: "Product Does Not Exist" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", middlewareIsAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const productDeleted = await modelProduct.deleteDocument(id);
    if (productDeleted) {
      res.json({ text: "Product Delete" , product:productDeleted});
    } else {
      res.status(404).json({ error: "Product Does Not Exist" });
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
