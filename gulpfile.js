var gulp         = require('gulp'),
	fileInclude  = require('gulp-file-include'),
	gulpConnect  = require('gulp-connect'),
	clean        = require('gulp-clean'),
	gulpRename 	 = require('gulp-rename'),
	gulpSequence = require('gulp-sequence'),
	gulpUglify	 = require('gulp-uglify'),
	sass         = require('gulp-ruby-sass'),
    cleanCSS     = require('gulp-clean-css');

var config = {    
    bowerDir: 'bower_components'
}

// Gabungkan HTML
gulp.task('build-html', function() {
    // Baca file HTML dari folder `pages`
    return gulp.src('src/pages/*.html')
        // Menggunakan plugin `gulp-file-include`
        .pipe(fileInclude())
        // Tulis HTML ke folder `dist`
        .pipe(gulp.dest('dist'));
});

// Compile Sass file
gulp.task('app-sass', () =>
    sass('src/scss/style.scss')
        .on('error', sass.logError)
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(cleanCSS({compatibility: 'ie8'})) // Minify CSS
        .pipe(gulpRename({suffix: '.min'})) // Rename
        .pipe(gulp.dest('dist/assets/css')) // Copy to directory
        .pipe(gulpConnect.reload())
);

// Get & Minify Js file
gulp.task('scripts', function() {
  gulp
    .src('src/js/*.js')
    .pipe(gulpUglify())
    .pipe(gulpRename({suffix: '.min'}))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(gulpConnect.reload());
});

// Get library
gulp.task('libs', function() {
    // JQuery
    gulp.src(config.bowerDir + '/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('./dist/assets/js'));
    
    // Bootsrap
    gulp.src(config.bowerDir + '/bootstrap/dist/fonts/**.*')
        .pipe(gulp.dest('./dist/assets/bootstrap/fonts'));
    gulp.src(config.bowerDir + '/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest('./dist/assets/bootstrap/css'));
    gulp.src(config.bowerDir + '/bootstrap/dist/js/bootstrap.min.js')
        .pipe(gulp.dest('./dist/assets/bootstrap/js'));
    
    // Font Awesome
    gulp.src(config.bowerDir + '/font-awesome/fonts/**.*')
        .pipe(gulp.dest('./dist/assets/font-awesome/fonts'));
    gulp.src(config.bowerDir + '/font-awesome/css/font-awesome.min.css')
        .pipe(gulp.dest('./dist/assets/font-awesome/css'));
});

// Get images
gulp.task('images', function() {
    gulp.src([
        'src/images/*.**',
        'src/images/*/*.**'
        ])
        .pipe(gulp.dest('./dist/assets/images'))
        .pipe(gulpConnect.reload());
});

// Jalankan server dan live reload
gulp.task('connect', function() {
	gulpConnect.server({
		root: './dist',
		livereload: true
	});
});

// Lakukan live reload apabila terjadi perubahan
gulp.task('html', function () {
	gulp.src('./dist/*.html')
	.pipe(gulpConnect.reload());
});

// Pantau file dalam folder production
gulp.task('watch', function () {
	gulp.watch(['src/pages/*.html'], ['build-html']);
	gulp.watch(['src/inc/*.html'], ['build-html']);
	gulp.watch(['src/scss/*.scss'], ['app-sass']);
    gulp.watch(['src/scss/*/*.scss'], ['app-sass']);
    gulp.watch(['dist/css/*.css'], ['app-sass']);
    gulp.watch(['src/js/*.js'], ['scripts']);
	gulp.watch(['dist/*.html'], ['html']);
    gulp.watch(['src/images/*.**'], ['images']);
    gulp.watch(['src/images/*/*.**'], ['images']);
});

// Lakukan semua tugas
gulp.task('build', [
    'connect',
    'watch',
    'build-html',
    'app-sass',
    'scripts',
    'libs',
    'images'
]);

gulp.task('default', [
	'connect',
	'watch',
	'build-html',
	'app-sass',
    'scripts',
]);