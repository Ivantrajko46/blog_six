const gulp = require('gulp');
const sass = require('gulp-sass');
const webserver = require('gulp-webserver');
const autoprefixer = require('gulp-autoprefixer');

// compile Sass with autoprefixer
gulp.task('sass', function(){

	gulp.src('./scss/main.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('./css'));
});
// Webserver
gulp.task('webserver', function(){
	return gulp.src('./')
		.pipe(webserver({
			port: '4000',
			livereload: true,
			open: true
		}));
});
//default task
gulp.task('default', ['sass','webserver']);
//watch
gulp.task('watch', function(){
	gulp.watch('./scss/*.scss', ['sass']);
});