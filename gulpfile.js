const gulp        = require('gulp'),
			rename      = require('gulp-rename'),
			del         = require('del'),
			uglify      = require('gulp-terser'),
			browserSync = require('browser-sync').create();

const PATHS = {
	HTML: {
		SRC: './*.html',
		DEST: '.'
	},
	JS: {
		SRC: './js/**/*.js',
		DEST: './js'
	},
	ASSETS: './assets/*.*',
	MIN: './js/*.min.js',
}

const reload = () => {
	browserSync.reload();
}

const minifyjs = () => {
	return gulp
		.src([PATHS.JS.SRC])
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest([PATHS.JS.DEST]));
}

const clean = () => {
	return del([PATHS.MIN], {
		allowEmpty: true
	});
}

const watch = () => {
	browserSync.init({
		server: {
			baseDir: '.',
			open: false
		}
	});

	gulp.watch([PATHS.HTML.SRC, PATHS.JS.SRC, PATHS.ASSETS], gulp.series(minifyjs, reload));
}

const build = gulp.series(clean, minifyjs);

const serve = gulp.series(build, watch);

exports.watch = watch;
exports.clean = clean;
exports.build = build;
exports.serve = serve;