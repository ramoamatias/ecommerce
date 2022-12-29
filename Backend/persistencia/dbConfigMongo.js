import {connect} from "mongoose";

export function connectMongoDB() {
  const URL = "mongodb+srv://matiasramoa:coderhouse@coderhouse.ocw4cfm.mongodb.net/ecommerceProductivo";
  connect(URL);
}   
