import knex from "knex";

export class KnexClass {
  constructor(config, nameTable) {
    this.db = knex(config);
    this.nameTable = nameTable;
  }

  async getAll() {
    try {
      return await this.db.from(this.nameTable).select("*");
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id) {
    try {
      let result = await this.db
        .from(this.nameTable)
        .where("_id", id)
        .select("*");
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async createDocument(obj) {
    try {
        let result = await this.db.from(this.nameTable).insert(obj);
        return result[0];
    } catch (error) {
      console.log(error);
    }
  }

  async updateDocument(id, obj) {
    try {
        let result = await this.db
        .from(this.nameTable)
        .where("_id", id)
        .update(obj);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteDocument(id) {
    try {
        let result = await this.db
        .from(this.nameTable)
        .where("_id", id)
        .del();
      return result;
    } catch (error) {
      console.log(error);
    }
  }

}
