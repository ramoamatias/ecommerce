import mongoose from "mongoose";

const nameCollection = "cartUser";

const cartUserSchema = mongoose.Schema({
  email: { type: String, required: true }, 
  idCart : { type: String, required: true }, 
});

export const modelCartUser = mongoose.model(nameCollection, cartUserSchema);

