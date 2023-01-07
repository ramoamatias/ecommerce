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

import productsRouter from "../routes/products.js";
import cartRouter from "../routes/cart.js";
import { router as userRouter, isAuth } from "../routes/users.js";
import { connectMongoDB } from "../persistencia/dbConfigMongo.js";
import { ProductsMongoDAO } from "../persistencia/daos/productsMongoDAO.js";
import { logger } from "./js/logger.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelProduct = new ProductsMongoDAO();

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

app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/user", userRouter);

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/", isAuth, async (req, res) => {
  const products = await modelProduct.getAll();
  res.render("homeUsers.ejs", { user: req.user.firstName, products });
});

app.get("/*", (req, res) => {
  let messageError = `path ${req.protocol}://${req.hostname}:${process.env.PORT}${req.originalUrl} unauthorized ${req.method} method`;
  res.status(404).json({ error: -2, description: messageError });
});

// try {
//   connectMongoDB();
//   logger.info("Conectado a Mongo");
//   const PORT = process.env.PORT;
//   app.listen(PORT, () => {
//     logger.info(`Escuchando el puerto ${PORT}`);
//   });
// } catch (error) {
//   logger.error(error);
// }

const PORT = process.env.PORT;
const numCPUs = os.cpus().length;
if (process.env.MODO === "cluster") {
  if (cluster.isPrimary) {
    logger.info(`Proceso maestro - ${process.pid}`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", () => {
      cluster.fork();
    });
  } else {
    try {
      connectMongoDB();
      logger.info("Conectado a Mongo");
      
      app.listen(PORT, () => {
        logger.info(`Escuchando el puerto ${PORT} - proceso ${process.pid}`);
      });
    } catch (error) {
      logger.error(error);
    }
  }
} else {
  try {
    connectMongoDB();
    logger.info("Conectado a Mongo");
    app.listen(PORT, () => {
      logger.info(`Escuchando el puerto ${PORT}`);
      logger.info(`http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
