/*

  The API here is not secure for simplicity. No authorization method is implemented,
  therefore don't use this backend logic directly on your project, specially on the Mainnet

  This API includes only the example usages between the contract and the Web2.0 backend.

*/

const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

const { Api, JsonRpc, RpcError } = require("eosjs");
const { JsSignatureProvider } = require("eosjs/dist/eosjs-jssig.js");
const fetch = require("node-fetch-commonjs");
const { TextEncoder, TextDecoder } = require("util");

//

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("build"));

const ENDPOINT = process.env.ENDPOINT;
const CONTRACT = process.env.CONTRACT;

const port = 3500;
var api = null,
  rpc = null;

function createConnection() {
  const signatureProvider = new JsSignatureProvider([process.env.PRIVATE_KEY]);

  rpc = new JsonRpc(ENDPOINT, { fetch });
  api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  });

  return { api, rpc };
}

function getAutoIncrCode() {
  var lastValue = 0;
  if (fs.existsSync("lastid.lock")) {
    lastValue = Number(fs.readFileSync("lastid.lock", "utf-8"));
  }
  lastValue++;
  fs.writeFileSync("lastid.lock", "" + lastValue, "utf-8");
  return lastValue;
}

async function transaction(name, data) {
  try {
    let result = await createConnection().api.transact(
      {
        actions: [
          {
            account: CONTRACT,
            name: name,
            authorization: [
              {
                actor: CONTRACT,
                permission: "active"
              }
            ],
            data: data
          }
        ]
      },
      {
        blocksBehind: 3,
        expireSeconds: 30
      }
    );
    return { transactionID: result.transaction_id, isError: false };
  } catch (e) {
    return e.json
      ? {
          isError: true,
          errorCode: e.json.code ? e.json.code : e.json.error.what,
          errorMessage: e.message ? e.message : e.details.message
        }
      : {
          isError: true,
          errorMessage: e.message,
          errorCode: e.code ? e.code : -1
        };
  }
}

app.get("/api/check-validation", async (req, res) => {
  const { username } = req.query;
  const rpc = await createConnection().rpc;

  if (!username) {
    res.send({ result: false, error: "Username is required" });
    return;
  }

  let users = loadUsers();
  let user = users.find(u => u.username === username);

  if (!user) {
    res.send({ result: false, error: "User could not be found" });
    return;
  }

  const result = await rpc.get_table_rows({
    json: true,
    code: CONTRACT,
    scope: CONTRACT,
    table: "valids",
    lower_bound: user.code,
    reverse: false,
    show_payer: false
  });

  if (result.rows[0] && "" + result.rows[0].code === "" + user.code) {
    res.send({ result: true, valid: true, address: result.rows[0].address });
  } else {
    res.send({ result: true, valid: false });
  }
});

app.post("/api/validate", async (req, res) => {
  const { address, username } = req.body;

  /*

    This endpoint is not secure here for simplicity. You should check the authorization in your Web 2.0 backend.

  */

  let users = loadUsers();
  let user = users.find(u => u.username === username);

  if (!address) {
    res.send({ result: false, error: "WAX address is required" });
    return;
  }

  if (!user) {
    res.send({ result: false, error: "User could not be found" });
    return;
  }

  let code;
  if (!user.code) {
    code = getAutoIncrCode();
    user.code = code;
  } else {
    code = user.code;

    const result = await rpc.get_table_rows({
      json: true,
      code: CONTRACT,
      scope: CONTRACT,
      table: "valids",
      lower_bound: code,
      reverse: false,
      show_payer: false
    });

    if (result.rows[0] && "" + result.rows[0].code === "" + code) {
      res.send({ result: true, code });
      return;
    }
  }

  let result = await transaction("request", { code, address });
  if (result.isError) {
    res.send({ result: false, error: result.errorMessage });
  } else {
    saveUsers(users);
    res.send({ result: true, code });
  }
});

app.get("/api/invalidate", async (req, res) => {
  const { username } = req.query;

  /*

    This endpoint is not secure here for simplicity. You should check the authorization in your Web 2.0 backend.

  */

  if (!username) {
    res.send({ result: false, error: "Username is required" });
    return;
  }

  let users = loadUsers();
  let user = users.find(u => u.username === username);

  if (!user) {
    res.send({ result: false, error: "User could not be found" });
    return;
  }
  if (!user.code) {
    res.send({ result: false, error: "User validation record not found" });
    return;
  }

  let result = await transaction("remove", { code: user.code });
  if (result.isError) {
    res.send({ result: false, error: result.errorMessage });
  } else {
    saveUsers(users);
    res.send({ result: true });
  }
});

app.post("/api/register", (req, res) => {
  var { username, password, info } = req.body;

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

  let users = loadUsers();

  /*

    This endpoint is not secure here for simplicity. You should set an authorization key on your Web2.0 backend

  */

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
  fs.writeFileSync("users.json", JSON.stringify(users), { encoding: "utf-8" });
}

app.listen(port, () => {
  console.log(`Wax Address Validation Demo started, listening on port ${port}`);
});
