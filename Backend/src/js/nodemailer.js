import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: process.env.USERNODEMAILER,
      pass: process.env.PASSNODEMAILER,
    },
  });