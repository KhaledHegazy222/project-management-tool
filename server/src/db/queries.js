exports.queryList = {
  CREATE_USER_QUERY: 'insert into "user"(mail, password, first_name, last_name) values ($1, $2, $3, $4)',
  GET_USER_QUERY: 'select * from "user" where mail = $1',
  GET_PROJECT_LIST_QUERY: 'select distinct project_id from project_user where user_id = $1',

  ADD_PROJECT_QUERY: 'insert into project(project_title) values ($1)',
  ADD_PROJECT_USER_RELATIONSHIP: 'insert into project_user(project_id, user_id, project_user_state) values ((SELECT currval(\'project_project_id_seq\')), $1, \'OWNER\')',

  GET_PROJECT_USER_STATE_QUERY: 'select project_user_state from project_user where project_id = $1 and user_id = $2',
  GET_PROJECT_DETAIL_QUERY: 'select * from project where project_id = $1',

};