import { MongoClass } from "../containers/MongoClass.js";
import { modelCarts } from "../models/cartsMongo.js";

export class CartsMongoDAO extends MongoClass {
  constructor() {
    super(modelCarts);
  }

  async getProducts(idCart) {
    const cart = await this.getById(idCart);
    return cart.products;
  }

  async saveProduct(idCart, product) {
    try {
      const cart = await this.getById(idCart);
      if (cart) {
        let findProduct = cart.products.find((el) => el.code == product.code);
        if (!findProduct) {
          cart.products.push(product);
        } else {
          let positionProduct = cart.products.findIndex(
            (el) => el.code == product.code
          );
          cart.products[positionProduct].quantity++;
        }
        await this.updateDocument(idCart, { products: cart.products });
        return product;
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(idCart, idProduct) {
    try {
      const cart = await this.getById(idCart);
      if (cart) {
        let listProducts = cart.products,
          indexProdDelete = listProducts.findIndex(
            (el) => el.code == idProduct
          );
        if (indexProdDelete >= 0) {
          const productDeleted = listProducts[indexProdDelete];
          listProducts.splice(indexProdDelete, 1);
          await this.updateDocument(idCart, { products: cart.products });
          return productDeleted;
        }
      }
      return undefined;
    } catch (error) {
      console.log(error);
    }
  }
}
