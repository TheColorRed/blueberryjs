const gulp = require('gulp');
const ts = require('gulp-typescript');
const uglify = require('gulp-uglify');
const pug = require('pug');
const fs = require('fs');
const mkdirp = require('mkdirp');

const paths = {
    tswatch: ['src/**/*.ts', 'tsconfig.json'],
    docwatch: ['docs/**/*.pug']
};

const pugFiles = [
    'index',
    'examples/clock',
    'examples/timer',
    'examples/observe',
    'examples/ajax',
    'api/js/ajax',
    'api/js/component',
    'api/js/blueberry',
    'api/js/blueberry-object',
    'api/html/component',
];

gulp.task('typescript', () => {
    // Create typescript project
    let tsProject = ts.createProject('tsconfig.json');
    let tsResult = tsProject.src().pipe(tsProject());
    // Save typescript to javascript
    // Compile non es6 project
    if (require('./tsconfig.json').compilerOptions.target != 'es6') {
        return tsResult.js.pipe(uglify({ mangle: true })).pipe(gulp.dest('./')).on('finish', function () {
            fs.createReadStream('./dist/blueberry.js').pipe(fs.createWriteStream('./public/assets/js/blueberry.js'));
        });
    }
    // Compile es6 project
    else {
        return tsResult.js.pipe(gulp.dest('./'));
    }
});

gulp.task('docs', () => {
    pugFiles.forEach(file => {
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
    fs.createReadStream('./dist/blueberry.js').pipe(fs.createWriteStream('./public/assets/js/blueberry.js'));
});

gulp.task('build', ['typescript', 'docs'], () => {
    gulp.watch(paths.tswatch, ['typescript']);
    gulp.watch(paths.docwatch, ['docs']);
});