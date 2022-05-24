
const mysql = require("mysql");

const config = {
    connectionlimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'admn.123',
    database: 'ipsirma',
    multipleStatements: true
};

var poolPromise = new mysql.createPool(config);

module.exports = {
    poolPromise: poolPromise
}