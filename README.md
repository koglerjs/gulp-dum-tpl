##gulp-dum-tpl

A gulp plugin wrapping the [DUM templating library](https://github.com/koglerjs/dum-tpl).  

###This is mostly an example plugin.

See [my article here](https://koglerjs.com/verbiage/gulp).

###Usage

```
var dum = require('gulp-dum-tpl');

gulp.task("default", function(){
	return gulp.src(["templates/*.tpl"])
		.pipe(dum("tpls.js", {varName:"tpls.main"}))
		.pipe(gulp.dest("tpls/"));
});
```