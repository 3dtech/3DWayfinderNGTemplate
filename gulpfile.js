var browserSync = require('browser-sync').create();
browserSync.spa = require('browser-sync-spa');
var gulp = require('gulp');
gulp.babel = require('gulp-babel');
gulp.concat = require('gulp-concat');
gulp.debug = require('gulp-debug');
gulp.expect = require('gulp-expect-file');
gulp.minify = require('gulp-minify');
gulp.less = require('gulp-less');
gulp.prep = require('gulp-preprocess');
gulp.uglify = require('gulp-uglify');
gulp.jshint = require('gulp-jshint');
//ggulp.watch = require('gulp-watch');
var fs = require('fs');
var del = require('del');
var path = require('path');
var pump = require('pump');

var baseDir = __dirname + '/dist';

var distFolder = "dist/";

var prepOpts = {
    context: {
        NODE_ENV: 'development',
        DEBUG: true,
        type3D: true
    }
};

var uglifyOpts = {};

gulp.task('default', ['clean'], function () {
    gulp.start('html', 'views', 'vendor',
        'font', 'minifyJS',
        'img', 'css', 'less','dist-less',
        'layout', 'rewrite');
});

gulp.task('production-2d', ['clean'], function () {
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
            DEBUG: false,
            type2D: true
        }
    };
    gulp.start('default');
});

gulp.task('production-3d', ['clean'], function () {
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
            DEBUG: false,
            type3D: true
        }
    };
    gulp.start('default');
});

gulp.task('2d', function () {
    prepOpts = {
        context: {
            NODE_ENV: 'production',
            DEBUG: false,
            type2D: true
        }
    };
    gulp.start('default');
});

gulp.task('3d', function () {
    prepOpts = {
        context: {
            NODE_ENV: 'production',
            DEBUG: false,
            type3D: true
        }
    };
    gulp.start('default');
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
             "node_modules": "node_modules"
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
});

gulp.task('views', function () {
    return gulp.src(['./src/views/*.html'])
        .pipe(gulp.dest(distFolder + 'views/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('vendor', function () {
    var files = JSON.parse(fs.readFileSync('vendor.json'));
    pump([
        gulp.src(files),
        gulp.expect(files),
        gulp.prep(),
        gulp.babel(),
        gulp.uglify({
            mangle: true
        }),
        gulp.concat('vendor.js'),
        gulp.dest(distFolder + 'lib/js'),
        browserSync.reload({
            stream: true
        })
    ], function (err) {
        if (!!err) console.log("VENDOR::err:", err);
    });
});

gulp.task('font', function () {
    return gulp.src([
        './src/fonts/**/*.*',
        './node_modules/font-awesome/fonts/*'
    ])
        .pipe(gulp.dest(distFolder + 'lib/fonts'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('jshint', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(gulp.jshint())
        .pipe(gulp.jshint.reporter('default'));
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
        gulp.babel(),
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

gulp.task('img', function () {
    return gulp.src('./src/img/*')
        .pipe(gulp.dest(distFolder + 'lib/img'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('css', function () {
    return gulp.src([
        './node_modules/font-awesome/css/font-awesome.min.css',
        './node_modules/angular-loading-bar/build/loading-bar.css'
    ])
        .pipe(gulp.dest(distFolder + 'lib/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('less', function () {
    pump([
        gulp.src('./src/less/styles.less'),
        gulp.less({
            paths: [path.join(__dirname, 'less')]
        }),
        gulp.dest(distFolder + 'lib/css'),
        browserSync.reload({
            stream: true
        })
    ], function (err) {
        if (typeof err !== "undefined")
            console.log("LESS::err:", err);
    });

});

gulp.task('dist-less', function () {
    pump([
        gulp.src(['./src/less/mixins.less', './src/less/styles.less', './src/less/variables.less', './src/less/variables_private.less',]),
        gulp.dest(distFolder + 'less'),
        browserSync.reload({
            stream:true
        })
    ], function (err) {
        if (typeof err !== "undefined")
            console.log("DIST-LESS::err:", err);
    })
});


gulp.task('layout', function () {
    return gulp.src('./layout.json')
        .pipe(gulp.dest(distFolder))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('rewrite', function () {
    pump([
        gulp.src('./src/.htaccess'),
        gulp.dest('./dist/')
    ], function (err) {
        if (!!err) console.log("rewrite:err:", err);
    });
});

gulp.task('watch-bs', ['3d', 'browserSync'], function () {
    prepOpts = {
        context: {
            NODE_ENV: 'development',
            DEBUG: true,
            type3D: true
        }
    };
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/views/*.html', ['views']);
    gulp.watch('src/less/*.less', ['less','dist-less']);
    gulp.watch('./src/font/*', ['font']);
    gulp.watch([
        'vendor.json',
        JSON.parse(fs.readFileSync('vendor.json'))
    ], ['vendor']);
    gulp.watch('src/images/png/*', ['img']);
    gulp.watch('src/js/**/*.js', ['minifyJS']);
    gulp.watch('src/.htaccess', ['rewrite']);
});


gulp.task('watch-bs2d', ['2d', 'browserSync'], function () {
    prepOpts = {
        context: {
            NODE_ENV: 'development',
            DEBUG: true,
            type2D: true
        }
    };
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/views/*.html', ['views']);
    gulp.watch('src/less/*.less', ['less','dist-less']);
    gulp.watch('./src/font/*', ['font']);
    gulp.watch('vendor.json', ['vendor']);
    gulp.watch('src/images/png/*', ['img']);
    gulp.watch('src/js/**/*.js', ['minifyJS']);
    gulp.watch('src/.htaccess', ['rewrite']);
});

gulp.task('watch-hs', ['3d'], function () {
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/views/*.html', ['views']);
    gulp.watch('src/less/*.less', ['less','dist-less']);
    gulp.watch('./src/font/*', ['font']);
    gulp.watch('vendor.json', ['vendor']);
    gulp.watch('src/images/png/*', ['img']);
    gulp.watch('src/js/**/*.js', ['minifyJS']);
    gulp.watch('src/.htaccess', ['rewrite']);
});
