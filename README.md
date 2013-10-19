cmdsrv
======
[![NPM version](https://badge.fury.io/js/cmdsrv.png)](http://badge.fury.io/js/cmdsrv)

`cmdsrv` is a simple text protocol server that allows you to easily define the protocol and it's handlers.

The goal of `cmdsrv` is to be a very simplistic way to create your own text based protocol (like the memcached protocol).

## Example Protocol
```
GET <KEY>
SET <KEY> <VALUE>
DEL <KEY>
STATS
```

## Installation
### Via Git
```bash
git clone git://github.com/brettlangdon/cmdsrv.git
cd ./cmdsrv
npm install
```
### Via NPM
```bash
npm install cmdsrv
```

## Usage
```javascript
var cmdsrv = require("cmdsrv");

var data = {};

var server = new cmdsrv();

server.on("get", function(connection, key){
    // `connection` is just a normal `net.Socket` connection
    var result = data[key] || "";
    connection.write("RESULT " + result + "\r\n");
});

server.on("set", function(connection, key, value){
    data[key] = value;
    connection.write("SAVED\r\n");
});

server.start();
```

## API

### cmdsrv([options])
This is the constructor for `cmdsrv` and should be invoked as `new cmdsrv()`.

#### options
* `port` - which port to bind to when calling `start` (default: `3223`)
* `delimiter` - which character to split each command on (default: `" "`)
* `caseSensitive` - whether or not the commands should be case sensitive (default: `false`)

### cmdsrv.on(command, handler)
Received commands are emitted to any handlers listening for that command.

#### command
`command` is the command you want to be able to handle with `handler`.
For example, `"get"` would mean that `handler` gets called for each call to the `"get"` command.

If `caseSensitive == true` then `"GET" !== "get"`

#### handler
`handler` is a function which gets called every time the `command` is seen.

The definition for `handler` will be `(connection, [arg1, arg2, ...])`, where `connection` is
the client connection (useful for sending responses back with `connection.write(data)`) and the args
are the arguments sent with the command. For example if the client sent the command `"get hello"` then
the function definition for `handler` might look like `function(connection, key)` where `connection` is the
`net.Socket` of the user who sent the command and `key` is `"hello"`.

### cmdsrv.start(callback)
Start the server.

#### callback
An options callback that gets called when the server is listening.

## Default Events
* `error` - this is simply the client connection error event being bubbled up to the server.

## License
```
The MIT License (MIT)

Copyright (c) 2013 Brett Langdon <brett@blangdon.com> (http://www.brett.is)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
