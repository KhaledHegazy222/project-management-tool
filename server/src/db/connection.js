const pool = require('./pool');

exports.dbQuery = (queryText, queryParams) => new Promise((resolve, reject) => {
  pool.query(queryText, queryParams)
    .then((res) => resolve(res))
    .catch((err) => reject(err));
});
