import express, { json, urlencoded } from "express";
import { PORT } from "../src/js/config.js";
import productsRouter from "../routes/products.js";
import cartRouter from "../routes/cart.js";
import { connectMongoDB } from "../persistencia/dbConfigMongo.js";

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use("/api/products", productsRouter); 
app.use("/api/cart", cartRouter);
   
app.use(function (err, req, res, next) {
  console.error(err.stack);   
  res.status(500).send("Something broke!");
});

app.get("/", (req, res) => {
  res.json({ respuesta: "paginaPrincipal" });
});

app.get("/*", (req, res) => {
  let messageError = `path ${req.protocol}://${req.hostname}:${PORT}${req.originalUrl} unauthorized ${req.method} method`;
  res.status(404).json({ error: -2, description: messageError });
});

try {
  // Para usar Fireabse debo de comentar connectMongoDB()
  connectMongoDB();
  console.log("Conectado a Mongo");

  app.listen(PORT, () => {
    console.log(`Escuchando el puerto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
  });
} catch (error) {
  console.log(error);
}
