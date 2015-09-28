'use strict';

const _ = require('lodash');
const stampit = require('stampit');

const markdownpdf = require('markdown-pdf');

const Promise = require('bluebird');

const Generator = require('util/Generator.js');

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


const TaxUtil = require('./util/TaxUtil.js');
const generator = Generator();

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

let stats = 0;

function renderMarkdownTemplates(dataObject) {
  let stampedData = TaxUtil(dataObject);
  return _.each(precompiledTemplates, function(item) {
    let compiled = item.tpl(stampedData);
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

// module.exports =
