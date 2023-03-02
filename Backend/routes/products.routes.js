import { Router } from "express";
import { ProductsController } from "../controller/products.controller.js";
import { ServerController } from "../controller/server.controller.js";

const productsRouter = Router();

export class ProductsRouter {
  constructor() {
    this.productsController = new ProductsController();
    this.serverController = new ServerController();
  }
  
  init() {
    productsRouter.get("/update",this.productsController.getViewUpdate);
    productsRouter.get("/registerProduct",this.productsController.getViewAdd);
    productsRouter.get("/delete",this.productsController.getViewDelete);
    
    productsRouter.get("/", this.productsController.getAll);

    productsRouter.get("/:id", this.productsController.getById);


    productsRouter.post(
      "/",
      this.serverController.isAdmin,
      this.productsController.save
    );


    productsRouter.put(
      "/:id",
      this.serverController.isAdmin,
      this.productsController.update
    );


    productsRouter.delete(
      "/:id",
      this.serverController.isAdmin,
      this.productsController.delete
    );

    return productsRouter;
  }
}
