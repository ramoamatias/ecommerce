import { KnexClass } from "../containers/KnexClass.js";
import { configSQLite } from "../dbConfigKnex.js";

export class CartsKnexDAO extends KnexClass {
  constructor() {
    super(configSQLite, "carts");
  }

  async getProducts(id) {
    try {
      return await this.db
        .from("productsCarts")
        .where("_idCart", id)
        .join("products", "productsCarts._idProduct", "=", "products._id")
        .select(["_id","timestamp","name","description","code","urlPhoto","price","stock"]);
    } catch (error) {
      console.log(error);
    }
  }

  async saveProduct(id, obj) {
    try {
      let { _id: _idProduct, price } = obj;
      let quantity = 0;
      return await this.db
        .from("productsCarts")
        .insert({ _idCart: id, _idProduct, invoicedPrice: price, quantity });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id,idProd) {
    try {
        let result = await this.db
        .from("productsCarts")
        .where({"_idCart": id, "_idProduct":idProd})
        .del();
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
