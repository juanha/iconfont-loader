#!/usr/bin/env node
const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');
const basedir = path.resolve(__dirname, '../');
const svgdir = path.resolve(__dirname, 'svg');
const webpackConfig = require('../../webpack.config');
const utils = require('./utils');
const iconList = [
  'groupon',
  'booking',
  'order',
  'order',
  'maiton',
  'queue',
  'jieqian',
  'biztone-new',
  'marketing-university',
  'marketing-university',
  'smart-pos',
  'smart-pos',
  'praise',
  'praise',
  'marketing-center',
  'marketing-university',
  'project-manage',
  'operate-data',
  'finance-service',
  'finance-info',
  'order-manage',
  'promotion',
  'shiwu',
  'vip',
  'poi',
  'ticket',
  'cloud-assistant',
];

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
      }).filter(Boolean).concat(iconList)
    ));
    icons.forEach((name) => {
      const filename = `${name}.svg`;
      const src = `${svgdir}/${filename}`;
      const dest = `${iconDir}/${filename}`;
      utils.copy(src, dest);
    });
  });
};

const dirs = fs.readdirSync(basedir);
const entrys = Object.keys(webpackConfig[1].entry).filter(entry => dirs.indexOf(entry) !== -1);
entrys.forEach((entry) => {
  const entryPath = `${basedir}/${entry}`;
  const cmd = `git grep "ecom-icon-" ${entryPath}`;
  copyUsedSvgFiles(cmd, entryPath);
});
