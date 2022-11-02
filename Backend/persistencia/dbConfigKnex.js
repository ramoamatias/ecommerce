// // Conexion SQLite3
const configSQLite = {
  client: 'sqlite3', //o 'better-sqlite3'
  connection: {
    filename: "../persistencia/database/ecommerce.sqlite"
  }
}

const configMySQL = {
    client: 'mysql2',
    connection: {
      host : 'localhost',
      port : 3306, 
      user : 'root',
      password : 'masterkey', 
      database : 'dbcoderhouse'
    }
}

export {configSQLite , configMySQL};