const gulp = require('gulp');
const babel = require('gulp-babel');
const rename = require('gulp-rename')

gulp.task('default', () =>
	gulp.src('./lib/custom-element-test.src.js')
		.pipe(babel({
			presets: ['es2015']
		}))
    .pipe(rename('custom-element-test.js'))
		.pipe(gulp.dest('lib'))
);
