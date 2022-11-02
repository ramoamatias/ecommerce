export class FirebaseClass {
  constructor(collection) {
    this.collection = collection;
  }

  async getAll() {
    try {
      const querySnapshot = await this.collection.get();
      const docs = querySnapshot.docs;
      const response = docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id) {
    try {
      const doc = await this.collection.doc(id).get();
      return {
        id: doc.id,
        ...doc.data(),
      };
    } catch (error) {
      console.log(error);
    }
  }

  async createDocument(obj) {
    try {
      await this.collection.doc().create(obj);
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async updateDocument(id, obj) {
    try {
      await this.collection.doc(id).update(obj);
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteDocument(id) {
    try {
      await this.collection.doc(id).delete();
      return true;
    } catch (error) {
      console.log(error);
    }
  }
}
