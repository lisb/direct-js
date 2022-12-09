// Copyright (c) 2020 L is B Corp.
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const direct = require('../lib/direct-node.min.js').DirectAPI;
const fs = require('fs');
const path = require('path');
const url = require('url');

const endpoint = 'wss://api.direct4b.com/albero-app-server/api';
const dotenv = path.join(process.cwd(), '.env');
const accessToken = fs.readFileSync(dotenv).toString().replace('HUBOT_DIRECT_TOKEN=', '');

const client = direct.getInstance();

client.setOptions({
  host: url.parse(endpoint).host,
  endpoint: endpoint,
  access_token: accessToken,
});

client.on('data_recovered', () => {
  console.info('data recovered');
  if (
    validUserObject(Object.values(client.userObjects())[0]) &&
    validTalkObject(Object.values(client.talkObjects())[0]) &&
    validDomainObject(Object.values(client.domainObjects())[0])
  ) {
    console.info('Good');
    process.exit();
  } else {
    process.exit(1);
  }
});

client.on('error_occurred', (err, data) => {
  console.error(`Bad: ${err}`);
  console.log(data);
  process.exit(1);
});

client.listen();

function validUserObject(u) {
  return (
    u.id != null &&
    u.id_i64 != null &&
    u.name != null &&
    u.displayName != null &&
    u.updatedAt != null
  );
}

function validTalkObject(t) {
  return (
    t.id != null &&
    t.id_i64 != null &&
    t.type != null &&
    t.users != null &&
    t.userIds != null &&
    t.domain != null &&
    t.domainId != null &&
    t.domainId_i64 != null
  );
}

function validDomainObject(d) {
  return (
    d.id != null &&
    d.id_i64 != null &&
    d.domainInfo != null &&
    d.profileDefinition != null &&
    d.setting != null &&
    d.role != null &&
    d.updatedAt != null
  );
}
