const mysql = require('mysql');
const express = require('express');
const app = express();
const router = require('./routes/appRouter.js');
const port = 3000;

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "aofapp117SQL#",
  database: "mydb"
});

con.connect(function (err) {
  if (err) throw err;
  console.log('Connected')
});

// Middleware for logging
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});
// Middleware for parsing JSON
app.use(express.json());

app.use('/products',router(con));

const server = app.listen(port, () => {
  console.log(`Server running at <http://localhost>:${port}/`);
});

module.exports = {app, server, con};
