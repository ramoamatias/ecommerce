import { MongoClass } from "../containers/MongoClass.js";
import { modelCartUser } from "../models/cartUserMongo.js";


export class CartUserMongoDAO extends MongoClass {
    constructor() {
        super(modelCartUser);
    }    
    
}

