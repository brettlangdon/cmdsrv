var cmdsrv = require("./");

var data = {};

var server = new cmdsrv();

server.on("get", function(connection, key){
    var result = data[key] || "";
    connection.write("RESULT " + result + "\r\n");
});

server.on("set", function(connection, key, value){
    data[key] = value;
    connection.write("SAVED\r\n");
});

server.start();
