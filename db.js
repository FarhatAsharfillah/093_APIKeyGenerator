const mysql = require("mysql2");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    port: 3309,
    password: "Asharf251003",       
    database: "apikey_system_db"
}).promise();

module.exports = db;
