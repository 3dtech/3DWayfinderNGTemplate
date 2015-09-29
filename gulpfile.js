var gulp = require('gulp');
var concat = require('gulp-concat');
var debug = require('gulp-debug');
var del = require('del');
var less = require('gulp-less');
var path = require('path');
var vendor = [
	"./bower_components/3dwayfinder-angular/index.js"
];

gulp.task('default', function() {
	gulp.start('clean', 'html', 'scripts', 'vendor', 'less');
});

gulp.task('clean', function() {
	return del(['dist/*.*']);
});

gulp.task('scripts', function() {
	return gulp.src(['./src/index.js', './src/modules/**/*.js'])
		.pipe(concat('main.js'))
		.pipe(gulp.dest('./dist/js/'));
});

gulp.task('vendor', function() {
	return gulp.src(vendor)
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest('./dist/js/'));
});

gulp.task('html', function() {
	return gulp.src('./src/index.html').pipe(gulp.dest('./dist/'));
});

gulp.task('less', function () {
  return gulp.src('./src/less/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less') ]
    }))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('watch', function() {
	gulp.start('watch-html');
});


gulp.task('watch-html', function (cb) {
	return gulp.src('src/*.html')
			.pipe(watch('src/*.html'))
			.pipe(gulp.dest('html'));
});
