import { CartServices } from "../services/cart.services.js";
import { ServerServices } from "../services/server.services.js";
import { UsersServices } from "../services/users.services.js";

export class UsersController {
  constructor() {
    this.userServices = new UsersServices();
    this.serverServices = new ServerServices();
    this.cartServices = new CartServices();
  }

  isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.render("home.ejs");
    }
  };

  getViewLogin = (req, res) => {
    res.render("login.ejs");
  };

  getViewRegister = (req, res) => {
    res.render("register.ejs");
  };

  getViewErrorRegister = (req, res) => {
    res.render("pageError.ejs", { message: "error, existing user" });
  };

  getViewErrorLogin = (req, res) => {
    res.render("pageError.ejs", { message: "error, invalid credentials" });
  };

  getViewLogout = (req, res) => {
    const userLogout = req.user.firstName;
    req.logOut(() => {
      res.render("logout.ejs", { user: userLogout });
    });
  };

  getViewHistCarts = async (req, res) => {
    try {
      const { email, avatar } = req.user;
      const carts = await this.userServices.getHistoricalCarts(email);
      res.render("cartHist.ejs", { carts, avatar });
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  getViewInformation = (req, res) => {
    const { firstName, lastName, avatar, email, adress, age, phone } = req.user;
    res.render("informationUser.ejs", {
      firstName,
      lastName,
      avatar,
      email,
      adress,
      age,
      phone,
    });
  };

  getCart = async (req, res) => {
    try {
      const { email } = req.user;
      const response = await this.userServices.getCart(email);
      res.json(response);
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  finalizePurchase = async (req, res) => {
    try {
      const {avatar} = req.user;
      const response = await this.userServices.finalizePurchase(req.user);
      const total = response.products.reduce(
        (acumulador, producto) =>
          acumulador + producto.price * producto.quantity,
        0
      );

      res.render("finalizePurchase.ejs", { cart: response, total , avatar});
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  sendMail = async (req, res) => {
    await this.userServices.sendMailRegister(req.user);
    res.redirect("/");
  };
}
