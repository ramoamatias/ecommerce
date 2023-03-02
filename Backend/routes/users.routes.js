import { Router } from "express";
import passport from "passport";
import { UsersController } from "../controller/users.controller.js";

let userRouter = Router();

export class UsersRouter {
  constructor() {
    this.usersController = new UsersController();
  }

  init() {
    userRouter.get("/login", this.usersController.getViewLogin);

    userRouter.post(
      "/login",
      passport.authenticate("login", {
        failureRedirect: "/api/user/errorLogin",
        successRedirect: "/",
      })
    );

    userRouter.get("/register", this.usersController.getViewRegister);

    userRouter.post(
      "/register",
      passport.authenticate("register", {
        failureRedirect: "/api/user/errorRegister",
        successRedirect: "/api/user/sendMail",
      })
    );

    userRouter.get("/sendMail", this.usersController.sendMail);

    userRouter.get("/errorRegister", this.usersController.getViewErrorRegister);

    userRouter.get("/errorLogin", this.usersController.getViewErrorLogin);

    userRouter.get(
      "/logout",
      this.usersController.isAuth,
      this.usersController.getViewLogout
    );

    userRouter.get(
      "/getCart",
      this.usersController.isAuth,
      this.usersController.getCart
    );

    userRouter.get(
      "/finalizePurchase",
      this.usersController.isAuth,
      this.usersController.finalizePurchase
    );

    userRouter.get(
      "/allCartsHist",
      this.usersController.isAuth,
      this.usersController.getViewHistCarts
    );

    userRouter.get(
      "/information",
      this.usersController.isAuth,
      this.usersController.getViewInformation
    );

    return userRouter;
  }
}
