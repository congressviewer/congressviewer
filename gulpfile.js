var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
//var uncss = require('gulp-uncss');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var plumber = require('gulp-plumber');
//var uglify = require('gulp-uglify');
//var rename = require('gulp-rename');
//var imagemin = require('gulp-imagemin');

// Basic CSS compilation
gulp.task('styles', function() {
   gulp.src(['./src/scss/app.scss'])
    .pipe(plumber({
      handleError: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(sass({ includePaths: ['./node_modules/foundation-sites/scss'] }))
    .pipe(concat('app.css'))
    /*.pipe(uncss({
        html: ['public/index.html'],
        ignore: [new RegExp('^meta\..*'),
          new RegExp('.*\.is-.*'),
          new RegExp('.*\.js.*'),
          new RegExp('.*\.picker.*'),
          new RegExp('.*\.contact.*'),
          new RegExp('.*\.owl.*'),]
    }))*/
    /*.pipe(autoprefixer({
			browsers: ['> 1%'],
		}))*/
    //.pipe(csso())
    .pipe(gulp.dest('./docs/css'));
});

// Concat main javascript
gulp.task('scripts', function() {
  return gulp.src(['./node_modules/foundation-sites/node_modules/jquery/dist/jquery.js',
      './node_modules/foundation-sites/node_modules/what-input/what-input.js',
      //'./node_modules/foundation-sites/dist/foundation.min.js',  // full js
      //'./node_modules/foundation-sites/dist/plugins/foundation.core.js',
      //'./node_modules/foundation-sites/dist/plugins/foundation.util.mediaQuery.js',
      //'./node_modules/foundation-sites/dist/plugins/foundation.magellan.js',
      //'./node_modules/foundation-sites/dist/plugins/foundation.abide.js',
      //'./node_modules/pickadate/lib/picker.js',
      //'./node_modules/pickadate/lib/picker.date.js',
      //'./src/js/owl.carousel.min.js',
      './src/js/heroesData.js',
      './src/js/app.js'])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));
 });

 // compress images
 gulp.task('images', () =>
	gulp.src('src/img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('public/img'))
);

// Watch task
gulp.task('watch', function() {
  gulp.watch('./src/scss/*',['styles'])
  gulp.watch('./src/js/app.js',['scripts'])
});
