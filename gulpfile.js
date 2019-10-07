/**
 * MAIN GULPFILE CONFIGURATION
 * * Is using Sass, purgecss, notyf and rellax
 */
const gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	log = require('./logger'),
	cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	purgecss = require('gulp-purgecss');

////////////////////////
//* VENDORS VARIABLES //
////////////////////////
const $cssVendorsFolder = './public/css/vendors',
	$notyfCSS = './node_modules/notyf/notyf.min.css',
	$tailwind = './node_modules/tailwindcss/dist/tailwind.css',
	$cssVendors = [$tailwind, $notyfCSS],
	$cssAdminVendors = [$tailwind, $notyfCSS],
	$jsVendorsFolder = './public/js/vendors',
	$notyfJS = './node_modules/notyf/notyf.min.js',
	$jsVendors = [$notyfJS];

/////////////////////
//! Error Function //
/////////////////////
function displayError(error) {
	log(error.toString(), 'red');
	this.emit('end');
}

///////////
//* SaSS //
///////////
gulp.task('sass', () => {
	return gulp
		.src('./src/sass/main.scss')
		.pipe(sourcemaps.init())
		.pipe(
			sass({
				outputStyle: 'compressed'
			})
		)
		.on('error', displayError)
		.pipe(autoprefixer())
		.pipe(rename('main.min.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./public/css'))
		.on('end', () => {
			log('SaSS Compiled!', 'green');
		});
});

///////////////////////
//* CSS VENDORS MAIN //
///////////////////////
gulp.task('css-vendors-main', () => {
	return gulp
		.src($cssVendors, { base: './node_modules' })
		.pipe(concat('css-main-vendors.css'))
		.pipe(cleanCSS({ compatibility: 'ie10' }))
		.pipe(gulp.dest($cssVendorsFolder))
		.on('end', () => {
			log('Main Vendors (CSS) Concatenaded and Minified!', 'blue');
		});
});

////////////////////////
//* CSS VENDORS ADMIN //
////////////////////////
gulp.task('css-vendors-admin', () => {
	return gulp
		.src($cssAdminVendors, { base: './node_modules' })
		.pipe(concat('css-admin-vendors.css'))
		.pipe(cleanCSS({ compatibility: 'ie10' }))
		.pipe(gulp.dest($cssVendorsFolder))
		.on('end', () => {
			log('Admin Vendors (CSS) Concatenated and Minified!', 'blue');
		});
});

//////////////////////
//! PURGE EVERY CSS //
//////////////////////
gulp.task('purgecss', () => {
	return gulp
		.src('public/css/main.min.css', { base: './' })
		.pipe(
			purgecss({
				content: ['src/views/**/*.pug'],
				whitelist: [
					'no-scroll',
					'active',
					'hide-this',
					'custom-button-admin',
					'is-over',
					'is-over-black',
					'is-over-gray',
					'light',
					'is-input',
					'is-item',
					'remove-delay',
					'welcome',
					'loading',
					'animate-section',
					'codex-editor'
				]
			})
		)
		.pipe(gulp.dest('./'))
		.on('end', () => {
			log('CSS Purge done!', 'purple');
		});
});

/////////////////////
//* JS COMPILATION //
/////////////////////
gulp.task('js', () => {
	return gulp
		.src('./src/scripts/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel())
		.on('error', displayError)
		.pipe(concat('main.min.js'))
		.pipe(
			uglify({
				mangle: {
					eval: true
				}
			})
		)
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./public/js'))
		.on('end', () => {
			log('JS Compiled and Cocatenated!', 'yellow');
		});
});

/////////////////
//* JS VENDORS //
/////////////////
gulp.task('js-vendors', () => {
	return gulp
		.src($jsVendors)
		.pipe(concat('vendors.min.js'))
		.pipe(gulp.dest($jsVendorsFolder))
		.on('end', () => {
			log('JS Vendors Concatenated!', 'yellow');
		});
});

///////////////
//* WATCHERS //
///////////////
gulp.task('watchers', done => {
	log('Watchers Running!', 'yellow');
	gulp.watch('./src/sass/**/*.scss', gulp.series('sass', 'purgecss'));
	gulp.watch('./src/scripts/**/*.js', gulp.series('js'));
	done();
});

////////////////
//* MAIN TASK //
////////////////
gulp.task(
	'dev',
	gulp.series(
		'sass',
		'css-vendors-main',
		'css-vendors-admin',
		'purgecss',
		'js',
		'js-vendors',
		gulp.parallel('watchers')
	)
);
