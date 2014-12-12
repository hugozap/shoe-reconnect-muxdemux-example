/*Browser code, connect to the server, receive data from
multiple streams */

var shoe = require('shoe');
var MuxDemux = require('mux-demux');
var through = require('through');
var inject = require("reconnect-core")

//create a reconnection for shoe
var reconnect = inject(shoe);

//setup reconnection
//reconnect receives a function that is called
//everytime the connection is made
reconnect(function(websocketstream){

	var mx = MuxDemux();

	//Setup mux-demux device
	websocketstream.pipe(mx).websocketstream;

	//mux-demux "connection" event runs once for each stream
	//the stream.meta property contains the name of the stream
	//we decide what to do with the stream based on its name
	mx.on('connection',function(stream){

		//Fot this example we just connect the stream
		//to a basic  stream created with 'through'
		//that displays the value in the div element with the same
		//id as the stream name (stream.meta)

		stream.pipe(through(function(chunk){

			//Each chunk is an object with the following properties:
			//{ 
			//	myValue:SomeRandomNumber
			//}

			var elem = document.getElementById(stream.meta);

			if(elem){
				elem.innerHTML = chunk.myValue; 
			}

		}));

		console.log('Stream connected'+stream.meta);
	});


})
.on("connect",function(){
	document.getElementById("disconnected").style.display = "none";
	document.getElementById("connected").style.display = "block";

})
.on("disconnect",function(err){
	document.getElementById("disconnected").style.display="block";
	document.getElementById("connected").style.display="none";

	if(err){
		console.log(err);
	}
}).connect("/numbers");

