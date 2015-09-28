'use strict';

const path = require('path');
const stampit = require('stampit');
const config = require('../../config.json');

const Config = stampit.refs({
    TPL_PATH: path.resolve(__dirname, '../tpl'),
    CSV_PATH: path.resolve(__dirname, '../../csv'),
    RENDERED_PATH: path.resolve(__dirname, '../../rendered')
  })
  .refs(config);

module.exports = Config;
