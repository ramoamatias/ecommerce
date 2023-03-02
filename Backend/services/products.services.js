import { ProductsMongoDAO } from "../persistencia/daos/productsMongoDAO.js";
import { ServerServices } from "./server.services.js";

export class ProductsServices {
  constructor() {
    this.product = new ProductsMongoDAO();
    this.serverServices = new ServerServices();
  }

  getAll = async () => {
    try {
      return await this.product.getAll();
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  getById = async (id) => {
    try {
      return await this.product.getById(id);
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  save = async (obj) => {
    try {
      const date = new Date();
      obj.timestamp = date.toLocaleString();
      return await this.product.createDocument(obj);
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  update = async (id, newData) => {
    try {
      console.log("DATA A ACTUALIZAR", newData);
      return await this.product.updateDocument(id, newData);
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  delete = async (id) => {
    try {
      return await this.product.deleteDocument(id);
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };
}
