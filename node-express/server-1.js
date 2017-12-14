var express = require('express');
var http = require('http');

var hostname = 'localhost';
var port = 8080;

var app = express();

app.use(function (req,res,next) {
  console.log(req.headers);
  res.writeHead(200, { 'Content-Type': 'text/HTML' });
  res.end('<html><body><h1>Hello World!</h1></body></html>');
});

var server = http.createServer(app);

server.listen(port, hostname, function() {
  console.log('Server Running at http://${hostname}:${port}/');
});
