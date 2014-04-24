// package.json prompter cli tool
var prompt = require("prompt");
var fs = require("fs");
var filename = "package.json";
var dir = "./";
var path = dir + filename;
var flags = "w+";
var events = require("events");
var emitter = new events.EventEmitter;
// this is so it wont error out
emitter.setMaxListeners(0);

fs.open(path, flags, function(err, fd){
		prompt.start();
		prompt.get(getKeys(), function(err, promptResult){
			produceString(fd, promptResult);
		});
});

function getKeys(){
	var keys = new Array();
	keys.push("author");
	keys.push("name");
	keys.push("description");
	keys.push("version");
	keys.push("repository_url");
	keys.push("main");
	keys.push("bin");
	keys.push("dependencies");
	keys.push("devDependencies");
	keys.push("optionalDependencies");
	keys.push("engines");
	return keys;
}

function produceString(fd, promptResult){
	var fileStr = "";
	for(var key in promptResult){
		if(promptResult.hasOwnProperty(key)){
			switch(key){
				case "repository_url":
				fileStr += '"repository":\n\t{"url": "' + promptResult[key] + '"},\n';
				break;
				default:
				fileStr += '"' + key + '": "' + promptResult[key] + '",\n';
			}
		}
	}
	// get rid of trailing ',\n'
	fileStr = fileStr.replace(/,\s$/, "");
	// surround with curly braces
	fileStr = "{\n" + fileStr + "\n}";
	// write file to system
	fs.write(fd, fileStr,0,fileStr.length, 0,function(err, written, buffer){
		console.log("in write callback");
		if(err){
			console.error("An Error occurred when wrinting your file %s", err);
		}else{
			console.log("Successfully wrote " + written +  " bytes to file:");
			console.log(buffer);
		}
	});
}

