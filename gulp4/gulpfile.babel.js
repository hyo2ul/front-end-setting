// gulpfile.babel.js
import gulp from 'gulp';
import DIR, { PATH } from './Dir';
import del from 'del';

import Cache from 'gulp-file-cache';
import sass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import webpack from "gulp-webpack";
import fs from "fs";


const cache = new Cache();
const browsersync = require('browser-sync').create();

let clean = () => {
	console.log('clean in');
	return new Promise(resolve => {
		del.sync(PATH.DIR.DEST);
		resolve();
	});
}

let js = () => {
	console.log('js in');
	return new Promise( resolve => {

		function webpackFunc (evt){
			let path = evt.path;
			let jsName = path.substr(path.lastIndexOf('\\') + 1, path.length);

			// 임포트 했던 weback을 세팅합니다.
			webpack({
				entry: {
					entryName: `${__dirname}/html/js/${jsName}` // 파일 경로를 설정합니다.
				},
				output: {
					filename: jsName // 만들어질 파일명을 설정합니다.
				},
				module: { // 모둘 세팅
					// 이곳에서 사용되는 모듈 과 플러그인들은 이전 포스팅에서모두 설치한 모듈들입니다.
					// 이모듈들은 ES 6 ~ 7 그리고 그 이상의 기술들을 사용하였을때 바벨이 오류를 뱉어내어 컴파일에
					// 실패하지 않기 위해 필요한 모듈들 모음입니다.
					loaders: [
						{
							test: /\.js$/,
							loader: 'babel-loader', // 바벨로더를 사용합니다.
							exclude: '/node_modules/',
							query: {
								cacheDirectory: true,
								"presets": ['es2015', 'es2017', 'stage-3', 'react'], // 사용할 프리셋들
								// 프리셋 관련 정보는 https://babeljs.io/docs/en 에서 확인하실 수 있습니다.
								"plugins": [
									'transform-decorators-legacy',
									'transform-class-properties',
									'transform-async-to-generator',
									'transform-object-assign',
									'transform-regenerator',
									["transform-runtime", {
										"helpers": false, // defaults to true
										"polyfill": false, // defaults to true
										"regenerator": true, // defaults to true
										"moduleName": "babel-runtime" // defaults to "babel-runtime"
									}]
								],
							}
						}
					]
				}
			}).pipe(gulp.dest(PATH.DEST.JS)); // 컴파일이 끝난 파일을 지정된 폴더에 생성합니다.
			// PATH.DEST.JS 경로는 html_build/js 로 지정되어있습니다.
		}

		// fs를 활용하여 정해진 디렉토리를 검색하게한다.
		fs.readdir(`${PATH.DIR.SRC}/js/`, (err, files) => {
			// 전달받은 배열을 forEach문을 통해 단일객체에 접근한다.
			files.forEach( file => {
				console.log('-file : ' , file);
				let evt = { path: `${__dirname}\\${PATH.DIR.SRC}\\js\\${file}` };
				webpackFunc(evt);
			});
		})
		resolve();
	})
}

gulp.task('css:sass', () => {
	console.log('sass in');
	return new Promise(resolve => {
		gulp.src(`${PATH.DIR.SRC}/scss/*.scss`)
			.pipe(cache.filter())
			.pipe(sass())
			.pipe(cache.cache())
			.pipe(gulp.dest(`${PATH.DIR.SRC}/css`))
			.pipe(browsersync.reload({ stream: true }));
		resolve();
	});
});

gulp.task('css:css', () => {
	console.log('css in');
	return new Promise(resolve => {
		gulp.src(`${PATH.SRC.CSS}`)
			.pipe(cache.filter())
			.pipe(cleanCSS({ compatibility: 'ie8' }))
			.pipe(cache.cache())
			.pipe(gulp.dest(`${PATH.DEST.CSS}`))
			.pipe(browsersync.reload({ stream: true }));

		resolve();
	});
});

//browsersync
gulp.task('browserSync', () => {
	console.log('borwser reload');
	return new Promise(resolve => {
		browsersync.init({
			server: {
				baseDir: "./html/"
			},
			port: 3000
		});

		resolve();
	});
});


const css = gulp.series('css:sass', 'css:css');

gulp.task('default', gulp.series(clean, css, js, 'browserSync'));