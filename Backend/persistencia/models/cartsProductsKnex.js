import knex from "knex";
import { configSQLite } from "../dbConfigKnex.js";

const db = knex(configSQLite);
(async () => {
  try {
    const isExist = await db.schema.hasTable("productsCarts");
    if (!isExist) {
      await db.schema.createTable("productsCarts", (table) => {
        table.integer("_idCart").notNullable();
        table.integer("_idProduct").notNullable();
        table.integer("invoicedPrice").notNullable();
        table.integer("quantity").notNullable();
        table.primary(["_idCart","_idProduct"]);
        table.foreign("idCart").references("Carts.id");
        table.foreign("idProducts").references("Products.id");
      });
      console.log("productsCarts table created successfully");
    }
  } catch (error) {
    console.log(error);
  }
})();
