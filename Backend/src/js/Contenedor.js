const fs = require("fs");

class Contenedor {

  constructor(fileName) {
    this.fileName = fileName;
    this.idObject = this.maxid();
    if (this.isExist()) {
      this.getAll().then(res => this.listObjets = res);
    } else {
      this.listObjets = [];
      fs.promises.writeFile(this.fileName, JSON.stringify(this.listObjets));
    }

  }

  isExist() {
    return fs.existsSync(this.fileName);
  }

  maxid() {
    if (this.isExist()) {
      let content = fs.readFileSync(this.fileName, "utf-8");
      content = JSON.parse(content);
      if (content.length !== 0) {
        let ids = content.map(el => el.id);
        return Math.max(...ids)
      } else {
        return 0
      }
    }

    return 0;
  }

  async save(object) {
    try {
      let objectsArray = [];
      this.idObject++;
      object.id = this.idObject;
      // Si no existe el archivo lo creamos diractemente sin leer el contenido
      if (!fs.existsSync(this.fileName)) {
        objectsArray.push(object);
        await fs.promises.writeFile(this.fileName, JSON.stringify(objectsArray))
      } else {
        const content = await fs.promises.readFile(this.fileName, "utf-8");
        objectsArray = JSON.parse(content);
        objectsArray.push(object);
        await fs.promises.writeFile(this.fileName, JSON.stringify(objectsArray));
      }
      return this.idObject;

    } catch (error) {
      console.error(error);
    }

  }

  async getById(idObject) {
    try {
      let objectsArray = [];
      const content = await fs.promises.readFile(this.fileName, "utf-8");
      objectsArray = JSON.parse(content);
      return objectsArray.find(el => el.id == idObject) || null;
    } catch (error) {
      console.log(error);
    }

  }

  async getAll() {
    try {
      const content = await fs.promises.readFile(this.fileName, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteById(idObject) {
    try {
      let objectArray = [];
      const content = await fs.promises.readFile(this.fileName, "utf-8");
      objectArray = JSON.parse(content);
      let posicionObjeto = objectArray.findIndex(el => el.id == idObject);
      objectArray.splice(posicionObjeto, 1);
      await fs.promises.writeFile(this.fileName, JSON.stringify(objectArray));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteAll() {
    if (this.isExist()) {
      await fs.promises.writeFile(this.fileName, "[]");
    }
  }

  async overwriteFile(newArray){
      await fs.promises.writeFile(this.fileName,JSON.stringify(newArray));
  }
}

module.exports = Contenedor;