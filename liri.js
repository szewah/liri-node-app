// require("dotenv").config();
// var keys = require("./keys.js");

var http = require ("http");

http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
}).listen(8888);