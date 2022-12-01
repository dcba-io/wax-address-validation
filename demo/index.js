const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("build"));

app.post("/api/register", (req, res) => {
  const { username, password, info } = req.body;

  if (!info) info = "";

  if (!username || !password) {
    res.send({ result: false, error: "Username and password fields required" });
    return;
  }

  let users = loadUsers();

  if (users.find(u => u.username === username)) {
    res.send({ result: false, error: "Username exists" });
    return;
  }

  users.push({
    username,
    password,
    info
  });

  saveUsers(users);

  res.send({ result: true });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.send({ result: false, error: "Username and password fields required" });
    return;
  }

  if (!users.find(u => u.username === username && u.password === password)) {
    res.send({ result: false, error: "The credentials do not match" });
    return;
  }

  res.send({ result: true });
});

//

function loadUsers() {
  if (fs.existsSync("users.json")) {
    return JSON.parse(fs.readFileSync("users.json", "utf-8"));
  } else {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync("users.json", JSON.parse(users), { encoding: "utf-8" });
}

app.listen(port, () => {
  console.log(`Wax Address Validation Demo started, listening on port ${port}`);
});
