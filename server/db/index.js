var mysql = require("mysql");
var constants = require("../constants");

const pool = mysql.createPool({
    connectionLimit: 20,
    host: 'm7nj9dclezfq7ax1.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'w0nuxbbxnehk7p79',
    password: 'pvdwa47jlsoreexn',
    database: 'vezqll2t58c0700v',
    multipleStatements: true
});

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
        return resolve(results[0] || {});
      }
    );
  });
};

vendingdb.getOrderHistory = bodyJson => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT u.id as user_id, o.id as order_id, u.first_name, u.last_name, u.email,
      p.id, p.name as product_name, p.image_url as image_url, p.price, o.total_amount, o.created_on
      FROM orders o
         LEFT JOIN order_products op ON o.id = op.order_id
         LEFT JOIN products p ON op.product_id = p.id
         LEFT JOIN users u ON o.user_id = u.id
     WHERE u.id = ${bodyJson.id};
     SELECT * FROM orders WHERE user_id = ${bodyJson.id};`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(orderHistoryPostProcess(results));
      }
    );
  });
};


const orderHistoryPostProcess = (data) => {
  const orders = data[1]
  const order_products = data[0]
  let results = []
  let orders_array = []
  orders.forEach(x => {
    let order_id = x.id
    orders_array = []
    order_products.forEach(y => {
      if(y.order_id === order_id){
        orders_array.push(y)
      }
    })
    results.push(orders_array)
  })
  return results
}

module.exports = vendingdb;


module.exports = vendingdb;
