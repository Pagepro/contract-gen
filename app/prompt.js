'use strict';

const prompt = require('prompt');
const fs = require('fs');
const path = require('path');
const configExists = fs.existsSync('./config.json');

const Promise = require('bluebird');

const getPromptPromised = Promise.promisify(prompt.get, prompt);

const properties = [{
  name: 'company',
  description: 'Company name',
  required: true
}, {
  name: 'firstName',
  description: 'First name',
  required: true
}, {
  name: 'surname',
  description: 'Surname',
  required: true
}, {
  name: 'street',
  description: 'Street and number (ul. Andruszkiewicza)',
  required: true
}, {
  name: 'zipcode',
  description: 'Zip code',
  required: true
}, {
  name: 'town',
  description: 'Town',
  required: true
}, {
  name: 'nip',
  description: 'NIP',
  required: true
}, {
  name: 'regon',
  description: 'Regon',
  required: true
}];

function startPrompt() {
  let obj;
  console.log('Starting genrator. Please enter required data.');
  return getPromptPromised(properties)
    .catch(function(err) {
      console.log('There was an error. Please try again.');
      console.log(err);
    })
    .then(function(result) {
      obj = {
        wystawca: {
          firma: result.company,
          imie: result.firstName,
          nazwisko: result.surname,
          ulica: result.street,
          kodPocztowy: result.zipcode,
          miejscowosc: result.town,
          nip: result.nip,
          pesel: result.pesel,
          regon: result.regon
        }
      };
      console.log(result);
      console.log('Are above data valid? [Y/n]');
    })
    .then(function() {
      return getPromptPromised({
        name: 'isValid',
        description: '[Y/n]',
        validator: /[yn]{1}/i
      });
    })
    .then(function(validationResult) {
      if (validationResult.isValid.toLowerCase() === 'n') {
        startPrompt();
      } else {
        console.log('Writing config to config.json.');
        try {
          fs.writeFileSync(path.join(__dirname, '..', '/config.json'), JSON.stringify(obj, null, 4));
          console.log('File config.json successfully created at root directory.');
        } catch (e) {
          console.log('Couldn\'t write config.json.');
        }
      }
    });
}

let promise;

if (!configExists) {
  prompt.start();
  console.log('File config.json wasn\'t found in the directory.');
  promise = startPrompt();
} else {
  promise = Promise.resolve();
}


module.exports = promise;
