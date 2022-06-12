var emailModel = require("./EmailModel");
var authModel = require( "./AuthModel");

var mysql = require('mysql');
let pool = require('./DBConnectionModel').returnPoolConnection();
var fs = require('fs');
var path = require('path');
var generatePassword = require('password-generator');
var Big = require('big.js');

var coinbase = require('coinbase-commerce-node');
var Client = coinbase.Client;
var clientObj = Client.init('c57b30f5-b7e4-4a9c-a26d-d1dc5d8131cf');
clientObj.setRequestTimeout(3000);
var Checkout = coinbase.resources.Checkout;

class CoinBaseModel {
    constructor() {

    }

    async generateCoinBaseCheckout(name, description, amount, currency) {
        console.log('generateCoinBaseCheckout');

        return new Promise((resolve, reject) => {
            var checkoutObj = new Checkout();

            checkoutObj.name = name;
            checkoutObj.description = description;
            checkoutObj.pricing_type = 'fixed_price';
            checkoutObj.local_price = {
                'amount': `${amount}`,
                'currency': currency
            };
            checkoutObj.requested_info = ['name'];

            checkoutObj.save(function (error, responsecheckoutObj) {
                if (error) {
                    console.log('checkoutObj.save error:', error);
                    return reject(error);
                } else {
                    console.log("responsecheckoutObj: ",responsecheckoutObj);
                    return resolve(responsecheckoutObj);
                }

            });
        })
    }

    async saveCoinBaseId (questionId, coinBaseId) {
        console.log('saveCoinBaseId');

        try {
            var result = await pool.query(`UPDATE questions SET coinBaseId = ? WHERE id = ?`,
                [coinBaseId, questionId]);
        } catch (e) {
            throw e;
        }

        return coinBaseId;
    }

    async saveCoinBaseIdConsultation (payId, coinBaseId) {
        console.log('saveCoinBaseIdConsultation: ' + payId + ",  " + coinBaseId);

        try {
            var result = await pool.query(`UPDATE paymentsForConsultations SET coinbaseCheckoutId = ? WHERE id = ?`,
                [coinBaseId, payId]);
        } catch (e) {
            throw e;
        }

        return coinBaseId;
    }

    async searchPaymentByCoinBaseId(coinbaseId) {
        if (typeof coinbaseId === "string" && coinbaseId.length > 3) {
            try {
                var result = await pool.query("SELECT * FROM questions WHERE coinBaseId = ?", [coinbaseId])
            } catch (e) {
                throw e
            }

            if (result.length > 0) {
                return {isQuestion: true, obj: result[0]}
            } else {
                try {
                    var result = await pool.query("SELECT * FROM paymentsForConsultations WHERE coinbaseCheckoutId = ?", [coinbaseId])
                } catch (e) {
                    throw e
                }
                if (result.length > 0) {
                    return {isQuestion: false, obj: result[0]}
                } else {
                    throw new Error('No search question with coinBaseId = ' + coinbaseId);
                }
            }
        } else {
            throw new Error('Bad coinBaseId');
        }

    }

    async setCoinBasePaymentAsConfirmed(paymentId, amount, currency) {
        try {
            var result = await pool.query("UPDATE questions SET coinBaseConfirmed = 1, active = 1, paymentCount = ?, paymentCurrency = ? WHERE id = ?", [amount, currency, paymentId])
        } catch (e) {
            throw e
        }

        return result.affectedRows;
    }

