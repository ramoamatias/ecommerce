import knex from "knex";
import { configSQLite } from "../dbConfigKnex.js";

const db = knex(configSQLite);
(async () => {
  try {
    const isExist = await db.schema.hasTable("products");
    if (!isExist) {
      await db.schema.createTable("products", (table) => {
        table.increments("_id").primary();
        table.string("timestamp").notNullable();
        table.string("name").notNullable();
        table.string("description").notNullable();
        table.string("code").notNullable();
        table.string("urlPhoto").notNullable();
        table.integer("price").notNullable().checkPositive();
        table.integer("stock").notNullable().checkPositive();
      });
      console.log("Products table created successfully");
    }
  } catch (error) {
    console.log(error);
  }
})();
