/* eslint consistent-return: 0 */
const loaderUtils = require('loader-utils');
const webfontsGenerator = require('webfonts-generator');
const path = require('path');
const url = require('url');
const fs = require('fs');
const svgo = require('./svgo');
const { getFilesAndDeps } = require('./utils');

const TEMPLATES_DIR = path.join(__dirname, 'templates');
const TEMPLATES = {
  css: path.join(TEMPLATES_DIR, 'cssTemplate.css'),
  html: path.join(TEMPLATES_DIR, 'htmlTemplate.html')
};
const DEFAULT_TEMPLATE_OPTIONS = {
  baseSelector: 'ecom-icon',
  classPrefix: 'ecom-icon-'
};

const formats = ['eot', 'woff', 'woff2', 'ttf', 'svg'];

const DEFAULT_CONFIG = {
  writeFiles: true,
  fontName: 'ecom-icons',
  baseSelector: DEFAULT_TEMPLATE_OPTIONS.baseSelector,
  classPrefix: DEFAULT_TEMPLATE_OPTIONS.classPrefix,
  cssTemplate: TEMPLATES.css,
  types: formats,
  order: formats,
  html: false,
  htmlTemplate: TEMPLATES.html,
  templateOptions: DEFAULT_TEMPLATE_OPTIONS
};

module.exports = function (content) {
  if (this.cacheable) {
    this.cacheable();
  }
  if (!this.emitFile) throw new Error('emitFile is required from module system');

  const cb = this.async();
  const options = this.options || {};
  const query = loaderUtils.getOptions(this) || {};
  const publicPath = query.publicPath || (options.output && options.output.publicPath) || '/';
  let filename = query.filename || '[fontname].[hash].[ext]';

  let fontConfig;
  try {
    fontConfig = JSON.parse(content);
  } catch (ex) {
    fontConfig = this.exec(content, this.resourcePath);
  }

  const config = Object.assign({}, { filename, publicPath }, fontConfig);
  const filesAndDeps = getFilesAndDeps(config.files, this.context);
  config.files = filesAndDeps.files;

  const generatorOptions = Object.assign({}, DEFAULT_CONFIG, {
    files: config.files,
    fontHeight: config.fontHeight || 1000, // Fixes conversion issues with small svgs,
    dest: config.dest || '',
    html: config.html
  });

  if (config.htmlDest === undefined) {
    generatorOptions.htmlDest = path.join(generatorOptions.dest, `${DEFAULT_CONFIG.fontName}.html`);
  }

  // 生成字体和样式文件
  const generateFont = () => webfontsGenerator(generatorOptions, (err, res) => {
    if (err) {
      return cb(err);
    }
    const urls = {};
    formats.forEach((format) => {
      filename = config.filename
        .replace('[fontname]', generatorOptions.fontName)
        .replace('[ext]', format);

      const formatFilename = loaderUtils.interpolateName(this, filename, {
        context: options.context || this.context,
        content: res[format]
      });
      urls[format] = url.resolve(publicPath, formatFilename.replace(/\\/g, '/'));
      this.emitFile(formatFilename, res[format]);
    });

    cb(null, res.generateCss(urls));
  });

  // 监听依赖目录文件
  const { files, dependencies } = filesAndDeps;
  dependencies.files.forEach(this.addDependency.bind(this));
  dependencies.directories.forEach(this.addContextDependency.bind(this));

  // 精简svg文件
  const promises = files.map((f) => {
    const source = fs.readFileSync(f).toString();
    return svgo.optimize(source, { path: path.dirname(f) });
  });

  Promise.all(promises).then((res) => {
    res.forEach((f, i) => {
      fs.writeFileSync(files[i], f.data, 'utf8');
    });
    generateFont();
  }, (err) => {
    cb(err);
  });
};
