/* This file defines a sample readable stream that emits random numbers and waits 0.5 seconds */
var through = require('through');
var Readable = require('stream').Readable;
var util = require('util');

util.inherits(TestDatasetStream,Readable);

function TestDatasetStream(opts){
	Readable.call(this,{objectMode:true});	

}


TestDatasetStream.prototype._read=function(){
	setTimeout(function(){
		this.push({
			"myValue":Math.random(100)
		});
	}.bind(this),500);

}

module.exports = TestDatasetStream;