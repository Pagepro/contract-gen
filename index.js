'use strict';

const prompt = require('./app/prompt.js');


prompt.then(function() {
  console.log("Creating documents.");
}).then(function() {
  const generator = require('./app/generator.js');
  return generator;
}).done();
