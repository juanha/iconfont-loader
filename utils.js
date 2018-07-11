const glob = require('glob');
const path = require('path');
const fs = require('fs');

const mkdir = (dirpath) => {
  if (fs.existsSync(dirpath)) {

  } else {
    fs.mkdirSync(dirpath);
  }
};
const copy = (src, dest) => {
  fs.writeFileSync(dest, fs.readFileSync(src));
};
const getFilesAndDeps = (patterns, context) => {
  let files = [];
  const filesDeps = [];
  let directoryDeps = [];

  function addFile (file) {
    filesDeps.push(file);
    files.push(path.resolve(context, file));
  }

  function addByGlob (globExp) {
    const globOptions = { cwd: context };

    const foundFiles = glob.sync(globExp, globOptions);
    files = files.concat(foundFiles.map(file => path.resolve(context, file)));

    const globDirs = glob.sync(`${path.dirname(globExp)}/`, globOptions);
    directoryDeps = directoryDeps.concat(globDirs.map(file => path.resolve(context, file)));
  }

  // Re-work the files array.
  patterns.forEach((pattern) => {
    if (glob.hasMagic(pattern)) {
      addByGlob(pattern);
    } else {
      addFile(pattern);
    }
  });

  return {
    files,
    dependencies: {
      directories: directoryDeps,
      files: filesDeps
    }
  };
};

module.exports = {
  mkdir,
  copy,
  getFilesAndDeps
};
