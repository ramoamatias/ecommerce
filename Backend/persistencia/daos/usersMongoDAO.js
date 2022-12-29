import { MongoClass } from "../containers/MongoClass.js";
import { modelUsers } from "../models/usersMongo.js";

export class UsersMongoDAO extends MongoClass {
    constructor() {
        super(modelUsers);
    }    
    
}

