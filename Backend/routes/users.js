import { Router } from "express";
import passport from "passport";
import nodemailer from "nodemailer";
import { CartUserMongoDAO } from "../persistencia/daos/cartUsersMongoDAO.js";
import { CartsMongoDAO } from "../persistencia/daos/cartsMongoDAO.js";
import { CartsUserHistMongoDAO } from "../persistencia/daos/cartsUserHistMongoDAO.js";
import { clientTwilio } from "../src/js/twilio.js";
import { logger } from "../src/js/logger.js";
let router = Router();
const modelCartUser = new CartUserMongoDAO();
const modelCart = new CartsMongoDAO();
const modelCartUserHist = new CartsUserHistMongoDAO();

function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.render("home.ejs");
  }
}
router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/user/errorLogin",
    successRedirect: "/",
  })
);

router.get("/register", (req, res) => {
  res.render("register.ejs");
});

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/user/errorRegister",
    successRedirect: "/api/user/sendMail",
  })
);

router.get("/sendMail", async (req, res) => {
  const { avatar, firstName, lastName, adress, age, phone, email } = req.user;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: "matiasramoa2@gmail.com",
      pass: "wlidspstigvypoyo",
    },
  });

  // Enviar un correo
  await transporter.sendMail({
    from: "matiasramoa2@gmail.com",
    to: process.env.EMAIL,
    subject: "New record",
    html: `
    <h2>Datos de Nuevo Usuario</h2>
    <img src=${avatar} alt="imagen" style="width:50px; heigth:50px; border-radius:10px">
    <p><b>Full Name: </b> ${firstName} ${lastName}</p>
    <p><b>Age: </b>  ${age}</p>
    <p><b>Phone: </b> ${phone}</p>
    <p><b>Email: </b> ${email}</p>
    <p><b>Adress: </b> ${adress}</p>`,
  });
  res.redirect("/");
});

router.get("/errorRegister", (req, res) => {
  res.render("pageError.ejs", { message: "error, existing user" });
});

router.get("/errorLogin", (req, res) => {
  res.render("pageError.ejs", { message: "error, invalid credentials" });
});

router.get("/logout", isAuth, (req, res) => {
  const userLogout = req.user.firstName;
  req.logOut(() => {
    res.render("logout.ejs", { user: userLogout });
  });
});

router.get("/getCart", isAuth, async (req, res) => {
  const { email } = req.user;
  let cartUser = await modelCartUser.getByProps({ email });
  if (cartUser.length === 0) {
    const date = new Date();
    let cart = {
      timestamp: date.toLocaleString(),
      products: [],
    };
    try {
      const cartSave = await modelCart.createDocument(cart),
        idCart = cartSave._id || cartSave;
      const cartUserCreated = await modelCartUser.createDocument({
        email,
        idCart,
      });
      res.json({ idCart, cartUserCreated });
    } catch (err) {
      logger.error(err);
    }
  } else {
    res.json({ idCart: cartUser[0].idCart });
  }
});

router.get("/finalizePurchase", isAuth, async (req, res) => {
  try {
    const { email, firstName, phone } = req.user;
    let cartUser = await modelCartUser.getByProps({ email }),
      idCart = cartUser[0].idCart,
      idCartUser = cartUser[0]._id,
      cart = await modelCart.getById(idCart);
    const date = new Date();
    let data = {
      idCart,
      email,
      timestamp: date.toLocaleString(),
      products: cart.products,
    };
    await modelCartUser.deleteDocument(idCartUser);
    await modelCart.deleteDocument(idCart);
    await modelCartUserHist.createDocument(data);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: "matiasramoa2@gmail.com",
        pass: "wlidspstigvypoyo",
      },
    });
    let htmlInfo = "",
      wspInfo = "",
      total = 0;

    cart.products.forEach((el) => {
      htmlInfo += `<h2 class="nameProduct">${el.name}</h2>`;
      htmlInfo += `<img class="imgProduct" src="${el.urlPhoto}" alt="${el.name}">`;
      htmlInfo += `<p class="codeProduct">${el.code}</p>`;
      htmlInfo += `<p>Price: $<span class="priceProduct">${el.price}</span></p>`;
      htmlInfo += `<p>Cantidad: <span class="quantityProduct">${el.quantity}</span></p>`;
      htmlInfo += `<p>SubTotal: $<span class="subTotalProduct">${
        el.price * el.quantity
      }</span></p>`;

      total += el.price * el.quantity;

      wspInfo += `*Producto:* ${el.name} \n`;
      wspInfo += `*Codigo Producto:* ${el.code}\n`;
      wspInfo += `*Precio Unitario:* ${el.price}\n`;
      wspInfo += `*Cantidad:* ${el.quantity}\n`;
      wspInfo += `*Subtotal:* ${el.quantity * el.price}\n`;
      wspInfo += `
      ----------- \n\n`;
    });
    htmlInfo += `<h3>Total: $<span class="totalCart">${total}</span></h3>`;
    wspInfo += `_*Total:*_ ${total}
    `;

    // Enviar un correo
    await transporter.sendMail({
      from: "matiasramoa2@gmail.com",
      to: process.env.EMAIL,
      subject: `Nuevo pedido de ${firstName} (${email})`,
      html: htmlInfo,
    });

    // Enviara un WSP
    await clientTwilio.messages.create({
      body: `*Nuevo pedido de ${firstName}* (${email}) \n\n` + wspInfo,
      from: "whatsapp:+14155238886",
      to: `whatsapp:${process.env.PHONEADMIN}`,
    });

    await clientTwilio.messages.create({
      body: "Su pedido fue recibido y esta en proceso de preparacion",
      messagingServiceSid: "MGd2c290d7e371fd842515748b72961645",
      to: `${phone}`,
    });

    res.redirect("/");
  } catch (error) {
   logger.error(error);
  }
});

router.get("/allCartsHist", isAuth, async (req, res) => {
  const { email } = req.user;
  const carts = await modelCartUserHist.getByProps({ email });
  res.render("cartHist.ejs", { carts });
});

router.get("/information", isAuth, (req, res) => {
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
});

router.get("/enviarMensaje", async (req, res) => {
  const { phone } = req.user;

  res.send("MENSJAE ENVIADO");
});
export { router, isAuth };
