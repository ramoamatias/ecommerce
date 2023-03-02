import { CartServices } from "../services/cart.services.js";
import { ServerServices } from "../services/server.services.js";

export class CartController {
  constructor() {
    this.cartServices = new CartServices();
    this.serverServices = new ServerServices();
  }

  getAll = async (req, res) => {
    try {
      const allCarts = await this.cartServices.getAll();
      res.json({ carts: allCarts });
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  listViewProduct = async (req, res) => {
    const { id } = req.params;
    const { avatar } = req.user;
    const products = await this.cartServices.getProducts(id);
    res.render("cart.ejs", { products, avatar});
  };

  save = async (req, res) => {
    try {
      const cartSave = await this.cartServices.create();
      res.json({ id: cartSave._id || cartSave });
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  delete = async (req, res) => {
    const { id } = req.params;
    try {
      const cartDeleted = await this.cartServices.delete(id);
      if (cartDeleted) {
        res.json({ text: "Cart Delete" });
      } else {
        res.status(404).json({ error: "Cart Does Not Exist" });
      }
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  getProducts = async (req, res) => {
    try {
      const { id } = req.params;
      const products = await this.cartServices.getProducts(id);
      if (products) {
        res.json({ products });
      } else {
        res.status(404).json({ error: "Cart Does Not Exist" });
      }
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  addProduct = async (req, res) => {
    try {
      const { id } = req.params;
      let { body } = req;
      const productInserted = await this.cartServices.saveProduct(id, body);
      if (productInserted) {
        res.json({ text: "Product Inserted", product: productInserted });
      } else {
        res.status(404).json({ error: "Cart Does Not Exist" });
      }
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  deleteProductById = async (req, res) => {
    const { id, idProd } = req.params;
    try {
      const productDelete = await this.cartServices.deleteProduct(id, idProd);
      if (productDelete) {
        res.json({ product: productDelete });
      } else {
        res.status(404).json({ error: "Cart Does Not Exist" });
      }
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };
}
