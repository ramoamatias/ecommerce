import {connect} from "mongoose";

export function connectMongoDB() {
  const URL = process.env.URLMONGO;
  connect(URL);
}   
