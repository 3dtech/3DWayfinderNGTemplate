var browserSync = require('browser-sync').create();
browserSync.spa = require('browser-sync-spa');
var gulp = require('gulp');
gulp.concat = require('gulp-concat');
gulp.debug = require('gulp-debug');
gulp.minify = require('gulp-minify');
gulp.less = require('gulp-less');
gulp.plumber = require('gulp-plumber');
gulp.prep = require('gulp-preprocess');
gulp.sass = require('gulp-sass');
gulp.uglify = require('gulp-uglify');
//ggulp.watch = require('gulp-watch');
var del = require('del');
var path = require('path');
var pump = require('pump');

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
    "bower_components/3dwayfinder-angular/index.js",
    "./src/js/wayfinder/frak-stable.min.js",
    "./src/js/wayfinder/BasicUI.min.js",
    "./src/js/wayfinder/Wayfinder3D.min.js",
    "./src/js/wayfinder/Keyboard.js",
    "./src/js/wayfinder/KeyboardActions.js",
    "./src/js/wayfinder/KeyboardLayouts.js"
];

var distFolder = "dist/";

var prepOpts = {
    context: {
        NODE_ENV: 'development',
        DEBUG: true
    }
};

var uglifyOpts = {};

gulp.task('default', ['clean'], function () {
    gulp.start('html', /*'controllers',*/ 'views', 'vendor',
        'font', /*'js'*/'minifyJS',
        'json', 'img', 'css', 'less', /*'sass',*/
        'layout');
});

gulp.task('production', ['clean'], function () {
    uglifyOpts = {
        compress: {
            sequences: true,
            properties: true,
            dead_code: true,
            conditionals: true,
            comparisons: true,
            evaluate: true,
            booleans: true,
            loops: true,
            unused: true,
            drop_console: true
        }
    };
    prepOpts = {
        context: {
            NODE_ENV: 'production',
            DEBUG: false
        }
    };
    gulp.start('html', /*'controllers',*/ 'views', 'vendor',
        'font', /*'js'*/'minifyJS',
        'json', 'img', 'css', 'less', /*'sass',*/
        'layout');
});

gulp.task('browserSync', function () {
    browserSync.use(browserSync.spa({
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

gulp.task('clean', function () {
    return del([distFolder + '**', '!' + distFolder], {
        force: true
    });
});

gulp.task('html', function () {
    pump([
        gulp.src('./src/*.html'),
        gulp.prep(prepOpts),
        gulp.dest(distFolder + ''),
        browserSync.reload({
            stream: true
        })
    ]);
    /*return gulp.src('./src/*.html')
     .pipe(gulp.dest(distFolder + ''))
     .pipe(browserSync.reload({
     stream: true
     }));*/
});

gulp.task('views', function () {
    return gulp.src(['./src/views/*.html'])
        .pipe(gulp.dest(distFolder + 'views/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('vendor', function () {
    return gulp.src(vendor)
        .pipe(gulp.prep())
        .pipe(gulp.uglify({
                mangle: true
            })
        )
        .pipe(gulp.concat('vendor.js'))
        .pipe(gulp.dest(distFolder + 'lib/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('font', function () {
    return gulp.src(['./src/fonts/**/*.*', './bower_components/font-awesome/fonts/*'])
        .pipe(gulp.dest(distFolder + 'lib/fonts'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('controllers', [''], function () {
    return gulp.src(['./src/index.js', './src/js/controllers/**/*.js'])
        .pipe(gulp.dest(distFolder + 'lib/js/'))
        .pipe(browserSync.reload());
});

gulp.task('js', function () {
    return gulp.src('./src/js/**/')
        .pipe(gulp.dest(distFolder + 'lib/js/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('minifyJS', function () {
    console.log("minifyJS.prepOpts:", prepOpts);
    console.log("minifyJS.uglifyOpts:", uglifyOpts);
    pump([
        gulp.src([
            './src/js/app.js',
            './src/js/controllers/*Controller.js',
            './src/js/services/*Service.js',
            './src/js/directives/*.js'
        ]),
        gulp.concat('main.js'),
        gulp.prep(prepOpts),
        gulp.uglify(uglifyOpts),
        gulp.dest(distFolder + '/lib/js'),
        browserSync.reload({
            stream: true
        })
    ], function (err) {
        if (typeof err != "undefined")
            console.log("minifiJS.err:", err);
    });
});

gulp.task('json', function () {
    return gulp.src('./src/modules/keyboard/*.json')
        .pipe(gulp.dest(distFolder + '/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('img', function () {
    return gulp.src('./src/img/*')
        .pipe(gulp.dest(distFolder + 'lib/img'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('css', function () {
    return gulp.src([
        './bower_components/foundation-sites/dist/foundation.css',
        './bower_components/font-awesome/css/*'
    ])
        .pipe(gulp.dest(distFolder + 'lib/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('less', function () {
    return gulp.src('./src/less/styles.less')
        .pipe(gulp.plumber())
        .pipe(gulp.less({
            paths: [path.join(__dirname, 'less')]
        }))
        .pipe(gulp.dest(distFolder + 'lib/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('sass', [''], function () {
    return gulp.src(
        './bower_components/foundation-sites/scss/**/*.scss')
        .pipe(gulp.sass().on('error', gulp.sass.logError))
        .pipe(gulp.dest(distFolder + 'lib/css'));
});

gulp.task('layout', function () {
    return gulp.src('./layout.json')
        .pipe(gulp.dest(distFolder))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('watch-bs', ['default', 'browserSync'], function () {
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/views/*.html', ['views']);
    gulp.watch('src/less/*.less', ['less']);
    gulp.watch('./src/font/*', ['font']);
    gulp.watch(vendor, ['vendor']);
    gulp.watch('src/images/png/*', ['img']);
    gulp.watch('src/js/**/*.js', ['minifyJS']);
    //gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('./bower_components/foundation-sites/scss/**/*.scss', [
        'sass'
    ]);
});

gulp.task('watch-hs', ['default'], function () {
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
