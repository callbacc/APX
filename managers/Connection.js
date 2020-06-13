const mysql = require("mysql2/promise");

module.exports = {
    "connect": async ()=>{
        return await mysql.createConnection({
            host: "localhost",
            port: "3306",
            user: "root",
            password: "",
            database: "arphenix"
        });
    }
}
