import { FirebaseClass } from "../containers/FirebaseClass.js";
import { modelCarts } from "../models/cartsFirebase.js";

export class CartsFirebaseDAO extends FirebaseClass {
    constructor() {
        super(modelCarts);
    }    
    
    async getProducts(idCart){
        const cart = await this.getById(idCart);
        return cart.products;
    }

    async saveProduct(idCart,product){
        try {
            const cart = await this.getById(idCart);
            console.log(cart);
            if (cart) {
                let findProduct = cart.products.find(el => el._id = product._id );
                if (!findProduct){
                 cart.products.push(product);
                 await this.updateDocument(idCart,{products:cart.products});
                }
                return product;
            } else {
                return undefined;
            }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProduct(idCart,idProduct){
        try {
            const cart = await this.getById(idCart);
            if (cart) {
              let listProducts = cart.products,
                indexProdDelete = listProducts.findIndex((el) => el._id == idProduct);
                if (indexProdDelete >= 0) {
                  const productDeleted = listProducts[indexProdDelete];
                  console.log("ProductoEliminado",productDeleted);
                  listProducts.splice(indexProdDelete, 1);
                  await this.updateDocument(idCart,{products:cart.products});
                  return productDeleted;
                }
            }
            return undefined;
        } catch (error) {
            console.log(error);            
        }
    }
}