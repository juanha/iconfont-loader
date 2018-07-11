#!/usr/bin/env node
const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');
const svgdir = path.resolve(__dirname, 'svg');
const utils = require('../utils');
const program = require('commander');
const colors = require('colors');
const pkg = require('../package.json');

// display the help text in red on the console
const make_red = (text) => colors.red(txt);

// copy svg files from the project to new dir
const copySvgFiles = (cmd, icondir) => {
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
      const dest = `${icondir}/${filename}`;
      utils.copy(src, dest);
    });
  });
};

program
  .version(pkg.version, '-v, --version')

program
  .command('clean <webpack.config.js path>')
  .option('-d, --dirname', 'assign the dir for store svg files, default is icons')
  .action(function (entryFile, options = {}) {
    const basedir = process.cwd(); 
    const srcdir = path.resolve(basedir, 'src'); 
    const iconDirname = options.dirname || 'icons';
    const dirs = fs.readdirSync(srcdir);
    const webpackConfig = require(path.resolve(basedir, entryFile));
    Object.keys(webpackConfig[1].entry).filter(entry => dirs.indexOf(entry) !== -1)
      .forEach((entryName) => {
        const entryPath = `${srcdir}/${entryName}`;
        const relativePath = path.relative(basedir, entryPath);
        const cmd = `git grep "ecom-icon-" ${relativePath}`;
        const icondir = `${entryPath}/${iconDirname}`
        utils.mkdir(icondir);
        copySvgFiles(cmd, icondir);
      });
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp(make_red);
}



