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

	var buffer = [];
	var firstFile = null;
	var key, tpl, obj;

	function bufferContents(file) {
		if (file.isNull()) {
			return;
		}
		if (file.isStream()) {
			return this.emit("error", new PluginError("gulp-dum-tpl",  "Streaming not supported"))
		}

		if (!firstFile) {
			firstFile = file;
		}

		key = path.basename(file.path).split(".");
		key.pop();
		key = key.join("");

		dumLib.addTplToPackage(file.contents.toString("utf8"), key, "gulp");
	}

	function endStream() {
		var tplLib = opt.tplLib;
		var obj;

		var str = dumLib.packageToString({varName:tplLib}, "gulp");

		var joinedPath = path.join(firstFile.base, fileName);

		var joinedFile = new File({
			cwd: firstFile.cwd
			,base: firstFile.base
			,path: joinedPath
			,contents: new Buffer(str)
		});

		this.emit("data", joinedFile);
		this.emit("end");
	}

	return through(bufferContents, endStream);
}