// Copyright (c) 2020 L is B Corp.
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const direct = require("../lib/direct-node.min.js").DirectAPI;
const fs = require("fs");
const url = require("url");

const endpoint = "wss://api.direct4b.com/albero-app-server/api";
const accessToken = fs
  .readFileSync(".env")
  .toString()
  .replace("HUBOT_DIRECT_TOKEN=", "");

const client = direct.getInstance();

client.setOptions({
  host: url.parse(endpoint).host,
  endpoint: endpoint,
  access_token: accessToken
});

client.on("data_recovered", () => {
  console.log("Good");
  process.exit();
});

client.on("error_occurred", (err, data) => {
  console.error(`Bad: ${err}`);
  console.log(data);
  process.exit(1);
});

client.listen();
