import { logger } from "../../src/js/logger.js";

export class MongoClass {
  constructor(collection) {
    this.collection = collection;
  }

  async getAll() {
    try {
      return this.collection.find({});
    } catch (error) {
      logger.error(error);
    }
  }

  async getById(id) {
    try {
      return this.collection.findById(id);
    } catch (error) {
      logger.error(error);
    }
  }

  async getByProps(filter) {
    try {
      return this.collection.find(filter);
    } catch (error) {
      logger.error(error);
    }
  }

  async getOne(filter) {
    try {
      return this.collection.findOne(filter);
    } catch (error) {
      logger.error(error);
    }
  }

  async createDocument(obj) {
    try {
      return await new this.collection(obj).save();
    } catch (error) {
      logger.error(error);
    }
  }

  async updateDocument(id, obj) {
    try {
      return await this.collection.updateOne({ _id: id }, { $set: obj });
    } catch (error) {
      logger.error(error);
    }
  }

  async updateDocumentByProps(filterObj, obj) {
    try {
      return await this.collection.updateOne(filterObj, { $set: obj });
    } catch (error) {
      logger.error(error);
    }
  }

  async updateManyDocument(filterObj, obj) {
    try {
      return await this.collection.updateMany(filterObj, { $set: obj });
    } catch (error) {
      logger.error(error);
    }
  }

  async deleteDocument(id) {
    try {
      return await this.collection.deleteOne({ _id: id });
    } catch (error) {
      logger.error(error);
    }
  }

  async deleteDocumentByProps(filterObj) {
    try {
      return await this.collection.deleteOne(filterObj);
    } catch (error) {
      logger.error(error);
    }
  }

  async deleteManyDocument(filterObj) {
    try {
      return await this.collection.deleteMany(filterObj);
    } catch (error) {
      logger.error(error);
    }
  }
}
