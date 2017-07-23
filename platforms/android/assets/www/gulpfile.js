var gulp = require('gulp');
var sass = require('gulp-sass');
var minify = require('gulp-minify');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');

// Minify JS
gulp.task('minify', function(){
  gulp.src('js/*.js')
    // Inject new JS into the live-reload server
    .pipe(browserSync.stream());
});

// Compile sass
gulp.task('sass', function(){
  gulp.src('sass/*.sass')
    .pipe(sass({}))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('css'))
    // And send on new CSS to the live-reload server
    .pipe(browserSync.stream());
})

// Start local server
gulp.task('serve', function(){
  return browserSync({
    server: {
      baseDir: './',
    }
  });
});

// MAIN WATCH TASK
gulp.task('default', ['sass', 'serve'], function() {
  // Now watch for changes
  // When a sass or js file is changed, compile it
  gulp.watch("sass/*.sass", ['sass']);
  gulp.watch("js/*.js", ['minify']);
  // When a html file is updated, update the browser
  gulp.watch("index.html", [browserSync.reload]);
});
