'use strict';

const Decimal = require('decimal.js');
const stampit = require('stampit');

const TaxUtil = stampit({
  methods: {
    getDecimal() {
        var decimal = new Decimal(parseFloat(this.kwotaBrutto.replace(',', '.').replace(/[  ]/g, '')));
        return decimal;
      },
      kosztyUzyskania() {
        var decimal = this.getDecimal(this.kwotaBrutto);
        return decimal.times(0.5).round();
      },
      dochod() {
        var decimal = this.getDecimal(this.kwotaBrutto);
        return decimal.minus(this.kosztyUzyskania(this.kwotaBrutto));
      },
      naleznyPodatek() {
        var dochod = this.dochod(this.kwotaBrutto);
        return dochod.times(this.podatek).round();
      },
      doWyplaty() {
        var decimal = this.getDecimal(this.kwotaBrutto);
        return decimal.minus(this.naleznyPodatek(this.kwotaBrutto));
      },
      formatToTemplate(data) {
        return data.toString().replace('.', ',');
      }
  },
  props: {
    kwotaBrutto: 0,
    podatek: 0.18,
    returnRate: 0.5
  }
});

module.exports = TaxUtil;
