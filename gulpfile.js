const gulp = require('gulp');
const ts = require('gulp-typescript');
const uglify = require('gulp-uglify');
const flatten = require('gulp-flatten');
const pug = require('pug');
const fs = require('fs');
const mkdirp = require('mkdirp');
const glob = require('glob');
const rimraf = require('rimraf');
const ncp = require('ncp');
const path = require('path');

const paths = {
    blueberrywatch: ['src/blueberry/**/*.ts', 'src/blueberry/tsconfig.json'],
    componentwatch: ['src/components/**/*.ts', 'src/components/tsconfig.json'],
    docwatch: ['docs/**/*.pug'],
    docwatch: ['src/addons/dom/**/*.ts', 'src/addons/dom/tsconfig.json'],
    canvaswatch: ['src/addons/canvas/**/*.ts', 'src/addons/canvas/tsconfig.json']
};

const projects = {
    blueberry: './src/blueberry/tsconfig.json',
    dom: './src/addons/dom/tsconfig.json',
    canvas: './src/addons/canvas/tsconfig.json',
    components: './src/components/tsconfig.json'
};

const pugFiles = [
    'index',
    'examples/clock',
    'examples/timer',
    'examples/stopwatch',
    'examples/observe',
    'examples/ajax',
    'api/js/ajax',
    'api/js/component',
    'api/js/blueberry',
    'api/js/blueberry-object',
    'api/html/component',
];

gulp.task('blueberry', () => {
    makeProject(projects.blueberry);
});

gulp.task('components', () => {
    makeProject(projects.components);
});

gulp.task('dom', () => {
    makeProject(projects.dom);
});

gulp.task('canvas', () => {
    makeProject(projects.canvas);
});

gulp.task('docs', () => {
    rimraf('public/api', err => {
        rimraf('public/examples', err => {
            glob('docs/+(api|examples)/**/*.pug', (err, files) => {
                files.push('docs/index.pug');
                files.push('docs/getting-started.pug');
                files.forEach(file => {
                    file = file.replace(/^docs\//, '').replace(/\.pug$/, '');
                    let lastSlash = file.lastIndexOf('/');
                    mkdirp('public/' + file.substr(0, lastSlash), (err) => {
                        try {
                            let html = pug.renderFile('docs/' + file + '.pug', {
                                file: file,
                                rootdir: file.substr(0, lastSlash)
                            });
                            fs.writeFileSync('public/' + file + '.html', html);
                        } catch (e) {
                            console.log(e.message);
                        }
                    });
                });
            });
        });
    });
    // fs.createReadStream('./dist/blueberry.js').pipe(fs.createWriteStream('./public/assets/js/blueberry.js'));
});

function makeProject(projectPath) {
    // Create typescript project
    let tsProject = ts.createProject(projectPath);
    let tsResult = tsProject.src().pipe(tsProject());
    // Save typescript to javascript
    // Compile non es6 project
    tsResult.dts.pipe(flatten()).pipe(gulp.dest(path.join(__dirname, './dist/typings')));
    let projectConfig = require(projectPath);
    delete require.cache[require.resolve(projectPath)];
    let baseName = path.parse(projectConfig.compilerOptions.outFile).base;
    if (projectConfig.compilerOptions.target != 'es6') {
        return tsResult.js.pipe(uglify({ mangle: false })).pipe(gulp.dest('./')).on('finish', function () {
            fs.createReadStream(`./dist/${baseName}`).pipe(fs.createWriteStream(`./public/assets/js/${baseName}`));
        });
    }
    // Compile es6 project
    else {
        return tsResult.js.pipe(gulp.dest('./')).on('finish', function () {
            fs.createReadStream(`./dist/${baseName}`).pipe(fs.createWriteStream(`./public/assets/js/${baseName}`));
        });
    }
}

gulp.task('init', ['blueberry'], () => {
    gulp.start(['components', 'docs', 'dom', 'canvas']);
});

gulp.task('build', ['init'], () => {
    gulp.watch(paths.blueberrywatch, ['blueberry']);
    gulp.watch(paths.componentwatch, ['components']);
    gulp.watch(paths.domwatch, ['dom']);
    gulp.watch(paths.canvaswatch, ['canvas']);
    gulp.watch(paths.docwatch, ['docs']);
});