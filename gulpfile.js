'use strict';

/////////////////////////////////////////////////////////////////////
// MASSIVE MONOLITH GULPFILE FOR THE LULZ ///////////////////////////
/////////////////////////////////////////////////////////////////////

let   gulp_process,
      servertag;
const fs                       = require('fs'),
      babelify                 = require('babelify'),
      browser_sync             = require('browser-sync').create(),
      browserify               = require('browserify'),
      spawn                    = require('child_process').spawn,
      del                      = require('del'),
      gulp                     = require('gulp'),
      gulp_concat              = require('gulp-concat'),
      gulp_cssnano             = require('gulp-cssnano'),
      gulp_favicons            = require('gulp-favicons'),
      gulp_htmlmin             = require('gulp-htmlmin'),
      gulp_if                  = require('gulp-if'),
      gulp_imagemin            = require('gulp-imagemin'),
      gulp_pug                 = require('gulp-pug'),
      gulp_plumber             = require('gulp-plumber'),
      gulp_postcss             = require('gulp-postcss'),
      gulp_prompt              = require('gulp-prompt'),
      gulp_rsync               = require('gulp-rsync'),
      gulp_sourcemaps          = require('gulp-sourcemaps'),
      gulp_uglify              = require('gulp-uglify'),
      gulp_uncss               = require('gulp-uncss'),
      gulp_util                = require('gulp-util'),
      lost                     = require('lost'),
      nlf                      = require('nlf'),
      argv                     = require('minimist')(process.argv),
      postcss_easy_import      = require('postcss-easy-import'),
      postcss_nested           = require('postcss-nested'),
      postcss_reporter         = require('postcss-reporter'),
      postcss_simple_vars      = require('postcss-simple-vars'),
      vinyl_buffer             = require('vinyl-buffer'),
      vinyl_source             = require('vinyl-source-stream');

const paths = {
  base: {
    root : '.',
    src  : 'src',
    build: 'build',
    tmp  : 'tmp'
  }
};

paths.src = {
  html    : `${paths.base.src}/assets/html`,
  js      : `${paths.base.src}/assets/js`,
  fonts   : `${paths.base.src}/assets/fonts`,
  css     : `${paths.base.src}/assets/css`,
  images  : `${paths.base.src}/assets/img`,
  favicons: `${paths.base.src}/assets/favicons`,
  data    : `${paths.base.src}/assets/data`
};

paths.build = {
  html    : `${paths.base.build}`,
  js      : `${paths.base.build}/assets/js`,
  fonts   : `${paths.base.build}/assets/fonts`,
  css     : `${paths.base.build}/assets/css`,
  images  : `${paths.base.build}/assets/img`,
  favicons: `${paths.base.build}`
};

/////////////////////////////////////////////////////////////////////
// ERROR HANDLING ///////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

// Overwrite default gulp.src with gulp-plumber applied on every call
let gulp_src = gulp.src;
gulp.src = function() { // don't bind this
  return gulp_src.apply(gulp, arguments).pipe(gulp_plumber((error) => {
    gulp_util.log(gulp_util.colors.red(`Error (${error.plugin}): ${error.message}`));
    this.emit('end');
  }));
};

process.on('SIGINT', () => {
  gulp_util.log(gulp_util.colors.red(`${process.pid} KILL (GULP) via SIGINT`));
  gulp_util.log(gulp_util.colors.yellow(`${process.uptime()} UPTIME`));
  process.exit();
});

process.on('uncaughtException', (err) => {
  gulp_util.beep();
  gulp_util.log(gulp_util.colors.red(`${process.pid} CRASH\n${err.stack}`));
});

/////////////////////////////////////////////////////////////////////
// WORKFLOW TASKS ///////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

gulp.task('clean', () => {
  return gulp_util.log(gulp_util.colors.yellow(`clean: Cleaned ${del.sync([ `${paths.base.build}/**`,`!${paths.base.build}`, `${paths.base.tmp}/**/*` ], { dot : true }).length} files`));
});

