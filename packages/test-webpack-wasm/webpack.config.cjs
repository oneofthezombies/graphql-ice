const path = require("path");

module.exports = {
  mode: "development", // 또는 "production"
  entry: "./src/index.ts", // TypeScript 엔트리 파일 경로
  output: {
    filename: "bundle.js", // 출력 파일 이름
    path: path.resolve(__dirname, "dist"), // 출력 디렉토리
  },
  resolve: {
    extensions: [".ts", ".js", ".json", ".wasm"], // Webpack이 처리할 확장자
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // TypeScript 파일 처리
        use: "ts-loader", // 또는 "babel-loader"와 "@babel/preset-typescript" 사용 가능
        exclude: /node_modules/, // node_modules는 제외
      },
      {
        test: /\.wasm$/, // WebAssembly 파일 처리
        type: "webassembly/async",
      },
    ],
  },
  experiments: {
    asyncWebAssembly: true, // WebAssembly 활성화
  },
  externals: {
    wbg: "wbg", // WebAssembly imports를 외부로 간주
  },
};
