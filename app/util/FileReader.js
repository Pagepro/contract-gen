'use strict';

const path = require('path');
const fs = require('fs');

const _ = require('lodash');
const Promise = require('bluebird');
const stampit = require('stampit');

const readFile = Promise.promisify(fs.readFile);

const FileReader = stampit({
  static: {
    readFileAsync(currentDir, targetDir) {
        const dir = currentDir ? path.resolve(currentDir, targetDir) : targetDir;
        return readFile(dir, 'utf-8');
      },
      getFilesWithExtension(currentDir, targetDir, extension) {
        const dir = currentDir ? path.resolve(currentDir, targetDir) : targetDir;
        return _.filter(fs.readdirSync(dir), (item) => _.last(item.split('.')) === extension.replace('.', ''));
      }
  }
});

module.exports = FileReader;
