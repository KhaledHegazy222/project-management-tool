exports.queryList = {
  CREATE_USER_QUERY: 'insert into "user"(mail, password, first_name, last_name) values ($1, $2, $3, $4)',
  GET_USER_QUERY: 'select * from "user" where mail = $1'
};
