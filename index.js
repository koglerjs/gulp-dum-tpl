var dumLib = require("dum-tpl");
var through = require("through");
var path = require("path");
var gutil = require("gulp-util");
var PluginError = gutil.PluginError;
var File = gutil.File;

module.exports = function(fileName, opt) {
	if(!fileName) {
		throw new PluginError("gulp-dum-tpl",  "Missing fileName");
	}
	opt = opt||{};

	var firstFile = null;
	var key, tpl, obj;

	function bufferContents(file) {
		//Skip empty/absent files
		if (file.isNull()) {
			return;
		}
		//This plugin doesn't support Streams
		if (file.isStream()) {
			return this.emit("error", new PluginError("gulp-dum-tpl",  "Streaming not supported"));
		}
		//Store a reference to the first file given.  
		//We'll use it to configure the outgoing file
		//(Follows convention of gulp-concat)
		if (!firstFile) {
			firstFile = file;
		}

		//Convert the path into a text key for dum-tpl to store.  
		//On the browser side, the template library will return functions
		//based on this key.

		//This may seem clunky to you, but this is an example plugin after all.
		key = path.basename(file.path).split(".");
		key.pop();
		key = key.join("");

		//Interact with the node library we're wrapping.  
		//(The "gulp" string is a namespace for dum-tpl.)  
		dumLib.addTplToPackage(file.contents.toString("utf8"), key, "gulp");
	}

	function endStream() {
		//This option, given to the plugin, is given to DUM to name the object
		//that contains the compiled templates.  
		var tplLib = opt.tplLib;

		//Generate a string containing the compiled (javascript) representation
		//of the templates.
		//(yes, varName, tplLib are inconsistent.  ;_;)
		var str = dumLib.packageToString({varName:tplLib}, "gulp");

		//Configure outgoing file.
		var joinedPath = path.join(firstFile.base, fileName);
		var joinedFile = new File({
			cwd: firstFile.cwd
			,base: firstFile.base
			,path: joinedPath
			,contents: new Buffer(str)
		});

		//Emit outgoing file and end.  
		this.emit("data", joinedFile);
		this.emit("end");
	}

	return through(bufferContents, endStream);
}