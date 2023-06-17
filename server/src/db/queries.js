exports.queryList = {
  CREATE_USER_QUERY: 'insert into "user"(mail, password, first_name, last_name) values ($1, $2, $3, $4)',
  GET_USER_QUERY: 'select * from "user" where mail = $1',
  GET_USER_ID_QUERY: 'select user_id from "user" where mail = $1',
  GET_PROJECT_LIST_QUERY: 'select distinct project_id from project_user where user_id = $1',

  ADD_PROJECT_QUERY: 'insert into project(project_title) values ($1)',
  ADD_PROJECT_USER_RELATIONSHIP: 'insert into project_user(project_id, user_id, project_user_state) values ((SELECT currval(\'project_project_id_seq\')), $1, \'OWNER\')',

  CHECK_PROJECT_OWNER_QUERY: 'select project_id from project_user where project_id = $1 and user_id = $2 and project_user_state = \'OWNER\'',
  CHECK_PROJECT_MEMBER_QUERY: 'select project_id from project_user where project_id = $1 and user_id = $2',

  GET_PROJECT_DETAIL_QUERY: 'select * from project where project_id = $1',

  ADD_MEMBER_REQUEST_QUERY: 'insert into project_request values($1, $2)',
  GET_MEMBER_REQUEST_QUERY: 'select * from project_request where project_id = $1 and user_id = $2',
  GET_MEMBER_REQUESTS_QUERY: 'select pu.project_id, p.project_title from (select project_id from project_request where user_id = $1) as pu inner join project as p on p.project_id = pu.project_id',
  DELETE_MEMBER_REQUEST_QUERY: 'delete from project_request where project_id = $1 and user_id = $2',

  ADD_MEMBER_QUERY: 'insert into project_user values($1, $2, \'MEMBER\')',
  GET_MEMBER_QUERY: 'select * from project_user where project_id = $1 and user_id = $2 and project_user_state = \'MEMBER\'',
  GET_MEMBERS_QUERY: 'select u.user_id, u.first_name, u.last_name, ps.project_user_state from (select user_id, project_user_state from project_user where project_id = $1) as ps inner join "user" as u on u.user_id = ps.user_id ',
  GET_REQUEST_PROJECT_MEMBERS_QUERY: 'select u.user_id, u.first_name, u.last_name from (select user_id from project_request where project_id = $1) as ps inner join "user" as u on u.user_id = ps.user_id ',

};
