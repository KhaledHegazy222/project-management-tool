exports.queryList = {
  CREATE_USER_QUERY: 'insert into "user"(mail, password, first_name, last_name) values ($1, $2, $3, $4)',
  UPDATE_USER_PASSWORD: 'update "user" set password = $1 where user_id = $2',
  GET_USER_QUERY: 'select * from "user" where mail = $1',
  GET_USER_ID_QUERY: 'select user_id from "user" where mail = $1',
  GET_USER_BY_ID_QUERY: 'select user_id, mail, first_name, last_name from "user" where user_id = $1',
  GET_PROJECT_LIST_QUERY: 'select p.project_id, p.project_title, p.project_creation_time, p.project_last_update_time from (select project_id from project_user where user_id = $1) as pu inner join project as p on p.project_id = pu.project_id order by p.project_creation_time',
  GET_STARRED_PROJECT_LIST_QUERY: 'select p.project_id, p.project_title, p.project_creation_time, p.project_last_update_time from (select project_id from project_user where user_id = $1 and project_starred = true) as pu inner join project as p on p.project_id = pu.project_id order by p.project_creation_time',
  GET_RECENT_PROJECT_LIST_QUERY: 'select p.project_id, p.project_title, p.project_creation_time, p.project_last_update_time from (select project_id from project_user where user_id = $1) as pu inner join project as p on p.project_id = pu.project_id order by p.project_last_update_time desc',

  ADD_VERIFICATION_ID_QUERY: 'insert into verification values((SELECT currval(\'user_user_id_seq\')), $1)',
  GET_VERIFICATION_ID_QUERY: 'select verification_id from verification where user_id = (select user_id from "user" where mail = $1)',
  GET_UNVERIFIED_USER_ID_QUERY: 'select user_id from verification where verification_id = $1',
  DELETE_USER_VERIFICATION_IDS_QUERY: 'delete from verification where user_id = $1',
  VERIFY_USER_QUERY: 'update "user" set active = true where user_id = $1',

  GET_REST_USER_ID_QUERY: 'select user_id from reset_password where reset_id = $1',
  GET_REST_ID_QUERY: 'select reset_id from reset_password where user_id = $1',
  ADD_REST_ID_QUERY: 'insert into reset_password values($1, $2)',
  DELETE_REST_ID_QUERY: 'delete from reset_password where user_id = $1',

  ADD_PROJECT_QUERY: 'insert into project(project_title) values ($1)',
  REFRESH_PROJECT_TIME_UPDATE_QUERY: 'update project set project_last_update_time = CURRENT_TIMESTAMP where project_id = (select project_id from task where task_id = $1)',
  DELETE_PROJECT_QUERY: 'delete from project where project_id = $1',
  ADD_PROJECT_USER_RELATIONSHIP: 'insert into project_user(project_id, user_id, project_user_state) values ((SELECT currval(\'project_project_id_seq\')), $1, \'OWNER\')',

  CHECK_PROJECT_OWNER_QUERY: 'select project_id from project_user where project_id = $1 and user_id = $2 and project_user_state = \'OWNER\'',
  CHECK_PROJECT_MEMBER_QUERY: 'select project_id from project_user where project_id = $1 and user_id = $2',

  GET_PROJECT_DETAIL_QUERY: 'select * from project where project_id = $1',
  GET_LAST_INSERTED_PROJECT_DETAIL_QUERY: 'select * from project where project_id = (SELECT currval(\'project_project_id_seq\'))',
  UPDATE_PROJECT_USER_STARRED_QUERY: 'update project_user set project_starred = $1 where user_id = $2 and project_id = $3',

  ADD_MEMBER_REQUEST_QUERY: 'insert into project_request values($1, $2)',
  GET_MEMBER_REQUEST_QUERY: 'select * from project_request where project_id = $1 and user_id = $2',
  GET_MEMBER_REQUESTS_QUERY: 'select pu.project_id, p.project_title, pu.request_first_seen from (select project_id, request_first_seen from project_request where user_id = $1) as pu inner join project as p on p.project_id = pu.project_id order by pu.request_first_seen desc',
  UPDATE_MEMBER_REQUESTS_SEEN_QUERY: 'update project_request set request_first_seen = false where user_id = $1 and request_first_seen = true;',
  DELETE_MEMBER_REQUEST_QUERY: 'delete from project_request where project_id = $1 and user_id = $2',

  ADD_MEMBER_QUERY: 'insert into project_user values($1, $2, \'MEMBER\')',
  GET_MEMBER_QUERY: 'select * from project_user where project_id = $1 and user_id = $2 and project_user_state = \'MEMBER\'',
  GET_MEMBERS_QUERY: 'select u.user_id, u.first_name, u.last_name, ps.project_user_state from (select user_id, project_user_state from project_user where project_id = $1) as ps inner join "user" as u on u.user_id = ps.user_id order by u.first_name, u.last_name',
  GET_REQUEST_PROJECT_MEMBERS_QUERY: 'select u.user_id, u.first_name, u.last_name from (select user_id from project_request where project_id = $1) as ps inner join "user" as u on u.user_id = ps.user_id order by u.first_name, u.last_name',

  ADD_TASK_QUERY: 'insert into task(project_id, task_title, task_state, task_assignee_id, task_reviewer_id, task_due_date, task_description) values($1, $2, $3, $4, $5, $6, $7)',
  GET_TASK_DETAIL_QUERY: 'select * from task where task_id = $1',
  GET_TASK_DETAIL_PROJECT_QUERY: 'select project_id from task where task_id = $1',
  GET_LAST_INSERTED_TASK_DETAIL_QUERY: 'select * from task where task_id = (SELECT currval(\'task_task_id_seq\'))',
  DELETE_TASK_QUERY: 'delete from task where task_id = $1',
  GET_PROJECT_TASKS_QUERY: 'select * from task where project_id = $1 order by task_title',
  CHANGE_TASK_STATE_QUERY: 'update task set task_state = $1 where task_id = $2',

  GET_TASK_UPDATERS_QUERY: 'select pu.user_id, t.task_assignee_id, t.task_reviewer_id from (select task_assignee_id, task_reviewer_id, project_id from task where task_id = $1) as t inner join project_user as pu on pu.project_id = t.project_id and pu.project_user_state = \'OWNER\'',

  ADD_COMMENT_QUERY: 'insert into comment (comment_author_id, comment_task_id, comment_content) values($1, $2, $3)',

  GET_TASK_COMMENTS_QUERY: 'select u.first_name, u.last_name, c.creation_time, c.comment_content from (select * from comment where comment_task_id = $1) as c inner join "user" as u on u.user_id = c.comment_author_id order by creation_time',
};
