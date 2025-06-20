var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
//var client = require('redis').createClient();
//var pool = require('./models/DBConnectionModel').returnPoolConnection();
var helmet = require('helmet');
var fs = require('fs');
let axios = require('axios');
//Big.RM = 0;
//let redis = require('redis');
//  let CONSTANTS = require('./Constants');
//let binanceModel = require('./models/BinanceModel');
//let storyModel = require('./models/StoryModel');

Number.prototype.trimNum = function (places, rounding) {
    rounding = rounding || "round";
    var num = parseFloat(this), multiplier = Math.pow(10, places);
    return (Number(Math[rounding](num * multiplier) / multiplier));
}


var express = require('express'),
    app = module.exports.app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(helmet.noCache());

var server = http.createServer(app);
// socket API
var io = require('socket.io').listen(server);  //pass a http.Server instance
//var basicAPI = require('./api')(io, client);
var questionsModel = require('./models/QuestionsModel');
var coinBaseModel = require('./models/CoinBaseModel');
var authModel = require('./models/AuthModel');

server.listen(3007, function () {
    console.log('Example app here! 3007');
});
// let ordersObj = {
//     resultsSellingOrders: [],
//     resultsBuyingOrders: []
// }
//
//
// process.on('message', function (msg) {
//     if (msg.resultsSellingOrders && msg.resultsBuyingOrders) {
//         ordersObj.resultsSellingOrders = msg.resultsSellingOrders;
//         ordersObj.resultsBuyingOrders = msg.resultsBuyingOrders;
//         console.log('lalalalalLALALALALAL received & assigned', process.env.port)
//     }
// })

// var authAPI = require('./api/AuthApi')(io);
// //var balanceAPI = require('./api/BalanceApi')(io, ordersObj);
// var balanceAPI = require('./api/BalanceApi')(io);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.disable('x-powered-by');    // security

// app.use(function (req, res, next) {
//     let envData = {
//         url: CONSTANTS.socketAddrr,
//         debugServer: CONSTANTS.debugServer,
//     };
//
//     req.ejsData = {envData};
//     next();
// });

app.get('/', (req, res) => {
    var obj = {};
    questionsModel.getAllQuestions()
        .then(questions => {
           //obj.questions = questions;
           //if (req.cookies.email && req.cookies.email.length > 0 && req.cookies.password && req.cookies.password.length > 0){
           //    return authModel.authByEmailPass(req.cookies.email, req.cookies.password);
           //}
           //else {
           //    return null;
           //}
           obj.questions = [{
                id: 1,
                title: '123',
                userId: '1',
                sectionOfMedecine: 'sdfsd',
                text: 'sdfsfsdf',
                keyword: 'dffd',
                datePost: '10/01/2020',
                month: 'Janyary',
                day: '12',
                fullYear: '2022',
                time: '12:12',
                userName: 'John Doe',
                avatarPath: null
           }];
           return null;
        })
        .then(userObj => {
            console.log('return userObj');
            obj.userObj = {
                id: 1,
                email: 'email@mail.ru',
                firstLastName: 'John Doe',
                password: '1234',
                aboutMe: '... /// ...',
                avatarPath: null,
                isDoctor: '0',
                experience: 'one year',
                specializations: 'not',
                dateRegister: '11/11/2011'
            }
            //if (!userObj || !userObj.id){
            //    console.log('userObj = null');
            //    userObj = false;
            //}
            //obj.userObj = userObj;
            //console.log('here');
            res.render('appVue', obj);
        })
        .catch(error => {
            res.set(error.message);
        })

    
});

app.get('/logout/', (req, res) => {
    res.clearCookie('email');
    res.clearCookie('password');
    res.redirect('/');
});

