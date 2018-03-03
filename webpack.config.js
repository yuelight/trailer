module.exports = {
	entry: ['./src/index.js'],
	output: {
		path: `${__dirname}/server/public`,
		filename: 'build.js'
	},
	devtool: 'cheap-module-source-map',
	resolve: {
		alias: {
			DPlayer: `${__dirname}/node_modules/dplayer`
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{ loader: 'babel-loader' },
					{ loader: 'eslint-loader' }
				]
			},
			{
				test: /\.sass/,
				use: [
					{
						loader: 'style-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							plugins: [
								require('postcss-cssnext')()
							]
						}
					},
					{ loader: 'sass-loader' }
				]
			},
			{
				test: /\.css/,
				use: [
					{
						loader: 'style-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							plugins: [
								require('postcss-cssnext')()
							]
						}
					}
				]
			}
		]
	},
	mode: 'development'
};
