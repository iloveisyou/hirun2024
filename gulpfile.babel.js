const { src, dest, task, watch, series, parallel, lastRun } = require('gulp');
const babel = require('gulp-babel'); // js 호환
const uglify = require('gulp-uglify'); // 코드 최소화 및 난독화
const sass = require('gulp-dart-sass'); // sass 컴파일 기본 패키지, dark-sass 가 더 최신
const fs = require('fs'); // 파일 관리 패키지(파일 생성,삭제, 읽기,,쓰기 등)
const del = require('del'); // 파일 및 폴더 삭제, del@6.0.0
const path = require('path'); // 파일과 디렉터리의 경로를 추출하는 모듈
const rename = require('gulp-rename'); // 파일 이름 변경
const plumber = require('gulp-plumber'); // gulp 종료 방지 및 에러 핸들링, 스트림을 파이프로 연결해 빌드를 수행하기때문에, 에러발생시 error.log 출력 후 end 이벤트 발생시켜 현재 스트림 종류
const cached = require('gulp-cached'); // 파일을 캐시로 저장한 다음, 수정된 파일만 감지하여 빌드 (원래 걸프는 하나 바뀌어도 모든 파일 다바꿈)
const data = require('gulp-data'); // json, front-matter, 데이터베이스 등 다양한 소스의 데이터를 pipe에 직접 삽입하여 데이터가 적용되도록 함
const sourcemaps = require('gulp-sourcemaps'); // 개발 모드에서 scss 디버깅을 위한 패키지
const nunjucksRender = require('gulp-nunjucks-render'); // nunjucks (.njk), html을 편집 위한 메인 페키지
const webserver = require('gulp-webserver'); // 서버 띄우기 위한 패키지
const browserSync = require('browser-sync').create(); // 서버 띄우기 위한 패키지
const connect = require('gulp-connect'); // 서버 띄우기 위한 패키지, 수정 후 자동 새로고침안됨?
// img
const imagemin = require('gulp-imagemin'); // 이미지 최적화를 위한 패키지, @7.1.0
const newer = require('gulp-newer'); // 변경된 파일만 파이프라인 통과, 변경되지 않은 파일은 건너뛰기
const image = require('gulp-image'); // @6.2.1
// // css
const dependents = require('gulp-dependents'); // 종속된 css 파일 감지, @import
const gulpFont = require('gulp-font'); // font 관련
// js
const bro = require('gulp-bro'); // browserify로 gulp에서 보다 쉽게 코드를 변환할 수 있게 해줌
const babelify = require('babelify'); // ES6 이상의 문법을 일반 브라우저가 코드를 이해할 수 있도록 컴파일
const uglifyify = require('uglifyify'); // 코드 최소화 및 난독화
const minify = require('gulp-minify'); // min파일로 압축
// 배포
const ghPages = require('gulp-gh-pages'); // 자동배포


// routes --------------------------------------------------------------------------------------------
const sr = './src';
const di = './dist';
const as = '/assets';
const paths = { // src.html만 함수에서 경로 추가 제어
    src:  { html: sr + '/html', css: sr + as + '/css', img: sr + as + '/images/**/*', js: sr + as + '/js', font: sr + as + '/fonts', },
    dist: { html: di + '/html', css: di + as + '/css', img: di + as + '/images', js: di + as + '/js', font: di + as + '/fonts', },
}


// task --------------------------------------------------------------------------------------------
const onErrorHandler = (error) => console.log(error); // plumber option (에러 발생시 에러 로그 출력)
function clean() { 
    return del([di]);
}
function cleanDeploy() {
    del(['apply.publish']);
}

async function html() {
    // 들여쓰기(Tab Indent) 조정을 위한 함수
    const manageEnvironment = (environment) => {
        environment.addFilter('tabIndent', (str, numOfIndents, firstLine) => {
        str = str.replace(/^(?=.)/gm, new Array(numOfIndents + 1).join('    '));
        if(!firstLine) {
            str = str.replace(/^\s+/, "");
        }
        return str;
        });
    };

    // _gnb.json 파일 적용을 위한 변수
    const gnbJson = {...JSON.parse(fs.readFileSync(di + as + '/json/gnb.json'))};
    const datafile = () => {
        return gnbJson;
    }

    return src([
        paths.src.html + '/**/*', // 빌드할 njk 파일 경로
        '!' + paths.src.html + '/**/_*', // 경로 중 제외할 njk 파일
        '!' + paths.src.html + '/**/_*/**/*', // 경로 중 제외할 폴더 및 폴더의 njk 파일
    ], {sourcemaps: true})
    .pipe(plumber({errorHandler:onErrorHandler})) // 빌드할 njk 파일 경로
    .pipe(data(datafile)) // _gnb.json 적용
    .pipe( nunjucksRender({ // njk 적용
        envOptions: { // njk 옵션 설정
        autoescape: false, // njk 문법의 오류가 있더라도 진행
        },
        manageEnv: manageEnvironment, // 들여쓰기(Tab Indent) 함수 적용
        path: [paths.src.html], // html 폴더 경로
    }))
    .pipe(cached('html')) // 변경된 파일 캐시 저장
    .pipe(dest(paths.dist.html)) // 빌드 후 html 파일이 생성될 목적지 설정
    .pipe(connect.reload())

}

