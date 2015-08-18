// $ npm install websocket unorm
// $ node example.js

var direct = require("../lib/direct-node.js").DirectAPI.getInstance();

function start(accessToken) {
  direct.setOptions({ host:'api.direct4b.com', endpoint:'wss://api.direct4b.com/albero-app-server/api', 
    access_token: accessToken });
  direct.listen();
}

function list_talks() {
  var talks = direct.data.getTalks();

  for (var i = 0; i < talks.length; i++) {
    console.log(i + ": " + talks[i].name);
  }
};

function selected_talk(idx) {
  var talks = direct.data.getTalks();
  var talk = talks[idx];
  return talk;
}

function send_text(idx, text) {
  var talk = selected_talk(idx);

  direct.api.createMessage(talk.id, [0, 1], text);
}

function send_file(idx, path) {
  var talk = selected_talk(idx);
  var file = {
    name: require("path").basename(path),
    type: "image/png",
    size: require("fs").statSync(path).size,
    path: path
  };

  direct.api.upload(talk.domainId, talk.id, file);
}

direct.on('notify_create_message', function(msg) {
  console.log(msg);
});


var rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.question("AccessToken > ", function(answer) {
  start(answer);

  direct.on('data_recovered', function() {
    list_talks();
    rl.question("Select tolk index [0-n]> ", function(idx) {
      rl.question("message? ", function(text) {
        send_text(idx, text);
        send_file(idx, "./sample.png");
        rl.close();
      });
    });
  });
});

