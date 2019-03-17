const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const gulp = require('gulp');
const del = require('del');
const merge = require('merge-stream');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');

// Clean vendor
function clean() {
  return del(['./vendor/']);
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
  // Bootstrap JS
  const bootstrap = gulp.src('./node_modules/bootstrap/dist/js/**/*')
    .pipe(gulp.dest('./public/vendor/bootstrap/js'));
  // Font Awesome
  const fontAwesome = gulp.src([
    'node_modules/font-awesome/**/*',
    '!node_modules/font-awesome/{less,less/*}',
    '!node_modules/font-awesome/{scss,scss/*}',
    '!node_modules/font-awesome/.*',
    '!node_modules/font-awesome/*.{txt,json,md}',
  ])
    .pipe(gulp.dest('public/vendor/font-awesome'));
  // jQuery
  const jquery = gulp.src([
    'node_modules/jquery/dist/*',
    '!node_modules/jquery/dist/core.js',
  ])
    .pipe(gulp.dest('public/vendor/jquery'));
  // jQuery Easing
  const jqueryEasing = gulp.src([
    'node_modules/jquery.easing/*.js',
  ])
    .pipe(gulp.dest('public/vendor/jquery-easing'));
  return merge(bootstrap, fontAwesome, jquery, jqueryEasing);
}

// CSS task
function css() {
  return gulp
    .src('./public/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'expanded',
      includePaths: './node_modules',
    }))
    .on('error', sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
    }))
    .pipe(gulp.dest('./public/css'))
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./public/css'));
}

// JS task
function js() {
  return gulp
    .src([
      './public/js/*.js',
      '!./public/js/*.min.js',
    ])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(gulp.dest('./public/js'));
}

// Watch files
function watchFiles() {
  gulp.watch('./public/scss/**/*', css);
  gulp.watch('./public/js/**/*', js);
}

// Define tasks
const vendor = gulp.series(modules);
const build = gulp.series(vendor, gulp.parallel(css, js));
const watch = gulp.series(build, watchFiles);

// Export tasks
exports.css = css;
exports.js = js;
exports.clean = clean;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = build;
