var gulp = require('gulp');
var plumber = require('gulp-plumber');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var debug = require('gulp-debug');
var less = require('gulp-less');
var sass = require('gulp-sass');
var del = require('del');
var path = require('path');
var browserSync = require('browser-sync').create();
var spa = require('browser-sync-spa');
var baseDir = __dirname + '/dist';
var vendor = [
    "bower_components/jquery/dist/jquery.min.js",
    "bower_components/jquery-ui/jquery-ui.min.js",
    "bower_components/bootstrap/dist/js/bootstrap.min.js",
    "bower_components/angular/angular.min.js",
    "bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
    "bower_components/angular-animate/angular-animate.min.js",
    "bower_components/angular-sanitize/angular-sanitize.min.js",
    "bower_components/angular-route/angular-route.min.js",
    "bower_components/angular-panhandler/lib/angular-panhandler.js",
    "bower_components/angular-toArrayFilter/toArrayFilter.js",
    "bower_components/angular-foundation/mm-foundation-tpls.js",
    "bower_components/foundation-sites/dist/foundation.js",
    "bower_components/dragscroll/dragscroll.js",
    "bower_components/3dwayfinder-angular/index.js"
];

var distFolder = "dist/";

gulp.task('default', ['clean'], function() {
    gulp.start('html', /*'controllers',*/ 'views', 'vendor',
        'font', 'js',
        'json', 'img', 'css', 'less', /*'sass',*/
        'layout');
});

gulp.task('browserSync', ['default'], function() {
    browserSync.use(spa({
        selector: "[ng-app]",
        history: {
            index: '/index.html'
        }
    }));
    browserSync.init({
        port: 8080,
        server: {
            baseDir: baseDir,
            files: baseDir + "/*"
                /*routes: {
                  "bower_components": "bower_components"
                }*/
        },
        ui: {
            port: 8081
        },
        logLevel: "info"
        /* https: true */
    })
});

gulp.task('clean', function() {
    return del([distFolder + '**', '!' + distFolder], {
        force: true
    });
});

gulp.task('html', function() {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest(distFolder + ''))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('views', function() {
    return gulp.src(['./src/views/*.html'])
        .pipe(gulp.dest(distFolder + 'views/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('vendor', function() {
    return gulp.src(vendor)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(distFolder + 'js/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('font', function() {
    return gulp.src(['./src/fonts/*', './bower_components/font-awesome/fonts/*'])
        .pipe(gulp.dest(distFolder + 'fonts/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('controllers', [''], function() {
    return gulp.src(['./src/index.js', './src/js/controllers/**/*.js'])
        .pipe(gulp.dest(distFolder + 'js/'))
        .pipe(browserSync.reload());
});

gulp.task('js', function() {
    return gulp.src('./src/js/**/')
        .pipe(gulp.dest(distFolder + 'js/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('json', function() {
    return gulp.src('./src/modules/keyboard/*.json')
        .pipe(gulp.dest(distFolder + '/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('img', function() {
    return gulp.src('./src/img/*')
        .pipe(gulp.dest(distFolder + 'img/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('css', function() {
    return gulp.src([
            './bower_components/foundation-sites/dist/foundation.css',
            './bower_components/font-awesome/css/*'
        ])
        .pipe(gulp.dest(distFolder + 'css/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('less', function() {
    return gulp.src('./src/less/styles.less')
        .pipe(plumber())
        .pipe(less({
            paths: [path.join(__dirname, 'less')]
        }))
        .pipe(gulp.dest(distFolder + 'css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('sass', [''], function() {
    return gulp.src(
            './bower_components/foundation-sites/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(distFolder + 'css'));
});

gulp.task('layout', function() {
    return gulp.src('./layout.json')
        .pipe(gulp.dest(distFolder))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('watch-bs', ['default', 'browserSync'], function() {
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/views/*.html', ['views']);
    gulp.watch('src/less/*.less', ['less']);
    gulp.watch('./src/font/*', ['font']);
    gulp.watch(vendor, ['vendor']);
    gulp.watch('src/images/png/*', ['img']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('./bower_components/foundation-sites/scss/**/*.scss', [
        'sass'
    ]);
});

gulp.task('watch-hs', ['default'], function() {
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/views/*.html', ['views']);
    gulp.watch('src/less/*.less', ['less']);
    gulp.watch('./src/font/*', ['font']);
    gulp.watch(vendor, ['vendor']);
    gulp.watch('src/images/png/*', ['img']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('./bower_components/foundation-sites/scss/**/*.scss', [
        'sass'
    ]);
});
