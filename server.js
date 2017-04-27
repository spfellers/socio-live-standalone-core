var express = require("express");
var path    = require("path");
var bodyParser = require('body-parser');


var app = express();

app.use(express.static(path.join(__dirname, '/')));

/* start express server */
var server = app.listen(8888, function() {
	var host = server.address().address;
	var post = server.address().port;
})
