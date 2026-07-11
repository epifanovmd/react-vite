export default {
  presets: [],
  plugins: [
    ["@babel/plugin-proposal-decorators", { version: "legacy" }],
    "babel-plugin-transform-typescript-metadata",
    "babel-plugin-parameter-decorator",
  ],
};