/* REST API */
app.post('/coinbase-webhookZ/', (req, res) => {
    let coinBaseObj = req.body.event.data;
    console.log('hi! coinbase-webhookZ, coinBaseObj:', coinBaseObj);

    if (coinBaseObj.checkout && coinBaseObj.checkout.id) {
        coinBaseModel.searchPaymentByCoinBaseId(coinBaseObj.checkout.id) // we have checkout id, not charge id (charge id is coinBaseObj.id)
            .then(paymentObj => {
                if (coinBaseObj.confirmed_at) {
                    console.log('payment was confirmed');

                    if (coinBaseObj.payments && coinBaseObj.payments.value && coinBaseObj.payments.value.crypto && coinBaseObj.payments.value.crypto.amount && coinBaseObj.payments.value.crypto.currency) {
                        // set, that the payment was already confirmed?
                        if (paymentObj.obj.coinBaseConfirmed === 0) {
                            if (paymentObj.isQuestion === true){
                                return coinBaseModel.setCoinBasePaymentAsConfirmed(paymentObj.obj.id, coinBaseObj.payments.value.crypto.amount, coinBaseObj.payments.value.crypto.currency)
                            } else {
                                return coinBaseModel.setCoinbaseConfirmedConsultation(paymentObj.obj, coinBaseObj.payments.value.crypto.amount, coinBaseObj.payments.value.crypto.currency)
                            }
                        } else {
                            console.log("double webhook for already confirmed -> object in db -> then object received", paymentObj.obj, coinBaseObj);
                            res.status(400).send({status: 400, message: "double webhook for already confirmed -> object in db -> then object received" + paymentObj.obj + coinBaseObj});
                        }
                    } else {
                        console.log("coinBaseObj.payments.value.crypto.amount and coinBaseObj.payments.value.crypto.currency not found! ",  coinBaseObj);
                        res.status(400).send({status: 400, message: "coinBaseObj.payments.value.crypto.amount and coinBaseObj.payments.value.crypto.currency not found! " + coinBaseObj});
                    }
                } else {
                    console.log('payment was not confirmed');
                    res.status(200).send({status: 200, message: 'CoinBase payment is not confirmed.'});
                }
            })
            .then(affectedRows => {
                if (affectedRows > 0){
                    console.log('Success save information for coinBase payment ID.' + coinBaseObj.checkout.id + '.');
                    res.status(200).send({status: 200, message: 'Success save information for coinBase payment ID.' + coinBaseObj.checkout.id + '.'});
                }
                else {
                    console.log('An error occurred while saving the payment is confirmed');
                    res.status(400).send({status: 400, error: 'An error occurred while saving the payment is confirmed'});
                }
            })
            .catch(e => {
                console.log('error in coinbase webhook!, e:', e);
                res.status(400).send({status: 400, error: 'error in coinbase webhook!, e:' + e.message});
            });
    } else {
        console.log('no checkout id, coinBaseObj.timeline:', coinBaseObj.timeline);
        res.status(404).send({status: 404, error: 'no checkout id, coinBaseObj.timeline:' + coinBaseObj.timeline});
    }


});

