// 安装依赖
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync');
// 设置任务---架设静态服务器
gulp.task('browser-sync', function () {
    browserSync.init({
        files: ['**'],
        server: {
            baseDir: './',  // 设置服务器的根目录
            index: 'index.html' // 指定默认打开的文件
        },
        port: 8080  // 指定访问服务器的端口号
    });
});
gulp.task('sass', function () {
    return gulp.src('sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('css'));
});
gulp.task('sass:watch', function () {
    gulp.watch('sass/**/*.scss', ['sass']);
});