import { ServerServices } from "../services/server.services.js";
import { ProductsServices } from "../services/products.services.js";

export class ProductsController {
  constructor() {
    this.serverServices = new ServerServices();
    this.productsServices = new ProductsServices();
  }

  getAll = async (req, res) => {
    try {
      const allProducts = await this.productsServices.getAll();
      res.json({ products: allProducts });
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  getById = async (req, res) => {
    let { id } = req.params;
    try {
      const product = await this.productsServices.getById(id);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: "Product Does Not Exist" });
      }
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  save = async (req, res) => {
    const obj = req.body;
    try {
      const productoSave = await this.productsServices.save(obj);
      res.json({ id: productoSave._id || productoSave });
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  update = async (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    try {
      const productUpdated = await this.productsServices.update(id, newData);
      if (productUpdated) {
        res.json({ product: productUpdated });
      } else {
        res.status(404).json({ error: "Product Does Not Exist" });
      }
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  delete = async (req, res) => {
    const { id } = req.params;
    try {
      const productDeleted = await this.productsServices.delete(id);
      if (productDeleted) {
        res.json({ text: "Product Delete", product: productDeleted });
      } else {
        res.status(404).json({ error: "Product Does Not Exist" });
      }
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  getViewAdd = async (req, res) => {
    res.render("addProduct.ejs");
  };

  getViewUpdate = async (req, res) => {
    res.render("updateProduct.ejs");
  };

  getViewDelete = async (req, res) => {
    res.render("deleteProduct.ejs");
  };
}