gulp.task('html', () => {
  return gulp.src([`${paths.src.html}/**/!(_)*.pug`])
    .pipe(gulp_pug())
    .pipe(gulp_htmlmin())
    .pipe(gulp.dest(paths.build.html));
});

gulp.task('css', ['html'], () => {
  const processors = [
        postcss_easy_import,
        postcss_simple_vars,
        postcss_nested,
        lost,
        postcss_reporter
        ];

  return gulp.src(`${paths.src.css}/main.css`)
    .pipe(gulp_sourcemaps.init())
    .pipe(gulp_postcss(processors))
    .pipe(argv.production ? gulp_uncss({ 
      html : [`${paths.build.html}/*.html`], // unCSS will crash if a path is empty
      }) : gulp_util.noop())
    .pipe(gulp_concat('master.css'))
    .pipe(argv.production ? gulp_cssnano() : gulp_util.noop())
    .pipe(gulp_sourcemaps.write('.'))
    .pipe(gulp.dest(paths.build.css));
});

gulp.task('fonts', () => {
  return gulp.src(`${paths.src.fonts}/**/*.{eot,ttf,woff,woff2}`)
    .pipe(gulp.dest(paths.build.fonts));
});

gulp.task('js', () => {

  gulp.src(`${paths.src.js}/vendor/*.js`)
    .pipe(gulp.dest(paths.build.js+'/vendor'));

  return browserify(`${paths.src.js}/main.js`)
    .transform(babelify)
    .bundle()
    .pipe(vinyl_source('main.js'))
    .pipe(vinyl_buffer())
    .pipe(gulp_sourcemaps.init({ loadMaps: true }))
    .pipe(gulp_uglify({ mangle: true }))
    .pipe(gulp_sourcemaps.write('sourcemaps'))
    .pipe(gulp.dest(paths.build.js));
});

gulp.task('images', () => {
  return gulp.src(`${paths.src.images}/**/*.{gif,jpg,png,svg}`)
    .pipe(argv.production ? gulp_imagemin() : gulp_util.noop())
    .pipe(gulp.dest(paths.build.images));
});

gulp.task('licenses', () => {
  if(argv.production) {
    try {
      nlf.find({ directory: '.' }, (err, data) => {
        let newData = {};
        data.forEach((item) => {
          let swap = {
            'Resource-URL': item.repository,
            'License': item.licenseSources.package.sources[0],
          }
          newData[item.id] = swap;
        });
        fs.writeFileSync(`${paths.base.root}/LICENSE_MANIFEST`, JSON.stringify(newData, null, 2));
      });
    } catch (err) {}
  }
  return gulp.src(`${paths.base.root}/{LICENSE,LICENSE_MANIFEST,LICENSE_WEBFONTS}`)
    .pipe(gulp.dest(`${paths.base.build}/_licenses/`));
});

gulp.task("favicons", () => {
  return gulp.src(`${paths.src.favicons}/*.{jpg,png,svg}`)
    .pipe(gulp_favicons({
      appName: "Brad Baris",
      appDescription: "Digital domain of Brad Baris",
      developerName: "Brad Baris",
      developerURL: "https://bradbaris.com/",
      background: "transparent",
      path: `${paths.build.favicons}`,
      url: "https://bradbaris.com/",
      version: 1.0,
      logging: false,
      online: false,
      replace: true
    }))
    .pipe(gulp.dest(paths.build.favicons));
});

gulp.task('watch', ['browsersync'], () => {
  gulp.watch(`${paths.src.html    }/**/*.pug`, ['html']);
  gulp.watch(`${paths.src.css     }/**/*.css`, ['css']);
  gulp.watch(`${paths.src.fonts   }/**/*.{eot,ttf,woff,woff2}`, ['fonts']);
  gulp.watch(`${paths.src.js      }/**/*.js`, ['js']);
  gulp.watch(`${paths.src.images  }/**/*.{gif,jpg,png,svg}`, ['images']);
  gulp.watch(`${paths.src.favicons}/**/*.{jpg,png,svg}`, ['favicons']);
});