if (process.env.port === "3020") {


    // let binance = require('node-binance-api')().options({
    //     APIKEY,
    //     APISECRET,
    //     useServerTime: true // If you get timestamp errors, synchronize to server time at startup
    // });

    // binanceModel.getUsdtAvailableBalance()
    //     .then(balance => {
    //         console.log('balance', balance.toFixed(3))
    //     })
    //     .catch(e => {
    //         console.log(e)
    //     })

    let lastBtcPrice = null;
    let minutesWhenGoDown = 0;
    let minutesWhenGoUp = 0;

    let lastSellPriceBig = null;
    let lasBuyPriceBig = null;
    //let lasBuyPriceBig = Big(7387.89);

    // binanceModel.getActualBtcPriceInUsdt()
    //     .then(btcPrice => {
    //         return binanceModel.sellAllBtc(btcPrice)
    //     })
    //     .then(ok => {
    //         console.log(ok)
    //     })
    //     .catch(e => {
    //        if (e.body) {
    //            console.log(e.body)
    //        } else {
    //            console.log(e)
    //        }
    //
    //     })


    // setInterval(() => {
    //
    //     console.log('start bot executed');
    //
    // binanceModel.getActualBtcPriceInUsdt()
    //     .then(btcPrice => {
    //
    //         // last price was greater, so price go down
    //         if (lastBtcPrice !== null && lastBtcPrice.cmp(btcPrice) === 1) {
    //             console.log('lastBtcPrice !== null && lastBtcPrice.cmp(btcPrice) === 1, inside')
    //             minutesWhenGoDown = minutesWhenGoDown +1;   // add + 1 minute
    //
    //             if (minutesWhenGoUp >= 4) {
    //                 minutesWhenGoUp = 0; // reset
    //                 // sell
    //                 if (lasBuyPriceBig !== null && lasBuyPriceBig.cmp(btcPrice) === -1) {
    //                     console.log('last buy price was lower, so we can buy');
    //                     lastBtcPrice = btcPrice;
    //                     console.log('before return minutesWhenGoUp > 5');
    //                     return binanceModel.sellAllBtc(btcPrice)
    //                 } else if (lasBuyPriceBig === null) {
    //                     lastBtcPrice = btcPrice;
    //                     console.log('before return lasBuyPriceBig === null');
    //                     return binanceModel.sellAllBtc(btcPrice)
    //                 } else {
    //                     console.log('тик наступил, но купили курс щас ниже чем тот по которому мы купили', lasBuyPriceBig.toFixed(8), btcPrice.toFixed(8))
    //                 }
    //
    //             } else {
    //                 minutesWhenGoUp = 0; // reset
    //             }
    //
    //         } else if (lastBtcPrice !== null && lastBtcPrice.cmp(btcPrice) === -1) { // last price was smaller, so price go up
    //             console.log('lastBtcPrice !== null && lastBtcPrice.cmp(btcPrice) === -1, inside')
    //             minutesWhenGoUp = minutesWhenGoUp + 1; // add + 1 minute
    //
    //             if (minutesWhenGoDown >= 4) {
    //                 minutesWhenGoDown = 0;   // reset
    //                 // buy
    //                 if (lastSellPriceBig !== null && lastSellPriceBig.cmp(btcPrice) === 1) {
    //                     console.log('last sell price was bigger, so we can sell');
    //                     lastBtcPrice = btcPrice;
    //                     console.log('before return minutesWhenGoDown > 5');
    //                     return binanceModel.buyForAllBtc(btcPrice)
    //                 } else if (lastSellPriceBig === null) {
    //                     lastBtcPrice = btcPrice;
    //                     console.log('before return lastSellPriceBig === null');
    //                     return binanceModel.buyForAllBtc(btcPrice)
    //                 } else {
    //                     console.log('тик наступил, но курс продажи не метчнулся по критериям предудыщей покупки', lastSellPriceBig.toFixed(8), btcPrice.toFixed(8))
    //                 }
    //             } else {
    //                 minutesWhenGoDown = 0;   // reset
    //             }
    //         }
    //
    //         lastBtcPrice = btcPrice;
    //         return 'nothing to do'
    //     })
    //     .then(response => {
    //         // {forPrice, orderId: response.orderId, type: 'buy'}
    //         if (response.type && response.type === 'buy') {
    //             lasBuyPriceBig = response.forPrice;
    //             lastSellPriceBig = null;
    //             console.log('lasBuyPriceBig = response.forPrice:', response)
    //         } else if (response.type && response.type === 'sell') {
    //             lastSellPriceBig = response.forPrice;
    //             lasBuyPriceBig = null;
    //             console.log('lastSellPriceBig = response.forPrice:', response)
    //         }
    //
    //         console.log('response:' , response)
    //
    //         try {
    //             console.log('слева покупка битка', 'справа продажа битка')
    //             console.log( lastBtcPrice.toFixed(8), minutesWhenGoDown ,minutesWhenGoUp)
    //             if (lastSellPriceBig !== null) {
    //                 console.log('lastSellPriceBig', lastSellPriceBig.toFixed(8))
    //             }
    //
    //             if (lasBuyPriceBig !== null) {
    //                 console.log('lasBuyPriceBig', lasBuyPriceBig.toFixed(8))
    //             }
    //         } catch (e) {
    //             console.log('catch e inside then', e)
    //         }
    //
    //     })
    //     .catch(e => {
    //
    //         if (e.body) {
    //             console.log(e.body)
    //         } else {
    //             console.log(e)
    //         }
    //
    //     })
    // }, 60000);


}

