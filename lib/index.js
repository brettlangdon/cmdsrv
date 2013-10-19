var EventEmitter = require("events").EventEmitter;
var net = require("net");
var util = require("util");

var emitLines = function(buffer, emitter){
    var pos = buffer.indexOf("\n");
    while(~pos){
        emitter.emit("line", buffer.substring(0, pos));
        buffer = buffer.substring(pos + 1);
        pos = buffer.indexOf("\n");
    }
    return buffer;
};

var cmdsrv = function(options){
    EventEmitter.call(this);

    options = options || {};

    this.port = options["port"] || 3223;
    if(!this.port || typeof(this.port) !== "number"){
        throw new Error("cmdsrv: `port` paramter must be a 'number'");
    }

    this.caseSensitive = options["caseSensitive"] || false;
    this.delimiter = options["delimiter"] || " ";

    var self = this;
    this.server = net.createServer(function(connection){
        self.handle(connection);
    });
};
util.inherits(cmdsrv, EventEmitter);

cmdsrv.prototype.handle = function(connection){
    var self = this;
    var buffer = "";

    connection.on("line", function(line){
        var parts = line.trim().split(self.delimiter);

        if(!parts.length){
            return;
        }

        if(!self.caseSensitive){
            parts[0] = parts[0].toLowerCase();
        }

        var cmd = parts.shift();
        parts.unshift(connection);
        parts.unshift(cmd);

        self.emit.apply(self, parts);
    });

    connection.on("data", function(data){
        buffer += data;
        buffer = emitLines(buffer, connection);
    });

    connection.on("end", function(){
        buffer = emitLines(buffer, connection);
        if(buffer){
            connection.emit("line", buffer);
        }
    });

    connection.on("error", function(err){
        self.emit("error", err);
    });
};

cmdsrv.prototype.start = function(callback){
    var self = this;
    callback = callback || function(){
        console.log("cmdsrv listening on port " + self.port);
    }
    this.server.listen(this.port, callback);
};


return module.exports = cmdsrv;
