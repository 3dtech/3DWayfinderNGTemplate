var gulp = require('gulp');
var concat = require('gulp-concat');
var del = require('del');

gulp.task('default', function() {
  gulp.start('clean', 'html', 'scripts');
});

gulp.task('clean', function() {
	return del(['dist/*.*']);
});

gulp.task('scripts', function() {
	return gulp.src('./src/modules/*.js')
		.pipe(concat('main.js'))
		.pipe(gulp.dest('./dist/js/'));
});

gulp.task('html', function() {
	return gulp.src('./src/index.html').pipe(gulp.dest('./dist/'));
});