'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const stampit = require('stampit');

const csv = require('csv');

const stringUtils = require('./string-utils.js');

const Config = require('./Config.js');
const FileReader = require('./FileReader.js');

const parseCsv = Promise.promisify(csv.parse, csv);


const CsvTransformer = stampit()
  .refs({
    csvComment: '#',
    csvDelimiter: ';'
  })
  .props({
    data: [],
    fileName: ''
  })
  .methods({
    parseFile(csvItem) {
      return FileReader.readFileAsync(__dirname, `${this.CSV_PATH}/${csvItem}`)
        .then(content => parseCsv(content, {
          comment: this.csvComment,
          delimeter: this.csvDelimiter
        }))
        .then(parsedCsv => this.transform(parsedCsv));
    },
    transform(csvData) {
      this.data = csvData;
      const keys = this.csvData[0];
      const values = this.csvData[1];
      if (keys.length !== values.length) {
        throw new Error('CSV is badly formatted. There is some data missing.');
      } else {
        let index = 0;
        let responseObj = {};
        while (keys.length > index) {
          let keyName = keys[index];
          let clearKeyName = _.camelCase(stringUtils.replacer(keyName));
          responseObj[clearKeyName] = values[index];
          index++;
        }
        return responseObj;
      }
    }
  })
  .compose(Config);

module.export = CsvTransformer;