    async setCoinbaseConfirmedConsultation(paymentObj, amount, currency) {
        try {
            var result = await pool.query("UPDATE paymentsForConsultations SET coinbaseСonfirmed = 1, paymentComplete = 1, paymentCount = ?, paymentCurrency = ? WHERE id = ?", [amount, currency, paymentObj.id])
        } catch (e) {
            throw e
        }

        try {
            var balanced = await pool.query(`SELECT doctorsBalance.* FROM doctorsBalance WHERE userId = ?`, [paymentObj.doctorId]);
        } catch (e) {
            throw e;
        }

        if (balanced.length > 0){
            var balance = balanced[0];
            try {
                if (balance.preferredCurrency === 'USD'){
                    var result3 = await pool.query(`UPDATE doctorsBalance SET USD = ? WHERE userId = ?`, [new Big(amount).times(0.7).plus(balance.USD).toFixed(2), paymentObj.doctorId]);
                } else if (balance.preferredCurrency === 'EUR'){
                    var result3 = await pool.query(`UPDATE doctorsBalance SET EUR = ? WHERE userId = ?`, [new Big(amount).times(0.7).plus(balance.EUR).toFixed(2), paymentObj.doctorId]);
                } else if (balance.preferredCurrency === 'RUB'){
                    var result3 = await pool.query(`UPDATE doctorsBalance SET RUB = ? WHERE userId = ?`, [new Big(amount).times(0.7).plus(balance.RUB).toFixed(2), paymentObj.doctorId]);
                }
                else if (balance.preferredCurrency === 'CZK'){
                    var result3 = await pool.query(`UPDATE doctorsBalance SET CZK = ? WHERE userId = ?`, [new Big(amount).times(0.7).plus(balance.CZK).toFixed(2), paymentObj.doctorId]);
                }
                else if (balance.preferredCurrency === 'BTC'){
                    var result3 = await pool.query(`UPDATE doctorsBalance SET BTC = ? WHERE userId = ?`, [new Big(amount).times(0.7).plus(balance.BTC).toFixed(2), paymentObj.doctorId]);
                }
                else if (balance.preferredCurrency === 'BCH'){
                    var result3 = await pool.query(`UPDATE doctorsBalance SET BCH = ? WHERE userId = ?`, [new Big(amount).times(0.7).plus(balance.BCH).toFixed(2), paymentObj.doctorId]);
                }
                else if (balance.preferredCurrency === 'DAI'){
                    var result3 = await pool.query(`UPDATE doctorsBalance SET DAI = ? WHERE userId = ?`, [new Big(amount).times(0.7).plus(balance.DAI).toFixed(2), paymentObj.doctorId]);
                }
                else if (balance.preferredCurrency === 'ETH'){
                    var result3 = await pool.query(`UPDATE doctorsBalance SET ETH = ? WHERE userId = ?`, [new Big(amount).times(0.7).plus(balance.ETH).toFixed(2), paymentObj.doctorId]);
                }
                else if (balance.preferredCurrency === 'LTC'){
                    var result3 = await pool.query(`UPDATE doctorsBalance SET LTC = ? WHERE userId = ?`, [new Big(amount).times(0.7).plus(balance.LTC).toFixed(2), paymentObj.doctorId]);
                }
                else if (balance.preferredCurrency === 'USDC'){
                    var result3 = await pool.query(`UPDATE doctorsBalance SET USDC = ? WHERE userId = ?`, [new Big(amount).times(0.7).plus(balance.USDC).toFixed(2), paymentObj.doctorId]);
                }
                else {
                    return new Error(balance.preferredCurrency + ' is unknown currency.');
                }
            } catch (e) {
                throw e;
            }
        } else {
            throw new Error('doctor\'s balance is not found');
        }

        authModel.sendMailForConsiltation(paymentObj.id);

        return result.affectedRows;
    }

    async getExchangeRates (currency){
        var Client = require('coinbase').Client;
        var client = new Client({'apiKey': 'c57b30f5-b7e4-4a9c-a26d-d1dc5d8131cf',
            'apiSecret': 'API SECRET'});

        await client.getExchangeRates({'currency': currency}, function(err, rates) {
            if (err) {
                console.log(err);
                throw err;
            } else {
                console.log(rates);
                return rates;
            }
        });
    }
}

module.exports = new CoinBaseModel();