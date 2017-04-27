/* standard mock node backend to handle file uploads */

var express = require("express");
var path    = require("path");
var bodyParser = require('body-parser');
var formidable = require('formidable');
var fs = require('fs');


var app = express();

app.use(express.static(path.join(__dirname, '/')));


app.post('/upload', function(req, res){
	  var ret;
	  // create an incoming form object
	  var form = new formidable.IncomingForm();

	  // specify that we want to allow the user to upload multiple files in a single request
	  form.multiples = true;

	  // store all uploads in the /uploads directory
	  form.uploadDir = path.join(__dirname, '/uploads');
	  

	  // every time a file has been uploaded successfully,
	  // rename it to it's orignal name
	  form.on('file', function(field, file) {
		  
		  //if upload has same name just keep the other one for now
		  fs.stat(path.join(form.uploadDir, file.name), function(err, stat) {
			    if(err == null) {
			        console.log('File exists');
			    } else if(err.code == 'ENOENT') {
			        // file does not exist
			    	fs.rename(file.path, path.join(form.uploadDir, file.name));
			    	console.log('File does not exist');
			    }
			});
		  	var callback = function(state, result) {
		  		if (state < 0) {
		  			//bad, something went wrong
		  			//TODO: error checking here
		  		}
		  		else {
		  			//good
		  			ret = result;
		  			res.json({state:'success', data: ret});
		  		}
		  	}
		  	readData(file, callback);
	  });
	  
	  
	  
	  // log any errors that occur
	  form.on('error', function(err) {
	    console.log('An error has occured: \n' + err);
	  });

	  // once all the files have been uploaded, send a response to the client
	  form.on('end', function() {
	    //res.json({state:'success', data: ret});
	  });

	  // parse the incoming request containing the form data
	  
	  form.parse(req);

});

function readData(file, callback){
	var filePath = path.join(__dirname, '/uploads/' + file.name);
	console.log(filePath);
	fs.readFile(filePath, 'utf8', function (err, data) {
		  if (err) {
			  callback(-1);
		  }
		  console.log(data);
		  parseData(data, callback);
	});
}

/*
 * parse the data that we read from the file
 * from a .csv format to a readable JSON
 * assume first line defines fields
 */
function parseData(data, callback){
	  var lines=data.split('\r');
	  var result = [];
	  var headers=lines[0].split(',');

	  for(var i = 1; i < lines.length; i++){
		  var obj = {};
		  var currentline=lines[i].split(',');

		  for(var j=0;j<headers.length;j++){
			  obj[headers[j]] = currentline[j];
		  }

		  result.push(obj);
	  }
	  
	  //return result; //JavaScript object
	console.log(JSON.stringify(result)); //JSON
	callback(1, JSON.stringify(result));
	
}



/* start express server */
var server = app.listen(8888, function() {
	var host = server.address().address;
	var post = server.address().port;
})
