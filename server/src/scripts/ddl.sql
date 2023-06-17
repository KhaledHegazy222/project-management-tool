-- Create the 'user' table
CREATE TABLE "user" (
  user_id SERIAL PRIMARY KEY,
  creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  mail VARCHAR(255) UNIQUE NOT NULL CHECK (mail ~ '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'),
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL
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
  FOREIGN KEY (project_id) REFERENCES project (project_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES "user" (user_id)
);
