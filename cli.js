#!/usr/bin/env node
const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');
const basedir = path.resolve(__dirname, '../');
const svgdir = path.resolve(__dirname, 'svg');
const webpackConfig = require('../../webpack.config');
const utils = require('./utils');
const pkg = require('../package.json');
var program = require('commander');
var colors = require('colors');

program
  .version(pkg.version)
  .command('getstream [url]', 'get stream URL')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp(make_red);
}

function make_red(txt) {
  return colors.red(txt); //display the help text in red on the console
}

const copyUsedSvgFiles = (cmd, context) => {
  const iconDir = path.resolve(context, 'icons');
  utils.mkdir(iconDir);
  childProcess.exec(cmd, (err, res) => {
    if (err) throw err;
    const lines = res.toString().split('\n');

    const icons = Array.from(new Set(
      lines.map(l => {
        const m = l.match(/(ecom\-icon\-)([0-9a-z-]+)/);
        return m && m[2];
      }).filter(Boolean)
    ));
    icons.forEach((name) => {
      const filename = `${name}.svg`;
      const src = `${svgdir}/${filename}`;
      const dest = `${iconDir}/${filename}`;
      utils.copy(src, dest);
    });
  });
};

// const dirs = fs.readdirSync(basedir);
// const entrys = Object.keys(webpackConfig[1].entry).filter(entry => dirs.indexOf(entry) !== -1);
// entrys.forEach((entry) => {
//   const entryPath = `${basedir}/${entry}`;
//   const cmd = `git grep "ecom-icon-" ${entryPath}`;
//   copyUsedSvgFiles(cmd, entryPath);
// });
