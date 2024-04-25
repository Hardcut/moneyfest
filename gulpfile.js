const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const pug = require("gulp-pug");
const replace = require("gulp-replace");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const svgSprite = require("gulp-svg-sprite");
const browserSync = require("browser-sync").create();
const del = require("del");
const concat = require("gulp-concat");
const sourcemaps = require("gulp-sourcemaps");
const realFavicon = require("gulp-real-favicon");
const faviconData = "faviconData.json";
const changed = require("gulp-changed");

let jsLibs = ["node_modules/swiper/swiper-bundle.min.js"];
let cssLibs = ["node_modules/swiper/swiper-bundle.min.css"];
let commonJsLibs = [
  "app/js/custom-libs/adaptive-height.js",
  "app/js/custom-libs/fade-toggle.js",
  "app/js/custom-libs/select.js",
];
function clean() {
  return del("dist");
}
function style() {
  return (
    gulp
      .src(cssLibs, { encoding: false })
      .pipe(sourcemaps.init())
      .pipe(concat("libs.css"))
      .pipe(gulp.dest("dist/css")),
    gulp
      .src("app/sass/style.scss", { encoding: false })
      .pipe(sourcemaps.init())
      .pipe(
        sass({ includePaths: ["app/blocks", "app/pages"] }).on(
          "error",
          sass.logError
        )
      )
      .pipe(
        autoprefixer(["last 15 versions", "> 1%"], {
          cascade: true,
        })
      )
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("dist/css"))
      .on("end", browserSync.reload)
  );
}
function html() {
  return gulp
    .src("app/pages/**/*.pug", { encoding: false })
    .pipe(
      pug({
        doctype: "html",
        pretty: true,
        basedir: "app",
        locals: {
          addClass: function (name, mods, addClass) {
            mods = mods || [];
            addClass = addClass || "";
            let value = "";

            mods.forEach(function (element) {
              value += " " + name + "_" + element;
            });

            return (value + " " + addClass).trim();
          },
        },
      })
    )
    .pipe(
      rename({
        dirname: "",
      })
    )
    .pipe(gulp.dest("dist/"))
    .on("end", browserSync.reload);
}
function fontsTransfer() {
  return gulp.src("app/fonts/**/*.*", { encoding: false }).pipe(gulp.dest("dist/fonts"));
}
function bundleJS() {
  return (
    gulp
      .src(jsLibs, { encoding: false })
      .pipe(concat("libs.js"))
      .pipe(gulp.dest("dist/js"))
      .on("end", browserSync.reload),
    gulp
      .src(["app/blocks/**/*.js", "app/pages/**/*.js", "app/js/main.js"], { encoding: false })
      .pipe(concat("scripts.js"))
      .pipe(gulp.dest("dist/js"))
      .on("end", browserSync.reload),
    gulp
      .src(commonJsLibs, { encoding: false })
      .pipe(concat("common.js"))
      .pipe(gulp.dest("dist/js"))
      .on("end", browserSync.reload)
  );
}
function faviconSvg() {
  return gulp
    .src("app/favicon.svg", { encoding: false })
    .pipe(gulp.dest("dist/"))
    .on("end", browserSync.reload);
}
function images() {
  return gulp
    .src("app/img/**/*.*", { encoding: false })
    .pipe(changed("dist/img"))
    .pipe(gulp.dest("dist/img"));
}
function icons() {
  return gulp
    .src("app/icons/single/*.svg", { encoding: false })
    .pipe(replace("&gt;", ">"))
    .pipe(rename({ prefix: "icon-" }))
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            dest: "",
            sprite: "icons.svg",
          },
        },
        svg: {
          namespaceClassnames: false,
          xmlDeclaration: false,
          doctypeDeclaration: false,
          namespaceIDs: false,
          dimensionAttributes: false,
        },
      })
    )
    .pipe(gulp.dest("app/icons/"));
}
function watch() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
  gulp.watch("app/**/*.scss", style);
  gulp.watch("app/**/**/*.pug", html);
  gulp.watch("app/img/**/*.{png,jpg,jpeg,gif,webp,svg}", gulp.series(images));
  gulp.watch("app/icons/single/*.svg", gulp.series(icons));
  gulp.watch(["app/**/**/*.js", "app/**/*.js"], gulp.series(bundleJS));
}

gulp.task("favicon", function (done) {
  realFavicon.generateFavicon(
    {
      masterPicture: "app/favicon.svg",
      dest: "dist/favicon",
      iconsPath: "./favicon",
      design: {
        ios: {
          pictureAspect: "noChange",
          assets: {
            ios6AndPriorIcons: false,
            ios7AndLaterIcons: false,
            precomposedIcons: false,
            declareOnlyDefaultIcon: true,
          },
        },
        desktopBrowser: {
          design: "raw",
        },
        windows: {
          pictureAspect: "noChange",
          backgroundColor: "#da532c",
          onConflict: "override",
          assets: {
            windows80Ie10Tile: false,
            windows10Ie11EdgeTiles: {
              small: false,
              medium: true,
              big: false,
              rectangle: false,
            },
          },
        },
        androidChrome: {
          pictureAspect: "noChange",
          themeColor: "#ffffff",
          manifest: {
            display: "standalone",
            orientation: "notSet",
            onConflict: "override",
            declared: true,
          },
          assets: {
            legacyIcon: false,
            lowResolutionIcons: false,
          },
        },
        safariPinnedTab: {
          pictureAspect: "blackAndWhite",
          threshold: 10,
          themeColor: "#510094",
        },
      },
      settings: {
        scalingAlgorithm: "Mitchell",
        errorOnImageTooSmall: false,
        readmeFile: false,
        htmlCodeFile: false,
        usePathAsIs: false,
      },
      markupFile: faviconData,
    },
    function () {
      done();
    }
  );
});

gulp.task(
  "build",
  gulp.series(
    clean,
    icons,
    style,
    images,
    fontsTransfer,
    faviconSvg,
    bundleJS,
    html,
    function (done) {
      done();
    }
  )
);

gulp.task("watch:dev", gulp.series("build", gulp.parallel(watch)));

exports.style = style;
exports.html = html;
exports.bundleJS = bundleJS;
exports.icons = icons;
exports.fontsTransfer = fontsTransfer;
exports.images = images;
exports.watch = watch;
exports.clean = clean;
