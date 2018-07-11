## iconfont-loader

A Webpack loader that generates fonts from your SVG icons and allows you to use your icons in your HTML.

- uses the [`webfonts-generator`](https://github.com/sunflowerdeath/webfonts-generator) plugin to create fonts in any format.

- uses the [`svgo`](https://github.com/svg/svgo)  of a Nodejs-based tool  for optimizing SVG vector graphics files

## installation

```
npm install iconfont-loader
or
yarn add iconfont-loader
```

## Usage

```
// webpack.config.js

{
  test: /\.font$/,
  loader: ExtractTextPlugin.extract({
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'iconfont-loader',
        options: { ... } // support options object
      }
    ]
  })
}
```

```
// config.font
module.exports = {
  'files': [
    './myfont/*.svg'
  ],
  'fontName': 'myfonticons',
  'classPrefix': 'myfonticon-',
  'baseSelector': '.myfonticon',
  'types': ['eot', 'woff', 'woff2', 'ttf', 'svg'],
  'fileName': 'app.[fontname].[hash].[ext]'
};
```

Learn more about config params  [here](https://github.com/sunflowerdeath/webfonts-generator)

Then you have to require the configuration file: 

```
// entry.js
require('./myfont.font');
```

Learn more see `test/`

icon preview html see [icons](http://msstest.sankuai.com/v1/mss_a9a6b4a841754c948f210c687fab126a/mtfe-bbia/ecom-icons.html)
