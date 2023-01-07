import { MongoClass } from "../containers/MongoClass.js";
import { modelCartsUserHist } from "../models/cartsUserHistMongo.js";


export class CartsUserHistMongoDAO extends MongoClass {
    constructor() {
        super(modelCartsUserHist);
    }    
    
}

