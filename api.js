let nodeGeocoder = require('node-geocoder');
var questionsModel = require('./models/QuestionsModel');
var coinBaseModel = require('./models/CoinBaseModel');
var authModel = require('./models/AuthModel');

exports = module.exports = function(io, redisClient){
    var usersBySocket = {};
    var usersById = {};
    console.log('1');
    io.sockets.on('connection', function (socket) {
        console.log("here is basic API");
        var sessionid = socket.id;
         console.log(' %s sockets connected', io.engine.clientsCount);
        console.log("and here is socket.id", socket.id);

        socket.on('login', function(data){
            console.log('a user ' + data.userId + ' connected');
            // saving userId to array with socket ID
            usersBySocket[socket.id] = data.userId;
            usersById[data.userId] = socket.id;
            socket.broadcast.emit('userConnect', data.userId);
        });

        socket.on('isOnline', function (id, callback) {
            if (usersById[id]){
                callback(null, 1);
            } else {
                callback(null, 0);
            }
        });

        socket.on('postQuestion', function (obj, callback) {
            var ret = {};
            questionsModel.postQuestion(obj)
                .then(id => {
                    obj.id = id.id;
                    if (obj.paymentFree === '0' && obj.paymentType === 'coinbase') {
                        ret = id;
                        return coinBaseModel.generateCoinBaseCheckout(
                            'Payment for the question N.: '+ id.id +'.',
                            'Payment for the question on the site med-consultation.com.',
                            obj.paymentCount, obj.paymentCurrency);
                    }
                    else {
                        callback(null, id);
                    }
                })
                .then(coinBaseObj => {
                    return coinBaseModel.saveCoinBaseId(obj.id, coinBaseObj.id);
                })
                .then(coinBaseId => {
                    ret.coinBaseId = coinBaseId;
                    callback(null, ret);
                })
                .catch(err => {
                    callback(err.message, null);
                })
        });

        socket.on('closeQuestion', function (obj, callback) {
            questionsModel.closeQuestion(obj.id)
                .then(id => {
                    callback(null, id);
                })
                .catch(err => {
                    callback(err.message, null);
                })
        });

        socket.on('registerDoctor', function (obj, callback) {
            authModel.registerUser(obj)
                .then(ok => {
                    callback(null, ok)
                })
                .catch(e => {
                    callback(e.message, null)
                })
        });

        socket.on ('postAnswer', function (obj, callback) {
            questionsModel.postAnswer(obj)
                .then(ok => {
                    callback(null, ok)
                })
                .catch(e => {
                    callback(e.message, null)
                })
        });

        socket.on('updateUserData', function (obj, callback) {
            authModel.updateUserData(obj)
                .then(ok => {
                    callback(null, ok)
                })
                .catch(e => {
                    callback(e.message, null)
                })
        });

        socket.on('changePassword', function (obj, callback) {
            authModel.changePassword(obj)
                .then(ok => {
                    callback(null, ok)
                })
                .catch(e => {
                    callback(e.message, null)
                })
        });

        socket.on('changeAvatar', function (obj, callback) {
            authModel.changeAvatar(obj)
                .then(ok => {
                    callback(null, ok)
                })
                .catch(e => {
                    callback(e.message, null)
                })
        });

        socket.on('searchQuestion', function (obj, callback) {
            questionsModel.searchQuestion(obj)
                .then(ok => {
                    callback(null, ok)
                })
                .catch(e => {
                    callback(e.message, null)
                })
        });

        socket.on('searchByTag', function (obj, callback) {
            questionsModel.searchByTag(obj)
                .then(ok => {
                    callback(null, ok)
                })
                .catch(e => {
                    callback(e.message, null)
                })
        });

        socket.on('searchDoctors', function (obj, callback) {
            if (obj.searchBySpecializ.length > 0){
                questionsModel.searchDoctors(obj)
                    .then(ok => {
                        callback(null, ok)
                    })
                    .catch(e => {
                        callback(e.message, null)
                    })
            }
            else {
                questionsModel.getAllDoctors()
                    .then(ok => {
                        callback(null, ok)
                    })
                    .catch(e => {
                        callback(e.message, null)
                    })
            }

        });

        socket.on('getAllDoctors', function (callback) {
            questionsModel.getAllDoctors()
                .then(ok => {
                    callback(null, ok)
                })
                .catch(e => {
                    callback(e.message, null)
                })
        });

        socket.on('payToDoctor', function (obj, callback) {
            var id = 0;
            console.log('hey', obj);
            questionsModel.payToDoctor(obj)
                .then(payId => {
                    id = payId;
                    if (obj.paymentType === 'card'){
                        callback(null, payId)
                    }
                    else {
                        return coinBaseModel.generateCoinBaseCheckout('Payment for the consultation N.: ' + payId + '.', 'Payment for the consultation with doctor on the site med-consultation.com.', obj.paymentCount);
                    }
                })
                .then(checkId => {
                    return coinBaseModel.saveCoinBaseIdConsultation(id, checkId.id);
                })
                .then(ok => {
                    callback(null, ok);
                })
                .catch(e => {
                    callback(e.message, null)
                })
        });

        socket.on('loadAllMessages', function (obj, callback) {
            questionsModel.loadAllMessages(obj)
                .then(messages => {
                    callback(null, messages);
                })
                .catch(error => {
                    callback(error.message, null);
                })
        });

        socket.on('loadMessagesById', function (obj, callback) {
            questionsModel.loadMessagesById(obj)
                .then(messages => {
                    redisClient.lrange('consiltation' + messages.dialogId, 0, -1, function (err, replyArr) {
                        if (err) {
                            callback(err.message, null)
                        } else {
                            socket.join(messages.dialogId);
                            messages.replyArr = [];
                            try {
                                for (var i = 0; i < replyArr.length; i++){
                                    messages.replyArr.push(JSON.parse(replyArr[i]));
                                }
                            } catch (e) {
                                callback(e.message, null);
                            }
                            callback(null, messages);
                        }
                    });
                    //callback(null, messages);
                })
                .catch(error => {
                    callback(error.message, null);
                })
        });

        socket.on('sendMessage', function (obj, callback) {
            console.log('send-message');
            var chatObj, messageText;
            questionsModel.loadFilesInMessage(obj.files, obj.dialogId)
                .then(filesString => {
                    messageText = obj.messageText + '<br>' + filesString;
                    chatObj = {
                        userId: obj.myId,
                        time: Date.now(),
                        message: messageText
                    };
                    return questionsModel.sendMessage(obj.dialogId, obj.messageText, obj.myId);
                })
                .then(ok => {
                    redisClient.rpush(['consiltation' + obj.dialogId, JSON.stringify(chatObj)], function (err, reply) {
                        if (err) {
                            callback(err.message, null)
                        } else {
                            socket.broadcast.to(obj.dialogId).emit('message', chatObj);
                            callback(null, chatObj)
                        }
                    });
                })
                .catch(e => {
                    callback(e.message, null);
                });

        });

        socket.on('allMessageReads', function (obj, callback) {
            questionsModel.allMessageReads(obj.id, obj.isDoctor)
                .then(ok => {
                    callback(null, 'ok');
                }).catch(err => {
                    callback(err.message, null);
            })
        });

        socket.on('trueAnswer', function (obj, callback) {
            questionsModel.trueAnswer(obj)
                .then(ok => {
                    callback(null, ok)
                })
                .catch(e => {
                    callback(e.message, null);
                });
        });

        socket.on('getNameById', function (obj, callback) {
            questionsModel.getNameById(obj)
                .then(ok => {
                    callback(null, ok)
                })
                .catch(e => {
                    callback(e.message, null);
                });
        });

        socket.on('likeAnswer', function (obj, callback) {
            console.log('like answer');
            questionsModel.likeAnswer(obj)
                .then(ok => {
                    callback(null, ok)
                })
                .catch(e => {
                    callback(e.message, null);
                });
        });

        socket.on('alreadyPaymentForConsultation', function (obj, callback) {
            questionsModel.alreadyPaymentForConsultation(obj)
                .then(ok => {
                    callback(null, ok)
                })
                .catch(e => {
                    callback(e.message, null)
                })
        });

        socket.on('searchByFilters', function (obj, callback) {
            questionsModel.searchByFilters(obj)
                .then(ok => {
                    callback(null, ok)
                })
                .catch(e => {
                    callback(e.message, null)
                })
        });

        socket.on('getExchangesRate', function (curr, callback) {
            var Client = require('coinbase').Client;
            var client = new Client({apiKey, apiSecret});
            client.getExchangeRates({'currency': curr}, function(err, rates) {
                if (err) {
                    callback(err.message, null);
                } else {
                    callback(null, rates.data.rates);
                }
            });
        });

        socket.on('disconnect', function(){
            console.log('user ' + usersBySocket[socket.id] + ' disconnected');
            socket.broadcast.emit('userDisconnect', usersBySocket[socket.id]);
            delete usersById[usersBySocket[socket.id]];
            delete usersBySocket[socket.id];
        });
    });
};
