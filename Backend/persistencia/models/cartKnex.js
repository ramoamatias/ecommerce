import knex from "knex";
import { configSQLite } from "../dbConfigKnex.js";

const db = knex(configSQLite);
(async () => {
  try {
    const isExist = await db.schema.hasTable("carts");
    if (!isExist) {
      await db.schema.createTable("carts", (table) => {
        table.increments("_id").primary();
        table.string("timestamp").notNullable();
      });
      console.log("Carts table created successfully");
    }
  } catch (error) {
    console.log(error);
  }
})();
