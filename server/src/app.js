const http = require("http");

const PORT = 8000;

const server = http.createServer((req, res) => {
  res.write("Hello World");
  res.end();
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

// const { Client } = require("pg");

// const connectDb = async () => {
//   try {
//     const client = new Client({
//       user: "admin",
//       host: "db",
//       database: "test_db",
//       password: "mypassword",
//       port: 5432,
//     });

//     await client.connect();
//     const res = await client.query("SELECT * FROM some_table");
//     console.log(res);
//     await client.end();
//   } catch (error) {
//     console.log(error);
//   }
// };

// connectDb();

const { Pool } = require("pg");

const pool = new Pool({
  user: "admin",
  host: "db",
  database: "db",
  password: "strongPassword",
  port: 5432,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error executing query", err);
  } else {
    console.log("Connected to PostgreSQL");
    console.log("Current time:", res.rows[0].now);
  }
  pool.end();
});
