import {connect} from "mongoose";

export function connectMongoDB() {
  const URL = "mongodb+srv://matiasramoa:coderhouse@coderhouse.q54hbgf.mongodb.net/ecommerce?retryWrites=true&w=majority";
  connect(URL);
}   
