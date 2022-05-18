const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require('bcrypt');
const saltRound = 10;

const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use (
    session ({
        key: "userId",
        secret: "subscribe",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 24,
        },
    })
);

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "1qaz!QAZ",
    database: "loginsystem",
});

app.post('/createUser', (req, res)=> {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const surname = req.body.surname;
    const role = req.body.role;

    bcrypt.hash(password,saltRound, (err, hash) => {

        if (err) {
          console.log(err)
        }
        db.execute(
            "INSERT INTO users (name, surname, username, password, role) VALUES (?,?,?,?,?)",
            [name, surname, username, hash, role],
            (err, result)=> {
              console.log(result);
              res.send(result);
            }
        );
    })
});

app.post('/createStudent', (req, res)=> {
  const User_ID = req.body.User_ID;
  const StudentGroup_ID = req.body.group;

  db.execute(
    "INSERT INTO student (User_ID, StudentGroup_ID) VALUES (?,?)",
    [User_ID, StudentGroup_ID],
    (err, result)=> {
      console.log(err);
    }
  );
});

app.post('/createTeacher', (req, res)=> {
  const User_ID = req.body.User_ID;

  db.execute(
    "INSERT INTO teacher (User_ID) VALUES (?)",
    [User_ID],
    (err, result)=> {
      console.log(err);
    }
  );
});

app.post('/createGroup', (req, res)=> {
  const Name = req.body.name;

  db.execute(
    "INSERT INTO loginsystem.group (Name) VALUES (?)",
    [Name],
    (err, result)=> {
      res.send(result);
      console.log(err);
    }
  );
});

app.post('/createSubject', (req, res)=> {
  const Sub_name = req.body.name;

  db.execute(
    "INSERT INTO loginsystem.subject (Sub_name) VALUES (?)",
    [Sub_name],
    (err, result)=> {
      res.send(result);
      console.log(err);
    }
  );
});

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        res.send("We need a token, please give it to us next time");
    } else {
        jwt.verify(token, "jwtSecret", (err, decoded) => {
            if (err) {
                console.log(err);
                res.json({ auth: false, message: "you are failed to authenticate"});
            } else {
                req.userId = decoded.id;
                next();
            }
        });
    }
};

app.get('/isUserAuth', verifyJWT , (req, res) => {
    res.send("You are authenticated Congrats:")
})

app.get("/login", (req, res) => {
    if (req.session.user) {
      res.send({ loggedIn: true, user: req.session.user });
    } else {
      res.send({ loggedIn: false });
    }
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.execute(
        "SELECT * FROM users WHERE username = ?;",
        [username],
        (err, result)=> {
            if (err) {
                res.send({err: err});
            } 

            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if (response) {
                        const id = result[0].id
                        const token = jwt.sign({id}, "jwtSecret", {
                            expiresIn: 60 * 60 * 12,
                        })
                        req.session.user = result;

                        console.log(req.session.user);
                        res.json({auth: true, token: token, result: result});
                    } else{
                        res.json({auth: false, message: "Wrong username password"}); 
                    }
                })
            } else {
                res.json({auth: false, message: "no user exists"});
            }
        }
    );
});

app.get('/lessons', (req, res) => {
  const role = req.query?.role || null;
  const userID = req.query?.ID || null;

  if (role === 'teacher') {
    db.execute(
      `SELECT
        lesson.Start_Time AS start,
        lesson.End_Time AS end,
        Subject.Sub_name AS title,
        lesson.Jitsi_URL AS link
      FROM lesson
      LEFT JOIN Subject ON Subject.ID = lesson.Sub_ID
      LEFT JOIN teacher ON teacher.ID = lesson.Teacher_ID WHERE teacher.User_ID = ?;`,
      [userID],
      (err, result)=> {
        if (err) {
          res.send({err: err});
        }
        if (result.length > 0) {
          res.json(result);
        } else {
          res.json([]);
        }
      }
    );
  } else {
    let group_ID = null;
    new Promise((resolve, reject) => {
      db.execute(
        "SELECT StudentGroup_ID FROM Student Where Student.User_ID = ?;",
        [userID],
        (err, result)=> {
          if (err) {
            res.send({err: 'Error'});
          }
          group_ID = result[0]?.StudentGroup_ID || null;
          resolve();
        }
      );
    }).then(() => {
      db.execute(
        `SELECT
          lesson.Start_Time AS start,
          lesson.End_Time AS end,
          Subject.Sub_name AS title,
          lesson.Jitsi_URL AS link
        from lesson LEFT JOIN Subject ON Subject.ID = lesson.Sub_ID
        WHERE lesson.Group_ID = ?;`,
        [group_ID],
        (err, result)=> {
          if (err) {
            res.send({err: 'Error2'});
          }
          console.log(result);
          if (result.length > 0) {
            res.json(result);
          } else {
            res.json([]);
          }
        }
      );
    });
  }
});

app.get('/groups', (req, res) => {
  db.query(
    'SELECT * FROM loginsystem.group;',
    (err, result)=> {
      if (err) {
        res.send({err: err});
      }
      if (result.length > 0) {
        res.json(result);
      } else {
        res.json([]);
      }
    }
  );
});

app.get('/teachers', (req, res) => {
  db.query(
    `SELECT T.ID, name, surname FROM loginsystem.teacher T
     LEFT JOIN users ON users.ID = T.User_ID;`,
    (err, result)=> {
      if (err) {
        res.send({err: err});
      }
      if (result.length > 0) {
        res.json(result);
      } else {
        res.json([]);
      }
    }
  );
});

app.get('/subjects', (req, res) => {
  db.query(
    'SELECT * FROM loginsystem.subject;',
    (err, result)=> {
      if (err) {
        res.send({err: err});
      }
      if (result.length > 0) {
        res.json(result);
      } else {
        res.json([]);
      }
    }
  );
});

app.post('/createLesson', (req, res)=> {
  const Sub_ID = ''+req.body.subject;
  const Group_ID = ''+req.body.group;
  const Teacher_ID = ''+req.body.teacher;
  const Start_Time = req.body.startTime;
  const End_Time = req.body.endTime;
  const Jitsi_URL = req.body.jitsiURL;

  db.execute(
      "INSERT INTO lesson (Sub_ID, Start_Time, End_Time, Teacher_ID, Group_ID, Jitsi_URL) VALUES (?,?,?,?,?,?)",
      [Sub_ID, Start_Time, End_Time, Teacher_ID, Group_ID, Jitsi_URL],
      (err, result)=> {
        console.log(result);
        res.send(result);
      }
  );
});

app.listen(3001, () => {
    console.log("running server");
});