// In hindsight, this is actually kinda stupid and pointless
/*
gulp.task('watch:gulp', ['watch', 'browsersync'], () => {
  gulp.watch('gulpfile.js', () => {
    if (gulp_process) { gulp_process.kill(); }
    browser_sync.pause();
    gulp_process = spawn('gulp', ['build'], { stdio: 'inherit' });
    gulp_util.log(gulp_util.colors.cyan(`${gulp_process.pid} SPAWN (CHILD)`));
    (argv.production) ? gulp_util.log(gulp_util.colors.green(`INHERITED ENV ARG ${process.argv[2]}`)) : gulp_util.noop();
    gulp_process.on('exit', () => {
      gulp_util.log(gulp_util.colors.cyan(`${gulp_process.pid} KILL (CHILD)`));
      browser_sync.resume();
    });
  });
});
*/

/////////////////////////////////////////////////////////////////////
// BROWSERSYNC SERVER ///////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

gulp.task('browsersync', ['build'], () => {
  argv.production ? servertag = 'PRODUCTION' : servertag = 'DEVELOP';

  return browser_sync.init({
    port: 8080,
    ui: { port: 3000 },
    files: [
      `${paths.build.html  }/**/*.*`,
      `${paths.build.js    }/**/*.*`,
      `${paths.build.fonts }/**/*.*`,
      `${paths.build.css   }/**/*.*`,
      `${paths.build.images}/**/*.*`
      ],
    injectChanges: true,
    watchOptions: { ignoreInitial: true },
    logPrefix: servertag,
    open: true,
    browser: ['google chrome'],
    server: { baseDir: paths.base.build }
  });
});

/////////////////////////////////////////////////////////////////////
// DEPLOY ///////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

// gulp deploy --staging      // rsync push to staging
// gulp deploy --production   // rsync push to production

gulp.task('deploy', () => {
  const rsync_paths = paths.base.build + '/';
  const rsync_conf = {
          progress        : true,
          incremental     : true,
          relative        : true,
          emptyDirectories: true,
          recursive       : true,
          clean           : true,
          exclude         : []
        };
  
  if (argv.staging) {
    rsync_conf.hostname    = process.env.STAGE_HOSTNAME;
    rsync_conf.username    = process.env.STAGE_USERNAME;
    rsync_conf.destination = process.env.STAGE_DESTINATION;

  } else if (argv.production) {
    rsync_conf.hostname    = process.env.PRODUCTION_HOSTNAME;
    rsync_conf.username    = process.env.PRODUCTION_USERNAME;
    rsync_conf.destination = process.env.PRODUCTION_DESTINATION;
    
  } else { 
    console.log('Deploy task requires --staging or --production flag, along with stage/prod env variables.');
    process.exitCode = 1;
    return process.exit(exitCode);
  }

  return gulp.src(rsync_paths)
    .pipe(gulp_if(
        argv.production, 
        gulp_prompt.confirm({
          message: 'WARNING: Confirm deploy to PRODUCTION?',
          default: false
        })
    ))
    .pipe(gulp_rsync(rsync_conf));
});

/////////////////////////////////////////////////////////////////////
// MAIN /////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

gulp.task('build', ['clean', 'favicons', 'html', 'fonts', 'js', 'images', 'css', 'licenses']);

gulp.task('default', ['build', 'browsersync', 'watch'], () => {
  gulp_util.log(gulp_util.colors.green(`${process.pid} SPAWN (GULP)`));
});

// gulp                       // build for development
// gulp --production          // build for production

// gulp deploy --staging      // rsync push to staging
// gulp deploy --production   // rsync push to production

