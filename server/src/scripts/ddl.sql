-- Create the 'user' table
CREATE TABLE "user" (
  user_id SERIAL PRIMARY KEY,
  creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  mail VARCHAR(255) UNIQUE NOT NULL CHECK (mail ~ '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'),
  password VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255)
);
