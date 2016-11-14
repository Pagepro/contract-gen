'use strict';

const prompt = require('prompt');
const fs = require('fs');
const path = require('path');
const stats = fs.existsSync('./config.json');

const q = require('q');
const dfd = q.defer();
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
  description: 'Street and number',
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
  console.log("Starting generator. Please enter required data.")
  prompt.get(properties, function(err, result) {
    if (err) {
      console.log("There was an error. Please try again.")
      console.log(err);
    } else {
      let obj = {
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
      console.log("Are above data valid? [Y/n]");
      prompt.get({
        name: 'isValid',
        description: '[Y/n]',
        validator: /[yn]{1}/i
      }, function(validationErr, validationResult) {
        if (validationResult.isValid.toLowerCase() === 'n') {
          startPrompt();
        } else {
          console.log('Writing config to config.json.');
          try {
            fs.writeFileSync(path.join(__dirname, '..', '/config.json'), JSON.stringify(obj, null, 4));
            dfd.resolve();
            console.log('File config.json successfully created at root directory.');
          } catch (e) {
            dfd.reject();
            console.log('Couldn\'t write config.json.');
          }
        }
      });
    }
  });
}


if (!stats) {
  prompt.start();
  console.log("File config.json wasn't found in the directory.")
  startPrompt();
} else {
  dfd.resolve();
}


module.exports = dfd.promise;
