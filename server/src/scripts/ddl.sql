-- drop all tables
drop table comment;
drop table task;
drop table project_request;
drop table project_user;
drop table project;
drop table verification;
drop table reset_password;
drop table "user";

-- clear all tables
delete from comment where true;
delete from task where true;
delete from project_request where true;
delete from project_user where true;
delete from project where true;
delete from verification where true;
delete from reset_password where true;
delete from "user" where true;

-- Create the 'user' table
CREATE TABLE "user" (
  user_id SERIAL PRIMARY KEY,
  creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  active BOOL DEFAULT 'false',
  mail VARCHAR(255) UNIQUE NOT NULL CHECK (mail ~ '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'),
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL
);

-- Create the 'verification' table
CREATE TABLE verification (
  user_id INT NOT NULL,
  verification_id VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES "user" (user_id)
);

-- Create the 'reset_password' table
CREATE TABLE reset_password (
  user_id INT NOT NULL,
  reset_id VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES "user" (user_id)
);

-- Create the 'project' table
CREATE TABLE project (
  project_id SERIAL PRIMARY KEY,
  project_title VARCHAR(255) NOT NULL,
  project_creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'project_user' table
CREATE TABLE project_user (
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  project_user_state VARCHAR(255) NOT NULL,
  project_starred BOOL DEFAULT 'false',
  FOREIGN KEY (project_id) REFERENCES project (project_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES "user" (user_id)
);

-- Create the 'project_request' table
CREATE TABLE project_request (
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES project (project_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES "user" (user_id)
);

-- Create the 'task' table
CREATE TABLE task (
  task_id SERIAL PRIMARY KEY,
  project_id INT NOT NULL,
  task_title VARCHAR(255) NOT NULL,
  task_state VARCHAR(255) NOT NULL,
  task_assignee_id INT NOT NULL,
  task_reviewer_id INT,
  task_due_date DATE,
  task_description TEXT,
  FOREIGN KEY (task_assignee_id) REFERENCES "user" (user_id),
  FOREIGN KEY (task_reviewer_id) REFERENCES "user" (user_id),
  FOREIGN KEY (project_id) REFERENCES project (project_id) ON DELETE CASCADE
);

-- Create the 'comment' table
CREATE TABLE comment (
  creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  comment_author_id INT NOT NULL,
  comment_task_id INT NOT NULL,
  comment_content TEXT,
  FOREIGN KEY (comment_author_id) REFERENCES "user" (user_id),
  FOREIGN KEY (comment_task_id) REFERENCES task (task_id) ON DELETE CASCADE
);
