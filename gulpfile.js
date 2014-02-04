var gulp = require('gulp');

var dum = require('./index.js');

gulp.task("default", function(){
	return gulp.src(["**/*.tpl", '!node_modules/**'])
		.pipe(dum("tpl.js", {tplLib:"asdf"}))
		.pipe(gulp.dest("tpls/"));
});