import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import sourcemaps from "rollup-plugin-sourcemaps";
import json from "rollup-plugin-json";

export default {
  input: "index.js",
  output: {
    file: "dist/bundle.js",
    format: "cjs"
  },
  onwarn: function(warning) {
    if (warning.code === "THIS_IS_UNDEFINED") {
      return;
    }
    console.warn(warning.message);
  },
  plugins: [
    json(),
    sourcemaps(),
    resolve(),
    commonjs({ include: "node_modules/**" }),
    babel({
      presets: ["@babel/preset-env"],
      plugins: ["@babel/plugin-proposal-class-properties"]
    })
  ]
};
