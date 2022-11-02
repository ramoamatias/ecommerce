import { KnexClass } from "../containers/KnexClass.js";
import { configSQLite } from "../dbConfigKnex.js";

export class ProductsKnexDAO extends KnexClass {
    constructor() {
        super(configSQLite,"products");
    }    
}
