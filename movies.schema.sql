CREATE TABLE if not exists movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(320),
  year integer,
  comments TEXT
);
