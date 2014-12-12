var shoe = require('shoe');
var through = require('through');
var http = require('http');
var ecstatic = require('ecstatic');
var MuxDemux = require('mux-demux');
var server,sock,sourcestreams = [];
var samplestream = require("./samplestream.js");


//Create an array with 100 streams and send them through one shoe connection
for(var i = 0;i<10;i++){

	sourcestreams.push(new samplestream());
}

//Setup http server, use ecstatic to serve the content in public directory.

server = http.createServer(ecstatic({root:__dirname+'/public'}));
server.listen(7777,function(){
	console.log("listening on port 7777");
});

//Setup websocket connection
sock = shoe(function(stream){

	var mx = MuxDemux();
	//Setup mux-demux "device"
	stream.pipe(mx).pipe(stream);
	//For each sample stream in sourcestreams array
	//create a write stream , mux-demux will create readable
	//streams on the other side (the browser)
	for (var i=0;i<sourcestreams.length;i++) {
		//We have to name each stream so we can get them in the browser code
		var name = "mystream"+i;
		var datasetstream = mx.createWriteStream(name);
		sourcestreams[i].pipe(datasetstream);
	};

});

//Create one socket in the path /numbers
sock.install(server,'/numbers');