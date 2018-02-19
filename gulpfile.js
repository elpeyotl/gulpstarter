const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const runSequence = require('run-sequence');

//run SASS compiler
gulp.task('sass', function () {
    return gulp.src('app/stylesheets/sass/styles.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 version'],
            grid: true
            }
         ))
        .pipe(gulp.dest('app/stylesheets/'))
        .pipe(browserSync.reload({
            stream: true
        }))
})

//watch for changes
gulp.task('watch', ['browserSync', 'sass'], function () {
    //watch for SASS files changes and compile
    gulp.watch('app/stylesheets/sass/**/*.scss', ['sass']);
    //watch for HTML changes and reload browser
    gulp.watch('app/*.html', browserSync.reload);
    //watch for JS changes and reload browser
    gulp.watch('app/js/*.js',browserSync.reload);
})

//run Browsersync for automatic reload on changes
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    })
})

//Minimizes JS and CSS Files
gulp.task('useref', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        // Minifies only if it's a JavaScript file
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest('dist'))
        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
})

//Minimizes Images
gulp.task('images', function(){
  return gulp.src('app/assets/images/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin()))
  .pipe(gulp.dest('dist/assets/images'))
});

//copy fonts to dist
gulp.task('fonts', function () {
    return gulp.src('app/assets/fonts/**/*')
        .pipe(gulp.dest('dist/assets/fonts'))
})

//clean dist folder
gulp.task('clean:dist', function () {
    return del.sync('dist');
})

//clear cache (used in miniziming images)
gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
})

// Build for production minimizes js and css and images
gulp.task('build', function (callback) {
    runSequence('clean:dist',
        ['useref', 'images', 'fonts'],
        callback
    )
})

//default task for development
gulp.task('default', function (callback) {
    runSequence(['sass','browserSync', 'watch'],
        callback
    )
})

