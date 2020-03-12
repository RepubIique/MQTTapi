var mysql = require("mysql");
var constants = require("../constants");

const pool = mysql.createPool(constants.params.JAWSDB_URL);

let vendingdb = {};

vendingdb.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM users;`, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

vendingdb.addUser = bodyJson => {
  const { username, password, firstname, lastname, email } = bodyJson;
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO users (username, email, first_name, last_name, password, created_on) VALUES (?,?,?,?,?,NOW());`,
      [username, email, firstname, lastname, password],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results || {});
      }
    );
  });
};

vendingdb.createUser = bodyJson => {
  const { username, password, firstname, lastname, email } = bodyJson;
  return new Promise((resolve, reject) => {
    pool.query(
      `CALL createUser(?);`,
      [JSON.stringify(bodyJson)],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results[0] && results[0][0] ? results[0][0] : {});
      }
    );
  });
};

vendingdb.login = bodyJson => {
  const { username, password } = bodyJson;
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM users WHERE username = ? AND password = ?;`,
      [username, password],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results[0] || {});
      }
    );
  });
};


vendingdb.getAllProducts = bodyJson => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM products;`, (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};


vendingdb.storeOrder = bodyJson => {
  return new Promise((resolve, reject) => {
    pool.query(
      `CALL storeOrder(?);`,
      [JSON.stringify(bodyJson)],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results[0] ? results[0] : {});
      }
    );
  });
};

module.exports = vendingdb;