function js() {
    return src([
        paths.src.js + '/**/*.js', 
        '!' + paths.src.js + '/lib/**/*', 
    ]) 
    .pipe(sourcemaps.init({loadMaps: true})) // 소스맵 초기화
    .pipe( bro({transform: [ // 트랜스파일 시작
        babelify.configure({ presets: ["@babel/preset-env"] }), // ES6 이상의 문법을 일반 브라우저가 코드를 이해 할 수 있도록 변환
        ["uglifyify", { global: true }], // 코드 최소화 및 난독화
    ]}))
    .pipe(sourcemaps.write('./')) // 소스맵 작성
    .pipe(minify({ // 트랜스파일된 코드 압축 및 min 파일 생성
        ext: {min: '.min.js'}, // 축소된 파일을 출력하는 파일 이름의 접미사 설정
        iignoreFiles: ['-min.js'] //해당 파일과  일치하는 파일들은 축소하지 않음
    }))
    .pipe(dest(paths.dist.js))
}

function css() {
    return src([
        paths.src.css + '/**/*',
    ], {sourcemaps: true, since: lastRun(css)})
    .pipe(plumber({errorHandler: onErrorHandler})) // 에러 발생시 gulp 종료 방지 및 에러 핸들링
    .pipe(dependents())  // 현재 스트립에 있는 파일에 종속되는 모든 파일을 추가 (import)
    .pipe(sass({
        outputStyle: 'compressed', // css 컴파일 결과 코드스타일 지정 / nested(default), expanded, compact, compressed
        indentType: 'space', // css 들여쓰기 타입 / space(default), tab,
        indentWidth: 4, // csss 들여쓰기 갯수 / 2(default)
        precision: 6, // css의 소수점 자리수, 6(default)
        soureComments: true, // css 원본 소스의 위치와 줄수 주석표시 / false(default), true
        silenceDeprecations: ['legacy-js-api'], // legacy 경고 제거
    }))
    .pipe(dest(paths.dist.css))
}

function img() {
    return src(paths.src.img, {encoding: false, since: lastRun(img)})
    .pipe(newer(paths.dist.img)) // 변경된 파일만 통과, 변경되지 않는 파일 건너뛰기
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}), // gif 무손실
        imagemin.mozjpeg({quality: 95, progressive: true}), // jpeg 손실
        imagemin.optipng({optimizationLevel: 7}), // png 무손실 0-7
        imagemin.svgo({ // svg 무손실
            plugins: [ { name: 'removeViewBox', active: true }, { name: 'cleanupIDs', active: false } ]
        })
    ])) // 이미지 최적화
    .pipe(dest(paths.dist.img))
}

function lib() {
    return src(paths.src.js +'/lib/**/*')
    .pipe(dest(paths.dist.js + '/lib/'))
}

function font() {
    return src(paths.src.font +'/**/*', { encoding: false })
    .pipe(dest(paths.dist.font))
}

function datas() {
    return src(sr + as + '/json/**/*')
    .pipe(dest(di + as + '/json'))
}

function watcher() {
    watch(paths.src.html, html);
    watch(paths.src.js, js);
    watch(paths.src.css, css);
    watch(paths.src.img, img);
    watch(sr + as + '/json', datas);
}
function file(watcher_target, src_path, dist_path) {
    watcher_target.on('unlink',(filePath) => {
        const filePathFromSrc = path.relative(path.resolve(src_path), filePath); // 첫번째 경로에서 두번째 경로로 가는 방법을 알려줌, 절대경로로 경로를 합쳐줌
        const type = filePathFromSrc.split('.')[filePathFromSrc.split('.').length-1];

        if(type === 'scss') { // scss 삭제 (min 파일까지 삭제)
            const destFilePath_css = path.resolve(dist_path, filePathFromSrc).replace('.scss', '.css');
            del.sync(destFilePath_css);
            const destFilePath_minCss = path.resolve(dist_path, filePathFromSrc).replace('.scss', '.min.css');
            del.sync(destFilePath_minCss);
        } else if(type === 'js') { // js 삭제 (main 파일까지 삭제)
            const destFilePath_js = path.resolve(dist_path, filePathFromSrc);
            del.sync(destFilePath_js);
            const destFilePath_minJs = path.resolve(dist_path, filePathFromSrc).replace('.js', '.min.js');
            del.sync(destFilePath_minJs);
        } else if(type === 'html') { // njk(html) 삭제
            const destFilePath_html = path.resolve(dist_path, filePathFromSrc).replace('.njk', 'html');
            del.sync(destFilePath_html);
        } else { // 위 파일 외 삭제
            const destFilePath = path.resolve(dist_path, filePathFromSrc);
            del.sync(destFilePath);
        }
    })
}

function server() {
    return src(di)
    .pipe(webserver({ 
        host: 'localhost', // 호스트
        port: 8000, // 기본 8000 port, 필요시 변경 가능
        livereload: true, // 작업 중 파일 저장 시 브라우저 자동 새로고침 / false(default), ture
        open: '/html/index.html', // gulp 실행 시 자동으로 브라우저 띄우고, localhost 서버열기 / fault(default), true
        directoryListing: {enable: true, path: di }, // 탐색기같이 보여줌
    }))
}

function gh() {
    return src(di + '/**/*') 
    .pipe(ghPages( // 깃 저장소에 배포
        {branch: 'view-pages'} // 옵션 설정하지 않으면 자동으로 gh-pages 브랜치를 생성하고 배포, 브랜치명 변경시 사용
    ))
}

const options = parallel(datas, lib, font);
export const build = series(clean, datas, parallel(html, img), parallel(js, css), options);
export const deploy = series([gh, cleanDeploy]);
exports.default = series(build, parallel(server, watcher));

