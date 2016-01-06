var gulp = require('gulp');
var concat = require('gulp-concat');
var debug = require('gulp-debug');
var del = require('del');
var less = require('gulp-less');
var path = require('path');
var vendor = [
    "./bower_components/3dwayfinder-angular/index.js",
    "./bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
    "./bower_components/angular-animate/angular-animate.min.js",
    "./bower_components/angular-panhandler/lib/angular-panhandler.js",
    "./bower_components/dragscroll/dragscroll.js"
];

var distFolder = "dist/";

gulp.task('default', function() {
    gulp.start('clean', 'html', 'scripts', 'vendor', 'font', 'js', 'json', 'img', 'less', 'layout');
});

gulp.task('clean', function() {
    return del([distFolder+'*.*'], {force: true});
});

gulp.task('scripts', function() {
    return gulp.src(['./src/index.js', './src/modules/**/*.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest(distFolder+'js/'));
});

gulp.task('vendor', function() {
    return gulp.src(vendor)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(distFolder+'js/'));
});

gulp.task('html', function() {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest(distFolder+''));
});

gulp.task('font', function() {
    return gulp.src('./src/font/*')
        .pipe(gulp.dest(distFolder+'font/'));
});

gulp.task('js', function() {
    return gulp.src('./src/js/*')
        .pipe(gulp.dest(distFolder+'js/'));
});

gulp.task('json', function() {
    return gulp.src('./src/modules/keyboard/*.json')
        .pipe(gulp.dest(distFolder+'/'));
});

gulp.task('img', function() {
    return gulp.src('./src/img/*')
        .pipe(gulp.dest(distFolder+'img/'));
});

gulp.task('less', function() {
    return gulp.src('./src/less/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less')]
        }))
        .pipe(gulp.dest(distFolder+'css'));
});

gulp.task('layout', function() {
    return gulp.src('./layout.json')
        .pipe(gulp.dest(distFolder));
});

gulp.task('watch', function() {
    gulp.start('watch-html');
});


gulp.task('watch-html', function(cb) {
    return gulp.src('src/*.html')
        .pipe(watch('src/*.html'))
        .pipe(gulp.dest('html'));
});
