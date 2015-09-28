'use strict';

const _ = require('lodash');
const stampit = require('stampit');
const Promise = require('bluebird');

const FileReader = require('./FileReader.js');
const Config = require('./Config.js');

const Generator = stampit()
  .compose(Config)
  .init(function() {
    this.templates = FileReader.getFilesWithExtension(__dirname, this.TPL_PATH, '.md');
    this.data = FileReader.getFilesWithExtension(__dirname, this.CSV_PATH, '.csv');
  })
  .methods({
    getDataAsync() {
        var self = this;
        return Promise.all([
            FileReader.readFileAsync(this.TPL_PATH, this.templates),
            FileReader.readFileAsync(this.CSV_PATH, this.data)
          ])
          .spread((templates, csvData) => [self.precompileTemplates(templates), csvData]);
      },
      precompileTemplates(templates) {
        return _.map(templates, i => _.template(i));
      }
  });


module.exports = Generator;
