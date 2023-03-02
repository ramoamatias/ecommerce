import express, { json, urlencoded } from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cluster from "cluster";
import os from "os";

import passport from "passport";
import "../passport/localPassport.js";

import { ServerServices } from "../services/server.services.js";
import { ProductsServices } from "../services/products.services.js";
import { ProductsController } from "../controller/products.controller.js";
import { UsersController } from "../controller/users.controller.js";
import { CartRouter } from "../routes/cart.routes.js";
import { ProductsRouter } from "../routes/products.routes.js";
import { UsersRouter } from "../routes/users.routes.js";

const productsRouter = new ProductsRouter();
const cartRouter = new CartRouter();
const userRouter = new UsersRouter();

const serverServices = new ServerServices();
const productsController = new ProductsController();
const productsServices = new ProductsServices();
const userController = new UsersController();

import { connectMongoDB } from "../persistencia/dbConfigMongo.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.URLMONGO,
    }),
    cookie: { maxAge: 60000 * 10 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/products", productsRouter.init());
app.use("/api/cart", cartRouter.init());
app.use("/api/user", userRouter.init());

app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/", userController.isAuth, async (req, res) => {
  const { email, password } = req.user;
  const products = await productsServices.getAll();
  email === "admin@admin" && password === "admin"
    ? res.render("homeAdmin.ejs")
    : res.render("homeUsers.ejs", {
        user: req.user.firstName,
        avatar: req.user.avatar,
        products,
      });
});

app.get("/*", (req, res) => {
  let messageError = `path ${req.protocol}://${req.hostname}:${process.env.PORT}${req.originalUrl} unauthorized ${req.method} method`;
  res.status(404).json({ error: -2, description: messageError });
});

const PORT = process.env.PORT;
const numCPUs = os.cpus().length;
if (process.env.MODO === "cluster") {
  if (cluster.isPrimary) {
    serverServices.logger.info(`Proceso maestro - ${process.pid}`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", () => {
      cluster.fork();
    });
  } else {
    try {
      connectMongoDB();
      serverServices.logger.info("Conectado a Mongo");

      app.listen(PORT, () => {
        serverServices.logger.info(
          `Escuchando el puerto ${PORT} - proceso ${process.pid}`
        );
      });
    } catch (error) {
      serverServices.logger.error(error);
    }
  }
} else {
  try {
    connectMongoDB();
    serverServices.logger.info("Conectado a Mongo");
    app.listen(PORT, () => {
      serverServices.logger.info(`Escuchando el puerto ${PORT}`);
      serverServices.logger.info(`http://localhost:${PORT}`);
    });
  } catch (error) {
    serverServices.logger.error(error);
  }
}
