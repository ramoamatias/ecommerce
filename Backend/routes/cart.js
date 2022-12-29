import { Router } from "express";
import { CartsMongoDAO } from "../persistencia/daos/cartsMongoDAO.js";
import { modelCarts } from "../persistencia/models/cartsMongo.js";


const router = Router();

const modelCart = new CartsMongoDAO(modelCarts); 



router.get("/", async (req, res) => {
  try {
    const allCarts = await modelCart.getAll();
    res.json({ carts: allCarts });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  const date = new Date();

  let cart = {
    timestamp: date.toLocaleString(),
    products: [],
  };


  try {
    const cartSave = await modelCart.createDocument(cart);
    res.json({ id: cartSave._id || cartSave });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cartDeleted = await modelCart.deleteDocument(id);
    if (cartDeleted) {
      res.json({ text: "Cart Delete" });
    } else {
      res.status(404).json({ error: "Cart Does Not Exist" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id/products", async (req, res) => {
  try {
    const { id } = req.params;
    const products = await modelCart.getProducts(id);
    if (products) {
      res.json({ products });
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
    const productInserted = await modelCart.saveProduct(id, body);
    if (productInserted) {
      res.json({ text: "Product Inserted", product: productInserted });
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
    const productDelete = await modelCart.deleteProduct(id,idProd);
    if (productDelete) {
      res.json({product:productDelete});
    } else {
      res.status(404).json({ error: "Cart Does Not Exist" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async(req, res) => {
  let { id } = req.params;
  try {
    const cart = await modelCart.getById(id);
   if (cart) {
     res.json({cart});
   } else {
     res.status(404).json({ error: "Cart Does Not Exist" });
   }
  } catch (error) {
    console.log(error);
  }
});

export default router;
