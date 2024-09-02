const mangoose = require('mangoose');
const connection = mangoose.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'yourdbname',
});

connection.query(
  'SELECT * FROM users WHERE username = ?',
  [username],
  (err, results) => {
    // Handle login
  }
);
