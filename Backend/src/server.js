const express = require("express");
const {PORT} = require("../src/js/config.js")
const app = express();

const productsRouter = require("../routes/products.js");
const cartRouter = require("../routes/cart.js");


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/products",productsRouter);
app.use("/api/cart",cartRouter);

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

  app.get("/",(req,res)=>{
    
    res.json({respuesta:"paginaPrincipal"});

})

app.get("/*",(req,res)=>{
    let messageError = `path ${req.protocol}://${req.hostname}:${PORT}${req.originalUrl} unauthorized ${req.method} method`;
    res.status(404).json({error:-2,description:messageError});
})

app.listen(PORT,()=>{
    console.log(`Escuchando el puerto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
})