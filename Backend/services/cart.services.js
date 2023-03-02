import { CartsMongoDAO } from "../persistencia/daos/cartsMongoDAO.js";
import { ServerServices } from "./server.services.js";

export class CartServices {
  constructor() {
    this.serverServices = new ServerServices();
    this.cart = new CartsMongoDAO();
  }

  getAll = async () => {
    try {
      return await this.cart.getAll();
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  getById = async (id) => {
    try {
      return await this.cart.getById(id);
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  getProducts = async (id) => {
    try {
      return await this.cart.getProducts(id);
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  create = async () => {
    try {
      const date = new Date();
      let newCart = {
        timestamp: date.toLocaleString(),
        products: [],
      };
      return await this.cart.createDocument(newCart);
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  delete = async (id) => {
    try {
      return await this.cart.deleteDocument(id);
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  saveProduct = async (id, prod) => {
    try {
      return await this.cart.saveProduct(id, prod);
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  deleteProduct = async (id, idProd) => {
    try {
      return await this.cart.deleteProduct(id, idProd);
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };
}
