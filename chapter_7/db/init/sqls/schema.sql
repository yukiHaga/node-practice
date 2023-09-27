USE todo_development;

CREATE TABLE todos (
  id VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  status VARCHAR(255),
  PRIMARY KEY(id)
) COMMENT="todo";