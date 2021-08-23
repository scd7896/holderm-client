module.exports = function (env, args) {
	return {
		mode: env.production ? "production" : "development",
		output: {
			filename: "./game.min.js",
		},
		entry: "./public/game/index.ts",
		resolve: {
			extensions: [".ts", ".tsx", ".js", ".css", ".scss"],
		},
		module: {
			rules: [
				{
					test: /.js$/,
					use: ["babel-loader"],
				},
				{
					test: /.ts$/,
					use: ["babel-loader", "ts-loader"]
				}
			],
		},
	};
};
