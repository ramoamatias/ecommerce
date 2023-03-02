import { Router } from "express";

import { CartController } from "../controller/cart.controller.js";

const cartRouter = Router();

export class CartRouter {
  constructor() {
    this.cartController = new CartController();
  }

  init() {
    cartRouter.get("/", this.cartController.getAll);

    cartRouter.post("/", this.cartController.save);

    cartRouter.delete("/:id", this.cartController.delete);

    cartRouter.get("/:id", this.cartController.listViewProduct);

    cartRouter.get("/:id/products", this.cartController.getProducts);

    cartRouter.post("/:id/products", this.cartController.addProduct);

    cartRouter.delete(
      "/:id/products/:idProd",
      this.cartController.deleteProductById
    );

    return cartRouter;
  }
}
