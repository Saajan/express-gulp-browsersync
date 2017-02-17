var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-ruby-sass'),
  browserSync = require('browser-sync'),
  gulpLoadPlugins = require('gulp-load-plugins');

const $ = gulpLoadPlugins();

gulp.task('sass', function () {
  return sass('./src/sass/style.scss')
    .pipe($.plumber())
    .pipe($.autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
    }))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe($.cssnano())
    .pipe(gulp.dest('./public/css'))
});

gulp.task('css', function () {
  return gulp.src(['./src/css/bootstrap.css', './src/css/propeller.css'])
    .pipe($.plumber())
    .pipe($.concat('vendor.css'))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe($.cssnano())
    .pipe(gulp.dest('./public/css'))
});

gulp.task('scripts-custom', () => {
  return gulp.src(['./src/js/custom/main.js'])
    .pipe($.plumber())
    .pipe($.concat('main.js'))
    .pipe($.babel())
    .pipe(gulp.dest('./public/js'))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe($.uglify())
    .pipe(gulp.dest('./public/js'))
});

gulp.task('scripts-header', () => {
  return gulp.src([
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/angular/angular.min.js'
    ])
    .pipe($.plumber())
    .pipe($.concat('header.js'))
    .pipe(gulp.dest('./public/js'))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe($.uglify())
    .pipe(gulp.dest('./public/js'))
});

gulp.task('scripts-vendor', () => {
  return gulp.src([
      './bower_components/angular-bootstrap/ui-bootstrap.js',
      './bower_components/angular-route/angular-route.js',
      './bower_components/angular-bootstrap/ui-bootstrap.js',
    ])
    .pipe($.plumber())
    .pipe($.concat('vendor.js'))
    .pipe(gulp.dest('./public/js'))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe($.uglify())
    .pipe(gulp.dest('./public/js'))
});

gulp.task('watch', function () {
  gulp.watch('./src/js/custom/**/*.js', ['scripts-custom']);
  gulp.watch('./src/sass/**/*.scss', ['sass']);
});


var BROWSER_SYNC_RELOAD_DELAY = 500;

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
      script: 'bin/www',
      ext: 'scss js handlebars',
      stdout: false
    })
    .on('start', function onStart() {
      // ensure start only got called once
      if (!called) {
        cb();
      }
      called = true;
    })
    .on('restart', function onRestart() {
      // reload connected browsers after a slight delay
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    });
});

gulp.task('browser-sync', ['nodemon'], function () {

  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync({

    // informs browser-sync to proxy our expressjs app which would run at the following location
    proxy: 'http://localhost:3000',

    // informs browser-sync to use the following port for the proxied app
    // notice that the default port is 3000, which would clash with our expressjs
    port: 3000,

    // open the proxied app in chrome
    browser: ['google chrome']
  });
});

gulp.task('all-style', [
  'sass',
  'css'
]);

gulp.task('all-scripts', [
  'scripts-vendor',
  'scripts-custom',
  'scripts-header'
]);

gulp.task('default', [
  'all-style',
  'all-scripts',
  'browser-sync',
  'watch'
]);
