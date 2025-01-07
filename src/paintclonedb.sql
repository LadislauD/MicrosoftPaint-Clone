DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS drawing;
DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS preferencias;

CREATE TABLE user (
  idPainter INTEGER PRIMARY KEY AUTOINCREMENT,
  username varchar(30) UNIQUE NOT NULL,
  pass varchar(20) NOT NULL
);

CREATE TABLE drawing (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usernameD varchar(30) NOT NULL,
  createdDate TEXT,
  title varchar(100) NOT NULL,
  drawURL TEXT,
 edit BOOLEAN,
  FOREIGN KEY (usernameD) REFERENCES user (username)
);

CREATE TABLE comment(
  idComment INTEGER PRIMARY KEY AUTOINCREMENT,
  idDrawingComment INTEGER NOT NULL,
  usernameComment varchar(30) NOT NULL,
  comentario TEXT,
  FOREIGN KEY (idDrawingComment) REFERENCES drawing(id)
);

CREATE TABLE preferencias(
    usernameId varchar(30),
    tema varchar(10),
    FOREIGN KEY(usernameId) REFERENCES user(username)
);