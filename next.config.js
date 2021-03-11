const withPreact = require("next-plugin-preact");

module.exports = withPreact({
  experimental: {
    modern: true,
    polyfillsOptimization: true,
  },
});
