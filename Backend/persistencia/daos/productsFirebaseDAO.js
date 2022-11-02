import { FirebaseClass } from "../containers/FirebaseClass.js";
import { modelProducts } from "../models/productsFirebase.js";

export class ProductsFirebaseDAO extends FirebaseClass {
    constructor() {
        super(modelProducts);
    }    
}

