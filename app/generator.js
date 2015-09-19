'use strict';

const fs = require('fs');
const _ = require('lodash');
const Decimal = require('decimal.js');
const csv = require('csv');
const markdownpdf = require('markdown-pdf');

const path = require('path');

const stringUtils = require('./util/string-utils.js');
const config = require('../config.json');

const q = require('q');
let dfd = q.defer();

const MARKDOWN_PDF_OPTIONS = {
  // phantomPath: './node_modules/phantomjs2/bin/phantomjs',
  cssPath: './app/css/pdf.css',
  paperFormat: 'a4',
  paperOrientation: 'portrait',
  remarkable: {
    html: true, // Enable HTML tags in source
    xhtmlOut: false, // Use '/' to close single tags (<br />)
    breaks: true, // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-', // CSS language prefix for fenced blocks
    linkify: true, // Autoconvert URL-like text to links
    plugins: []
  }
};

const TPL_PATH = './tpl';
const CSV_PATH = '../csv';
const RENDERED_PATH = '../rendered';

function removeGitIgnore(item) {
  return (item !== '.gitignore' && item !== '.DS_Store');
}

const templates = _.filter(fs.readdirSync(path.join(__dirname, TPL_PATH)), removeGitIgnore);
const data = _.filter(fs.readdirSync(path.join(__dirname, CSV_PATH)), removeGitIgnore);

const precompiledTemplates = _.map(templates, function(item) {
  let stringifiedTpl = fs.readFileSync(path.join(__dirname, `${TPL_PATH}/${item}`), {
    encoding: 'utf-8'
  });
  return {
    tpl: _.template(stringifiedTpl),
    name: item,
    string: stringifiedTpl
  };
});

function transformCsvToObject(csvData, fileName) {
  let keys = csvData[0];
  let values = csvData[1];
  let index = 0;
  let responseObj = _.extend({}, config, {
    fileName: fileName
  });
  if (keys.length !== values.length) {
    throw new Error('CSV is badly formatted. There is some data missing.');
  } else {
    while (keys.length > index) {
      let keyName = keys[index];
      let clearKeyName = _.camelCase(stringUtils.replacer(keyName));
      responseObj[clearKeyName] = values[index];
      index++;
    }
  }

  console.log(responseObj);
  return responseObj;
}

var templateHelpers = {
  getDecimal: function(kwotaBrutto) {
    return new Decimal(parseFloat(kwotaBrutto.replace(',', '.').replace(/[  ]/g, '')));
  },
  kosztyUzyskania: function(kwotaBrutto) {
    var decimal = templateHelpers.getDecimal(kwotaBrutto);
    return decimal.times(0.5).round();
  },
  dochod: function(kwotaBrutto) {
    var decimal = templateHelpers.getDecimal(kwotaBrutto);
    return decimal.minus(templateHelpers.kosztyUzyskania(kwotaBrutto));
  },
  naleznyPodatek: function(kwotaBrutto) {
    var dochod = templateHelpers.dochod(kwotaBrutto);
    return dochod.times(0.18).round();
  },
  doWyplaty: function(kwotaBrutto) {
    var decimal = templateHelpers.getDecimal(kwotaBrutto);
    return decimal.minus(templateHelpers.naleznyPodatek(kwotaBrutto));
  }
};

let stats = 0;

function renderMarkdownTemplates(dataObject) {
  return _.each(precompiledTemplates, function(item) {
    let compiled = item.tpl(_.extend(dataObject, templateHelpers));
    let filePath = path.join(__dirname, `${RENDERED_PATH}/${dataObject.fileName}-${item.name}`).replace('.md', '.pdf');

    markdownpdf(MARKDOWN_PDF_OPTIONS).from.string(compiled).to(filePath, function() {
      console.log("%s, was generated.", filePath);
      stats++;
      if (stats === data.length) {
        dfd.resolve();
      }
    });
  });
}

_.forEach(data, function(csvItem) {
  const csvFile = fs.readFileSync(path.join(__dirname, `${CSV_PATH}/${csvItem}`), {
    encoding: 'utf-8'
  });
  csv.parse(csvFile, {
    comment: '#',
    delimiter: ';'
  }, function(err, output) {
    if (err) {
      console.log(err);
    }
    let dataObject = transformCsvToObject(output, csvItem.replace('.csv', ''));
    renderMarkdownTemplates(dataObject);
  });
});

module.exports = dfd.promise;
