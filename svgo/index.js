const SVGO = require('svgo');
const standardizeElement = require('./standardizeElement');
const svgoConfig = require('./svgo-config.json');

module.exports = new SVGO({
  plugins: svgoConfig.plugins.concat([ { standardizeElement } ])
});
