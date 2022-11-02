import { MongoClass } from "../containers/MongoClass.js";
import { modelProducts } from "../models/productsMongo.js";

export class ProductsMongoDAO extends MongoClass {
    constructor() {
        super(modelProducts);
    }    
}

