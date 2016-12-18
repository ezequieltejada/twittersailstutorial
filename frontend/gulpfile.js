var gulp = require('gulp');
var webserver = require('gulp-webserver');
var mainBowerFiles = require('main-bower-files');
var inject = require('gulp-inject');
var del = require('del');

var paths = {
    temp: 'temp',
    tempVendor: 'temp/vendor',
    tempIndex: 'temp/index.html',
    tempFonts: 'temp/fonts',

    index: 'app/index.html',
    appSrc: ['app/**/*', '!app/index.html'],
    bowerSrc: 'bower_components/**/*',
    fontsSrc: 'app/fonts'

};

gulp.task('default', ['watch']);

gulp.task('watch', ['serve'], function() {
    gulp.watch(paths.appSrc, ['customInject']);
    gulp.watch(paths.bowerSrc, ['vendorInject']);
    gulp.watch(paths.index, ['copyAll']);
});

gulp.task('serve', ['copyAll'], function() {
    return gulp.src(paths.temp)
        .pipe(webserver({
            livereload: true,
            proxies: [{
                source: '/api',
                target: 'http://localhost:1337'
            }]
        }));
});

gulp.task('copyAll', ['copyIndex'], function() {
    var appFiles = gulp.src(paths.appSrc).pipe(gulp.dest(paths.temp));
    var tempVendors = gulp.src(mainBowerFiles()).pipe(gulp.dest(paths.tempVendor));

    return gulp.src(paths.tempIndex)
        .pipe(inject(tempVendors, {
            relative: true,
            name: 'vendorInject'
        }))
        .pipe(inject(appFiles, {
            relative: true
        }))
        .pipe(gulp.dest(paths.temp));
});

gulp.task('copyIndex', function() {
    return gulp.src(paths.index).pipe(gulp.dest(paths.temp));
});

gulp.task('vendorInject', function() {
    var tempVendors = gulp.src(mainBowerFiles()).pipe(gulp.dest(paths.tempVendor));

    return gulp.src(paths.tempIndex)
        .pipe(inject(tempVendors, {
            relative: true,
            name: 'vendorInject'
        }))
        .pipe(gulp.dest(paths.temp));
});

gulp.task('customInject', function() {
    var appFiles = gulp.src(paths.appSrc).pipe(gulp.dest(paths.temp));

    return gulp.src(paths.tempIndex)
        .pipe(inject(appFiles, {
            relative: true
        }))
        .pipe(gulp.dest(paths.temp));
});

gulp.task('copyFonts', function() {
    return gulp.src(paths.fontsSrc).pipe(gulp.dest(paths.tempFonts));
});

gulp.task('clean', function() {
    del(paths.temp);
});