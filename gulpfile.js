/**
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var livereload = require('gulp-livereload');
var pagespeed = require('psi');
var reload = browserSync.reload;
var reload_page = livereload.changed;
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var compass = require('gulp-compass');


// Lint JavaScript
gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
});

// Optimize Images
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}));
});


gulp.task('styles:copy_dev', function() {
  return gulp.src(['.tmp/styles/main.css'])
    .pipe(gulp.dest('statamic/_themes/main/css'))
    .pipe($.size({title: 'copy'}));
});

gulp.task('styles:copy_live', function() {
  return gulp.src(['.tmp/styles/main.css'])
    .pipe(gulp.dest('statamic/_themes/main/css'))
    .pipe($.size({title: 'copy'}));
});

// Automatically Prefix CSS
gulp.task('styles:css_prefix', function () {
  return gulp.src('.tmp/styles/*.css')
    .pipe($.autoprefixer('last 2 version'))
    .pipe(gulp.dest('.tmp/styles/prefix'))
    .pipe($.size({title: 'styles:css'}));
});

// Compile Sass For Style Guide Components (app/styles/components)
gulp.task('styles:components', function () {
  return gulp.src('app/styles/components/main.scss')
    .pipe($.rubySass({
      style: 'expanded',
      precision: 10,
      loadPath: ['app/styles/components']
    }))
    .on('error', function (err) {
      console.log(err);
    })
    // .pipe($.autoprefixer('last 2 version'))
    // .pipe(gulp.dest('statamic/_themes/main/css'))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.size({title: 'styles:components'}));
});

// Compile Sass For Style Guide Components (app/styles/components)
gulp.task('styles:dev', function () {
  return gulp.src('app/styles/components/main.scss')
    .pipe($.rubySass({
      style: 'expanded',
      precision: 10,
      loadPath: ['app/styles/components']
    }))
    .on('error', function (err) {
      console.log(err);
    })
    // .pipe($.autoprefixer('last 2 version'))
    // .pipe(gulp.dest('statamic/_themes/main/css'))
    .pipe(gulp.dest('statamic/_themes/main/css'))
    .pipe($.size({title: 'styles:components'}))
    .pipe(livereload());
});

// Output Final CSS Styles
gulp.task('styles', ['styles:components', 'styles:css_prefix', 'styles:copy_live', 'minify']);



// Concatenate Javascript
gulp.task('scripts', function() {
  gulp.src(['app/scripts/*.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('statamic/_themes/main/js/build'))
});

// Minify Javascript
gulp.task('compress', function() {
  gulp.src(['statamic/_themes/main/js/build/*.js'])
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('statamic/_themes/main/js/'))
});

gulp.task('scripts_non_cat', function() {
  return gulp.src(['app/scripts/non_cat/*.js'])
    .pipe(gulp.dest('statamic/_themes/main/js/build'))
    .pipe($.size({title: 'copy'}));
});

gulp.task('scripts_availability-geojson', function() {
  return gulp.src(['app/scripts/non_cat/availability-geojson.js'])
    .pipe(gulp.dest('statamic/_themes/main/js'))
    .pipe($.size({title: 'copy'}));
});

// Concatenate and Minify Styles
gulp.task('minify', function() {
    return gulp.src('.tmp/styles/prefix/*.css')
        .pipe(rename({suffix: '.min'}))
        .pipe(csso())
        .pipe(gulp.dest('statamic/_themes/main/css'))
        .pipe(livereload());
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function () {
  return gulp.src('app/**/*.html')
    .pipe($.useref.assets({searchPath: '{.tmp,app}'}))
    // Concatenate And Minify JavaScript
    .pipe($.if('*.js', $.uglify({preserveComments: 'some'})))
    // Concatenate And Minify Styles
    .pipe($.if('*.css', $.csso()))
    // Remove Any Unused CSS
    // Note: If not using the Style Guide, you can delete it from
    // the next line to only include styles your project uses.
    .pipe($.if('*.css', $.uncss({
      html: [
        'app/index.html',
        'app/styleguide/index.html'
      ],
      // CSS Selectors for UnCSS to ignore
      ignore: [
        '.navdrawer-container.open',
        /.app-bar.open/
      ]
    })))
    .pipe($.useref.restore())
    .pipe($.useref())
    // Update Production Style Guide Paths
    .pipe($.replace('components/components.css', 'components/main.min.css'))
    // Minify Any HTML
    .pipe($.minifyHtml())
    // Output Files
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
});



// Clean Output Directory
gulp.task('clean', del.bind(null, ['.tmp', 'statamic/_themes/main/css/','statamic/_themes/main/js/']));

// Watch Files For Changes & Reload
gulp.task('serve', function() {
  livereload.listen();
  gulp.watch(['statamic/**/*.html'], reload_page);
  gulp.watch(['statamic/**/*.js'], ['scripts','compress', reload_page]);
  gulp.watch(['app/styles/**/*.scss','bower_components/**/*.scss'], ['styles', reload_page]);
  gulp.watch(['app/scripts/**/*.js'], ['scripts', reload_page]);
  gulp.watch(['app/images/**/*','statamic/_themes/main/img/**/*'], reload_page);
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(['statamic/**/*.html'], reload_page);
  gulp.watch(['statamic/**/*.js'], ['scripts','compress', reload_page]);
  gulp.watch(['app/styles/**/*.scss','bower_components/**/*.scss'], ['styles:dev', reload_page]);
  gulp.watch(['app/scripts/**/*.js'], ['scripts', reload_page]);
  gulp.watch(['app/images/**/*','statamic/_themes/main/img/**/*'], reload_page);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function () {
  browserSync({
    notify: false,
    server: {
      baseDir: 'dist'
    }
  });
});

// Build Production Files
gulp.task('build', function (cb) {
    runSequence(['styles','scripts','scripts_non_cat'],['compress','minify'], cb);
});

// Run PageSpeed Insights
// Update `url` below to the public URL for your site
gulp.task('pagespeed', pagespeed.bind(null, {
  // By default, we use the PageSpeed Insights
  // free (no API key) tier. You can use a Google
  // Developer API key if you have one. See
  // http://goo.gl/RkN0vE for info key: 'YOUR_API_KEY'
  url: 'https://example.com',
  strategy: 'mobile'
}));

// Load custom tasks from the `tasks` directory
try { require('require-dir')('tasks'); } catch (err) {}
