// Copyright (c) 2020 L is B Corp.
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const direct = require("../lib/direct-node.min.js").DirectAPI;
const fs = require("fs");
const path = require("path");
const url = require("url");

const endpoint = "wss://api.direct4b.com/albero-app-server/api";
const dotenv = path.join(process.cwd(), ".env");

const client = direct.getInstance();

client.setOptions({
  host: url.parse(endpoint).host,
  endpoint: endpoint
});

client.on("access_token_changed", token => {
  fs.writeFileSync(dotenv, `HUBOT_DIRECT_TOKEN=${token}`);
  console.log("logged in.");
  process.exit();
});

client.listen();
