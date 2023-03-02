import nodemailer from "nodemailer";
import { clientTwilio } from "../src/js/twilio.js";
import { ServerServices } from "./server.services.js";
import { CartUserMongoDAO } from "../persistencia/daos/cartUsersMongoDAO.js";
import { CartsUserHistMongoDAO } from "../persistencia/daos/cartsUserHistMongoDAO.js";
import { CartServices } from "./cart.services.js";

export class UsersServices {
  constructor() {
    this.serverServices = new ServerServices();
    this.cartServices = new CartServices();
    this.modelCartUser = new CartUserMongoDAO();
    this.modelCartUserHist = new CartsUserHistMongoDAO();
  }

  getHistoricalCarts = async (emailUser) => {
    try {
      return await this.modelCartUserHist.getByProps({ email: emailUser });
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  getCart = async (emailUser) => {
    try {
      let cartUser = await this.modelCartUser.getByProps({ email: emailUser });

      if (cartUser.length === 0) {
        const cartSave = await this.cartServices.create(),
          idCart = cartSave._id || cartSave;
        const cartUserCreated = await this.modelCartUser.createDocument({
          email: emailUser,
          idCart,
        });
        return { idCart, cartUserCreated };
      } else {
        return { idCart: cartUser[0].idCart };
      }
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  finalizePurchase = async (newData) => {
    try {
      const { email, firstName, phone } = newData;
      let [cartUser] = await this.modelCartUser.getByProps({ email }),
        { idCart, _id: idCartUser } = cartUser,
        cart = await this.cartServices.getById(idCart);

      const date = new Date();
      let data = {
        idCart,
        email,
        timestamp: date.toLocaleString(),
        products: cart.products,
      };
      await this.modelCartUser.deleteDocument(idCartUser);
      await this.cartServices.delete(idCart);
      const order = await this.modelCartUserHist.createDocument(data);

      

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
        subject: `Nuevo pedido de ${firstName} (${email})`,
        html: this.#formatHtml(cart),
      });

      // Enviara un WSP
      await clientTwilio.messages.create({
        body:
          `*Nuevo pedido de ${firstName}* (${email}) \n\n` +
          this.#formatWsp(cart),
        from: "whatsapp:+14155238886",
        to: `whatsapp:${process.env.PHONEADMIN}`,
      });

      await clientTwilio.messages.create({
        body: "Su pedido fue recibido y esta en proceso de preparacion",
        messagingServiceSid: "MGd2c290d7e371fd842515748b72961645",
        to: `${phone}`,
      });

      return order;
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  sendMailRegister = async (data) => {
    try {
      const { avatar, firstName, lastName, adress, age, phone, email } = data;

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
    } catch (error) {
      this.serverServices.logger.error(error);
    }
  };

  #formatHtml = (cart) => {
    let htmlInfo = "",
      total = 0;

    cart.products.forEach((prod) => {
      htmlInfo += `<h2 class="nameProduct">${prod.name}</h2>`;
      htmlInfo += `<img class="imgProduct" src="${prod.urlPhoto}" alt="${prod.name}">`;
      htmlInfo += `<p class="codeProduct">${prod.code}</p>`;
      htmlInfo += `<p>Price: $<span class="priceProduct">${prod.price}</span></p>`;
      htmlInfo += `<p>Cantidad: <span class="quantityProduct">${prod.quantity}</span></p>`;
      htmlInfo += `<p>SubTotal: $<span class="subTotalProduct">${
        prod.price * prod.quantity
      }</span></p>`;

      total += prod.price * prod.quantity;
    });

    htmlInfo += `<h3>Total: $<span class="totalCart">${total}</span></h3>`;

    return htmlInfo;
  };

  #formatWsp = (cart) => {
    let wspInfo = "",
      total = 0;

    cart.products.forEach((el) => {
      wspInfo += `*Producto:* ${el.name} \n`;
      wspInfo += `*Codigo Producto:* ${el.code}\n`;
      wspInfo += `*Precio Unitario:* ${el.price}\n`;
      wspInfo += `*Cantidad:* ${el.quantity}\n`;
      wspInfo += `*Subtotal:* ${el.quantity * el.price}\n`;
      wspInfo += `
      ----------- \n\n`;

      total += el.price * el.quantity;
    });
    wspInfo += `_*Total:*_ ${total}
`;

    return wspInfo;
  };
}
