import express, { json, urlencoded } from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";

import passport from "passport";
import "../passport/localPassport.js";

import { PORT } from "../src/js/config.js"; //CAMBIAR POR DOTENV
import productsRouter from "../routes/products.js";
import cartRouter from "../routes/cart.js";
import { router as userRouter, isAuth } from "../routes/users.js";
import { connectMongoDB } from "../persistencia/dbConfigMongo.js";
import { ProductsMongoDAO } from "../persistencia/daos/productsMongoDAO.js";

const modelProduct = new ProductsMongoDAO(); 
const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET || "ClaveSecreta123",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://matiasramoa:coderhouse@coderhouse.ocw4cfm.mongodb.net/ecommerceProductivo",
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

app.get("/",isAuth, async (req, res) => {
  // res.json({ respuesta: "paginaPrincipal" });
  const products = await modelProduct.getAll();
  res.render("homeUsers.ejs",{products});
});

app.get("/*", (req, res) => {
  let messageError = `path ${req.protocol}://${req.hostname}:${PORT}${req.originalUrl} unauthorized ${req.method} method`;
  res.status(404).json({ error: -2, description: messageError });
});

try {
  connectMongoDB();
  console.log("Conectado a Mongo");
  app.listen(PORT, () => {
    console.log(`Escuchando el puerto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
  });
} catch (error) {
  console.log(error);
}
