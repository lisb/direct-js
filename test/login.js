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

const args = process.argv.slice(2);
if (args.length === 0 || !args[0].includes(':')) {
  console.error('"id:password" was not found in arguments');
  process.exit(1);
}
const account = args[0];

const client = direct.getInstance();

client.setOptions({
  host: url.parse(endpoint).host,
  endpoint: endpoint,
  account
});

client.on("access_token_changed", token => {
  fs.writeFileSync(dotenv, `HUBOT_DIRECT_TOKEN=${token}`);
  console.log("logged in.");
  process.exit();
});

client.listen();
