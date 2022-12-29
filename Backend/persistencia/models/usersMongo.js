import mongoose from "mongoose";

const nameCollection = "users";

const usersSchema = mongoose.Schema({
  email: { type: String, required: true }, //mail from user
  password: { type: String, required: true }, //password from user
  firstName: { type: String, required: true }, //firstName from user
  lastName: { type: String, required: true }, //lastName from user
  adress: { type: String, required: true }, //adress from user
  age: { type: Number, required: true }, //age from user
  phone: { type: String, required: true }, //phone from user
  avatar: { type: String, required: true }, //avatar from user
});

export const modelUsers = mongoose.model(nameCollection, usersSchema);

