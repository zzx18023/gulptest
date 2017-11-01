var src = 'src/',
	destDir = 'dist/';

var gulp = require('gulp');

var uglify = require("gulp-uglify"); //压缩js
var minifyCss = require("gulp-minify-css"); //压缩css
var less = require("gulp-less"); //编译less
var sass = require("gulp-sass"); //编译sass
var minifyHtml = require("gulp-minify-html"); //压缩html
var imagemin = require('gulp-imagemin'); //压缩图片
var rev = require('gulp-rev'); //生成md5版本
var revCollector = require('gulp-rev-collector'); //替换md5版本
var clean = require('gulp-clean'); //删除文件

gulp.task('clean', function() {
	return gulp.src([destDir, 'rev'])
		.pipe(clean())
});

gulp.task('img', ['clean'], function() {
	return gulp.src(src + '**/*.{png,jpg,gif}')
		.pipe(imagemin())
		.pipe(rev())
		.pipe(gulp.dest(destDir))
		.pipe(rev.manifest())
		.pipe(gulp.dest('rev/img'));
});

gulp.task('less', ['img'], function() {
	return gulp.src(['rev/img/rev-manifest.json', src + '**/*.less', '!' + src + '**/_*.less', '!' + src + '**/_*/**/*.less'])
		.pipe(revCollector())
		.pipe(less())
		.pipe(minifyCss())
		.pipe(rev())
		.pipe(gulp.dest(destDir))
		.pipe(rev.manifest())
		.pipe(gulp.dest('rev/less'));
});

gulp.task('sass', ['img'], function() {
	return gulp.src(['rev/img/rev-manifest.json', src + '**/*.{sass,scss}', '!' + src + '**/_*.{sass,scss}', '!' + src + '**/_*/**/*.{sass,scss}'])
		.pipe(revCollector())
		.pipe(sass())
		.pipe(minifyCss())
		.pipe(rev())
		.pipe(gulp.dest(destDir))
		.pipe(rev.manifest())
		.pipe(gulp.dest('rev/sass'));
});

gulp.task('css', ['img'], function() {
	return gulp.src(['rev/img/rev-manifest.json', src + '**/*.css'])
		.pipe(revCollector())
		.pipe(minifyCss())
		.pipe(rev())
		.pipe(gulp.dest(destDir))
		.pipe(rev.manifest())
		.pipe(gulp.dest('rev/css'));
});

gulp.task('js', ['img'], function() {
	return gulp.src(['rev/img/rev-manifest.json', src + '**/*.js'])
		.pipe(revCollector())
		.pipe(uglify({
			mangle: false
		}))
		.pipe(rev())
		.pipe(gulp.dest(destDir))
		.pipe(rev.manifest())
		.pipe(gulp.dest('rev/js'));
});

gulp.task('html', ['clean', 'img', 'sass', 'less', 'css', 'js'], function() {
	return gulp.src(['rev/**/rev-manifest.json', src + '**/*.html'])
		.pipe(revCollector())
		.pipe(minifyHtml())
		.pipe(gulp.dest(destDir));
});