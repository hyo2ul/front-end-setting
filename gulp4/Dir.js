let DIR = {
	SRC : 'html',
	DEST : 'html_build',
	PORT : 3000
}

module.exports = {
	PATH : {
		DIR : DIR,
		SRC: {
			JS: `${DIR.SRC}/js/**/*.js`,
			CSS: `${DIR.SRC}/css/*.css`,
			SCSS: `${DIR.SRC}/scss/**/*.scss`,
			HTML: `${DIR.SRC}/**/*.html`,
		},
		DEST: {
			JS: `${DIR.DEST}/js`,
			CSS: `${DIR.DEST}/css`,
			HTML: `${DIR.DEST}/`,
		}
	}
}