var emailModel = require("./EmailModel");
var authModel = require( "./AuthModel");

var mysql = require('mysql');
let pool = require('./DBConnectionModel').returnPoolConnection();
var fs = require('fs');
var path = require('path');
var Big = require('big.js');
var generatePassword = require('password-generator');

var coinbase = require('coinbase-commerce-node');
var Client = coinbase.Client;
var clientObj = Client.init('c57b30f5-b7e4-4a9c-a26d-d1dc5d8131cf');
clientObj.setRequestTimeout(3000);
var Checkout = coinbase.resources.Checkout;

class QuestionsModel {
    constructor() {

    }

    async getAllQuestions () {
        console.log('getAllQuestions');
        return [];
        try {
            var result = await pool.query(`SELECT * FROM questions`);
            console.log(result);
            //var result = await pool.query(`SELECT questions.*, MONTHNAME(datePost) AS month, DATE_FORMAT(datePost, '%e') AS day, YEAR(datePost) AS fullYear, TIME_FORMAT(datePost, '%H:%i') AS time, users.firstLastName AS userName, users.avatarPath FROM questions LEFT JOIN users ON questions.userId = users.id ORDER BY questions.datePost DESC`);

        } catch (e) {
            throw e;
        }
        if (result.length === 0) return [];
        console.log('getAllQuestions2');
        for (var i = 0; i < result.length; i++){
            try {
                var res = await pool.query(`SELECT answers.*, MONTHNAME(datePost) AS month, DATE_FORMAT(datePost, '%e') AS day, YEAR(datePost) AS fullYear, TIME_FORMAT(datePost, '%H:%i') AS time, users.firstLastName, users.avatarPath, users.specializations FROM answers LEFT JOIN users ON answers.idDoctor = users.id WHERE idQuestion = ?`, [result[i].id]);
            } catch (e) {
                throw e;
            }

            if (res.length > 0) {
                result[i].answers = res;
            }
        }
        return result;
    }

    async postQuestion (obj) {
        console.log('postQuestion ' + obj.registered + ' ' + obj.userEmail);

        var shortKeyword = 0;
        var keywords = obj.questionKeyword.split(',');
        for (var i = 0; i < keywords.length; i++){
            if (keywords[i].trim().length < 3) {
                shortKeyword++;
            }
        }
        if (obj.titleOfQuestion.length < 2 || obj.questionText.length < 6 || obj.questionKeyword.length < 3) {
            throw new Error('Something is not long enough');
        }

        if (obj.titleOfQuestion.length > 300 || obj.questionKeyword.length > 300) {
            throw new Error('Something is too long');
        }

        if (shortKeyword > 0){
            throw new Error(shortKeyword + ' keywords has a length of less than 3');
        }

        if (obj.paymentCount <= 3 && obj.paymentFree === 0 && obj.paymentCurrency === 'USD'){
            throw new Error('Quantity for payment must be greater than 3');
        }

        if (obj.paymentCount <= 3 && obj.paymentFree === 0 && obj.paymentCurrency === 'EUR'){
            throw new Error('Quantity for payment must be greater than 3');
        }

        if (obj.paymentCount <= 200 && obj.paymentFree === 0 && obj.paymentCurrency === 'RUB'){
            throw new Error('Quantity for payment must be greater than 200');
        }

        if (obj.paymentCount <= 70 && obj.paymentFree === 0 && obj.paymentCurrency === 'CZK'){
            throw new Error('Quantity for payment must be greater than 70');
        }

        if (obj.paymentCount <= 0 && obj.paymentFree === 0){
            throw new Error('Quantity for payment must be greater than 0');
        }

        if (!obj.registered && obj.userEmail){
            var registered = await authModel.isEmailRegistered(obj.userEmail);
            if (registered){
                throw new Error('Email ' + obj.userEmail + ' is already registered');
            }

            var userPass = generatePassword(11);
            try {
                var user = await pool.query(`INSERT INTO users (isDoctor, email, firstLastName, password, aboutMe, avatarPath, experience, specializations, dateRegister) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                    [0, obj.userEmail, null, userPass, '', '', '', '']);
            } catch (e) {
                throw e;
            }

            if (user.insertId > 0){
                try {
                    var update = await pool.query(`UPDATE users SET firstLastName = ? WHERE id = ?`,
                        ['user' + user.insertId, user.insertId]);
                } catch (e) {
                    throw e;
                }

                let emailResponse = emailModel.registerUser(obj.userEmail, userPass);

                obj.registered = user.insertId;
            }
            else {
                throw new Error ('Can\'t insert user');
            }
        }

        try {
            var result = await pool.query(`INSERT INTO questions (title, userId, sectionOfMedecine, text, keyword, paymentFree, paymentCount, paymentCurrency, paymentType, paymentCardName, paymentCardNumber, paymentCardCvv, paymentCardDate, paymentCardYear, datePost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                [obj.titleOfQuestion, obj.registered, obj.sectionOfMedicine, obj.questionText, obj.questionKeyword, obj.paymentFree, obj.paymentCount, obj.paymentCurrency, obj.paymentType, obj.paymentCardName, obj.paymentCardNumber, obj.paymentCardCVV, obj.paymentCardDate, obj.paymentCardYear]);
        } catch (e) {
            throw e;
        }

        if (result.insertId > 0){
            if (obj.questionFiles.length > 0){

                var filesString = '';

                for (var i = 0; i < obj.questionFiles.length; i++) {
                    if (i !== 0) {
                        filesString += ',';
                    }
                    filesString += result.insertId + '/' + obj.questionFiles[i].name;

                    try {
                        var fileName = path.join(__dirname, `../public/images/questions/${result.insertId}/${obj.questionFiles[i].name}`);

                        const folders = fileName.split(path.sep).slice(0, -1);
                        if (folders.length) {
                            // create folder path if it doesn't exist
                            folders.reduce((last, folder) => {
                                const folderPath = last ? last + path.sep + folder : folder;
                                if (!fs.existsSync(folderPath)) {
                                    fs.mkdirSync(folderPath)
                                }
                                return folderPath
                            })
                        }

                        await fs.writeFileSync(fileName, obj.questionFiles[i].FILE,);
                    } catch (e) {
                        throw e
                    }
                }

                console.log('files:' + filesString);

                try {
                    var res = await pool.query(`UPDATE questions SET files = ? WHERE id = ?`, [filesString, result.insertId]);
                } catch (e) {
                    throw e;
                }
            }

            if (obj.paymentType === 'card' || obj.paymentFree === 1) {
                try {
                    var result = await pool.query(`UPDATE questions SET active = 1 WHERE id = ?`,[result.insertId]);
                } catch (e) {
                    throw e;
                }
            }

            if (obj.paymentFree === 1) {
                try {
                    var result = await pool.query(`UPDATE questions SET paymentCount = 0 WHERE id = ?`,[result.insertId]);
                } catch (e) {
                    throw e;
                }
            }

            console.log('return', obj.userEmail, userPass);
            return {id: result.insertId, email: obj.userEmail, password: userPass};
        }
        else {
            throw new Error('Can\'t insert question');
        }
    }

    async closeQuestion (id) {
        console.log('closeQuestion');

        try {
            var answers = await pool.query(`SELECT answers.*, questions.paymentCurrency, questions.paymentCount FROM answers LEFT JOIN questions ON idQuestion = questions.id WHERE idQuestion = ? AND trueAnswer = 1`, [id]);
        } catch (e) {
            throw e;
        }

        console.log(JSON.stringify(answers));

        if (answers.length > 0){
            try {
                var update = await pool.query(`UPDATE questions SET active = 0 WHERE id = ?`, [id]);
            } catch (e) {
                throw e;
            }

            var curr = answers[0].paymentCurrency;
            var count = new Big(answers[0].paymentCount).times(0.7).div(answers.length).toFixed(2);

            console.log(curr, count);

            for (var i = 0; i < answers.length; i++) {
                try {
                    var result2 = await pool.query(`SELECT doctorsBalance.USD, doctorsBalance.EUR, doctorsBalance.RUB, doctorsBalance.CZK FROM doctorsBalance WHERE userId = ?`, [answers[i].idDoctor]);
                } catch (e) {
                    throw e;
                }

                console.log('answer: ' + JSON.stringify(answers[i]) + 'doctor: ' + JSON.stringify(result2));

                if (result2.length > 0){
                    try {
                        if (curr === 'USD'){
                            var result3 = await pool.query(`UPDATE doctorsBalance SET USD = ? WHERE userId = ?`, [new Big(result2[0].USD).plus(count).toFixed(2), answers[i].idDoctor]);
                        } else if (curr === 'EUR'){
                            var result3 = await pool.query(`UPDATE doctorsBalance SET EUR = ? WHERE userId = ?`, [new Big(result2[0].EUR).plus(count).toFixed(2), answers[i].idDoctor]);
                        } else if (curr === 'RUB'){
                            var result3 = await pool.query(`UPDATE doctorsBalance SET RUB = ? WHERE userId = ?`, [new Big(result2[0].RUB).plus(count).toFixed(2), answers[i].idDoctor]);
                        } else if (curr === 'CZK'){
                            var result3 = await pool.query(`UPDATE doctorsBalance SET CZK = ? WHERE userId = ?`, [new Big(result2[0].CZK).plus(count).toFixed(2), answers[i].idDoctor]);
                        } else if (curr === 'BTC'){
                            var result3 = await pool.query(`UPDATE doctorsBalance SET BTC = ? WHERE userId = ?`, [new Big(result2[0].BTC).plus(count).toFixed(2), answers[i].idDoctor]);
                        } else if (curr === 'BCH'){
                            var result3 = await pool.query(`UPDATE doctorsBalance SET BCH = ? WHERE userId = ?`, [new Big(result2[0].BCH).plus(count).toFixed(2), answers[i].idDoctor]);
                        } else if (curr === 'DAI'){
                            var result3 = await pool.query(`UPDATE doctorsBalance SET DAI = ? WHERE userId = ?`, [new Big(result2[0].DAI).plus(count).toFixed(2), answers[i].idDoctor]);
                        } else if (curr === 'ETH'){
                            var result3 = await pool.query(`UPDATE doctorsBalance SET ETH = ? WHERE userId = ?`, [new Big(result2[0].ETH).plus(count).toFixed(2), answers[i].idDoctor]);
                        } else if (curr === 'LTC'){
                            var result3 = await pool.query(`UPDATE doctorsBalance SET LTC = ? WHERE userId = ?`, [new Big(result2[0].LTC).plus(count).toFixed(2), answers[i].idDoctor]);
                        } else if (curr === 'USDC'){
                            var result3 = await pool.query(`UPDATE doctorsBalance SET USDC = ? WHERE userId = ?`, [new Big(result2[0].USDC).plus(count).toFixed(2), answers[i].idDoctor]);
                        }
                    } catch (e) {
                        throw e;
                    }
                } else {
                    throw new Error('doctor\'s balance is not found');
                }
            }
        } else {
            throw new Error('answers is not found');
        }
    }

    async postAnswer (obj) {
        console.log('postAnswer');
        try {
            var result = await pool.query(`INSERT INTO answers (idQuestion, idDoctor, answerText, datePost, likesCount) VALUES (?, ?, ?, NOW(), ?)`,
                [obj.idQuestion, obj.idDoctor, obj.textAnswer, '']);
        } catch (e) {
            throw e;
        }

        try {
            var res = await pool.query(`SELECT users.firstLastName, users.email FROM users LEFT JOIN questions ON questions.userId = users.id WHERE questions.id = ?`, [obj.idQuestion]);
        } catch (e) {
            throw e;
        }

        if (result.insertId > 0){
            let email = emailModel.newAnswer(res[0].email, res[0].firstLastName, obj.textAnswer);

            return 'ok'
        }
        else {
            return new Error('Can\'t insert answer');
        }
    }

    async getNameById (id) {
        try {
            var res = await pool.query(`SELECT users.firstLastName, users.avatarPath FROM users WHERE id = ?`, [id]);
        } catch (e) {
            throw e;
        }
    }

    async loadFilesInMessage (files, dialogId) {
        var filesString = ``;

        for (var i = 0; i < files.length; i++) {
            if (i !== 0 && i !== files.length - 1) {
                filesString += ', ';
            }
            filesString +=  `<a style="color: #4579f0" href="/images/dialogs/${dialogId}/${files[i].name}">${files[i].name}</a>`;

            try {
                var fileName = path.join(__dirname, `../public/images/dialogs/${dialogId}/${files[i].name}`);

                const folders = fileName.split(path.sep).slice(0, -1);
                if (folders.length) {
                    // create folder path if it doesn't exist
                    folders.reduce((last, folder) => {
                        const folderPath = last ? last + path.sep + folder : folder;
                        if (!fs.existsSync(folderPath)) {
                            fs.mkdirSync(folderPath)
                        }
                        return folderPath
                    })
                }

                await fs.writeFileSync(fileName, files[i].FILE,);
            } catch (e) {
                throw e
            }
        }

        return filesString;
    }

    async searchQuestion (obj) {
        console.log('searchQuestion');
        try {
            var result = await pool.query(`SELECT questions.*, MONTHNAME(datePost) AS month, DATE_FORMAT(datePost, '%e') AS day, YEAR(datePost) AS fullYear, TIME_FORMAT(datePost, '%H:%i') AS time, users.firstLastName AS userName, users.avatarPath FROM questions LEFT JOIN users ON questions.userId = users.id WHERE questions.text LIKE ? OR questions.title LIKE ? ORDER BY questions.datePost DESC`, [`%${obj.searchString}%`, `%${obj.searchString}%`]);
        } catch (e) {
            throw e;
        }
        for (var i = 0; i < result.length; i++){
            try {
                var res = await pool.query(`SELECT answers.*, MONTHNAME(datePost) AS month, DATE_FORMAT(datePost, '%e') AS day, YEAR(datePost) AS fullYear, TIME_FORMAT(datePost, '%H:%i') AS time, users.firstLastName, users.avatarPath, users.specializations FROM answers LEFT JOIN users ON answers.idDoctor = users.id WHERE idQuestion = ? ORDER BY answers.datePost DESC`, [result[i].id]);
            } catch (e) {
                throw e;
            }

            if (res.length > 0) {
                result[i].answers = res;
            }
        }
        return result;
    }

    async searchByTag (obj) {
        console.log('searchQuestion');
        try {
            var result = await pool.query(`SELECT questions.*, MONTHNAME(datePost) AS month, DATE_FORMAT(datePost, '%e') AS day, YEAR(datePost) AS fullYear, TIME_FORMAT(datePost, '%H:%i') AS time, users.firstLastName AS userName, users.avatarPath FROM questions LEFT JOIN users ON questions.userId = users.id WHERE questions.keyword LIKE ? ORDER BY questions.datePost DESC`, [`%${obj.searchString}%`]);
        } catch (e) {
            throw e;
        }
        for (var i = 0; i < result.length; i++){
            try {
                var res = await pool.query(`SELECT answers.*, MONTHNAME(datePost) AS month, DATE_FORMAT(datePost, '%e') AS day, YEAR(datePost) AS fullYear, TIME_FORMAT(datePost, '%H:%i') AS time, users.firstLastName, users.avatarPath, users.specializations FROM answers LEFT JOIN users ON answers.idDoctor = users.id WHERE idQuestion = ? ORDER BY answers.datePost DESC`, [result[i].id]);
            } catch (e) {
                throw e;
            }

            if (res.length > 0) {
                result[i].answers = res;
            }
        }
        return result;
    }

    async getAllDoctors () {
        console.log('getAllDoctors');
        try {
            var res = await pool.query(`SELECT users.* FROM users WHERE isDoctor = 1`, []);
        } catch (e) {
            throw e;
        }

        return res;
    }

    async searchDoctors (obj) {
        console.log('searchDoctors');
        var doctors = [];

        for (var i = 0; i < obj.searchBySpecializ.length; i++) {
            try {
                var res = await pool.query(`SELECT users.* FROM users WHERE isDoctor = 1 AND specializations LIKE ?`, [`%${obj.searchBySpecializ[i]}%`]);
            } catch (e) {
                throw e;
            }

            for (var j = 0; j < res.length; j++){
                var include = 0;
                for (var k = 0; k < doctors.length; k++){
                    if (res[j].id === doctors[k].id){
                        include++
                    }
                }
                if (include === 0){
                    doctors.push(res[j]);
                }
            }
        }

        return doctors;
    }

    async payToDoctor (obj) {

        try {
            var balance = await pool.query(`SELECT doctorsBalance.* FROM doctorsBalance WHERE userId = ?`, [obj.doctorId]);
        } catch (e) {
            throw e;
        }

        if (balance.length > 0){
            try {
                var result = await pool.query(`INSERT INTO paymentsForConsultations (doctorId, userId, paymentCount, paymentCurrency, paymentType, paymentCardName, paymentCardNumber, paymentCardDate, paymentCardYear, paymentCardCVV) VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [obj.doctorId, obj.userId, obj.paymentCount, balance[0].preferredCurrency, obj.paymentType, obj.paymentCardName, obj.paymentCardNumber, obj.paymentCardDate, obj.paymentCardYear, obj.paymentCardCVV]);
            } catch (e) {
                throw e;
            }

            if (obj.paymentType === 'card') {
                console.log('send email');
                authModel.sendMailForConsiltation(result.insertId);
                console.log('after send email');
                try {
                    var result = await pool.query("UPDATE paymentsForConsultations SET paymentComplete = 1 WHERE id = ?", [result.insertId])
                } catch (e) {
                    throw e
                }

                try {
                    if (balance[0].preferredCurrency === 'USD'){
                        var result3 = await pool.query(`UPDATE doctorsBalance SET USD = ? WHERE userId = ?`, [new Big(obj.paymentCount).times(0.7).plus(balance[0].USD).toFixed(2), obj.doctorId]);
                    } else if (balance[0].preferredCurrency === 'EUR'){
                        var result3 = await pool.query(`UPDATE doctorsBalance SET EUR = ? WHERE userId = ?`, [new Big(obj.paymentCount).times(0.7).plus(balance[0].EUR).toFixed(2), obj.doctorId]);
                    } else if (balance[0].preferredCurrency === 'RUB'){
                        var result3 = await pool.query(`UPDATE doctorsBalance SET RUB = ? WHERE userId = ?`, [new Big(obj.paymentCount).times(0.7).plus(balance[0].RUB).toFixed(2), obj.doctorId]);
                    }
                    else if (balance[0].preferredCurrency === 'CZK'){
                        var result3 = await pool.query(`UPDATE doctorsBalance SET CZK = ? WHERE userId = ?`, [new Big(obj.paymentCount).times(0.7).plus(balance[0].CZK).toFixed(2), obj.doctorId]);
                    }
                } catch (e) {
                    throw e;
                }
            }
            return result.insertId
        } else {
            throw new Error('doctor\'s balance is not found');
        }
    }

    async loadAllMessages (obj) {
        console.log('loadAllMessages');
        if (obj.isDoctor === 1){
            console.log(obj.myId + ' is Doctor');
            try {
                var result = await pool.query(`SELECT users.firstLastName, users.avatarPath, users.id, paymentsForConsultations.paymentComplete, paymentsForConsultations.message, paymentsForConsultations.unreadCountDoctor, paymentsForConsultations.id AS dialogId FROM paymentsForConsultations LEFT JOIN users ON paymentsForConsultations.userId = users.id WHERE doctorId = ?`,
                    [obj.myId]);
            } catch (e) {
                throw e;
            }
        } else {
            console.log(obj.myId + ' is not Doctor');
            try {
                var result = await pool.query(`SELECT users.firstLastName, users.avatarPath, users.id, paymentsForConsultations.paymentComplete, paymentsForConsultations.message, paymentsForConsultations.unreadCountUser, paymentsForConsultations.id AS dialogId FROM paymentsForConsultations LEFT JOIN users ON paymentsForConsultations.doctorId = users.id WHERE userId = ?`,
                    [obj.myId]);
            } catch (e) {
                throw e;
            }
        }

        return result;
    }

    async loadMessagesById (obj){
        console.log('loadMessagesById');
        if (obj.isDoctor === 1){
            console.log(obj.myId + ' is Doctor');
            try {
                var result = await pool.query(`SELECT users.firstLastName, users.avatarPath, users.id, users.specializations, users.experience, paymentsForConsultations.id AS dialogId FROM paymentsForConsultations LEFT JOIN users ON paymentsForConsultations.userId = users.id WHERE doctorId = ? AND userId = ?`,
                    [obj.myId, obj.personId]);
            } catch (e) {
                throw e;
            }
        } else {
            console.log(obj.myId + ' is not Doctor');
            try {
                var result = await pool.query(`SELECT users.firstLastName, users.avatarPath, users.id, users.specializations, users.experience, paymentsForConsultations.id AS dialogId FROM paymentsForConsultations LEFT JOIN users ON paymentsForConsultations.doctorId = users.id WHERE userId = ? AND doctorId = ?`,
                    [obj.myId, obj.personId]);
            } catch (e) {
                throw e;
            }
        }

        if (result.length > 0){
            return result[0];
        } else {
            throw new Error('Can\'t find messages')
        }
    }

    async sendMessage (dialogId, message, userId) {
        console.log('sendMessage');

        try {
            var isDoctor = await pool.query(`SELECT users.isDoctor FROM users WHERE id = ?`,
                [userId]);
        } catch (e) {
            throw e;
        }

        if (isDoctor[0].isDoctor === 1){
            try {
                var count = await pool.query(`SELECT paymentsForConsultations.unreadCountUser FROM paymentsForConsultations WHERE id = ?`,
                    [dialogId]);
            } catch (e) {
                throw e;
            }

            try {
                var result = await pool.query(`UPDATE paymentsForConsultations SET message = ?, unreadCountUser = ? WHERE id = ?`,
                    [message, count[0].unreadCount + 1, dialogId]);
            } catch (e) {
                throw e;
            }
        } else {
            try {
                var count = await pool.query(`SELECT paymentsForConsultations.unreadCountDoctor FROM paymentsForConsultations WHERE id = ?`,
                    [dialogId]);
            } catch (e) {
                throw e;
            }

            try {
                var result = await pool.query(`UPDATE paymentsForConsultations SET message = ?, unreadCountDoctor = ? WHERE id = ?`,
                    [message, count[0].unreadCount + 1, dialogId]);
            } catch (e) {
                throw e;
            }
        }
    }

    async allMessageReads (dialogId, isDoctor) {
        console.log('read messages ', dialogId);
        if (isDoctor === 1){
            try {
                var result = await pool.query(`UPDATE paymentsForConsultations SET unreadCountDoctor = 0 WHERE id = ?`,
                    [dialogId]);
            } catch (e) {
                throw e;
            }
        } else {
            try {
                var result = await pool.query(`UPDATE paymentsForConsultations SET unreadCountUser = 0 WHERE id = ?`,
                    [dialogId]);
            } catch (e) {
                throw e;
            }
        }

    }

    async trueAnswer (obj){
        console.log('true answer');
        try {
            var result1 = await pool.query(`SELECT answers.* FROM answers WHERE id = ? AND trueAnswer = 1`,
                [obj.questionId]);
        } catch (e) {
            throw e;
        }

        if (result1.length < 4){
            try {
                var result2 = await pool.query(`UPDATE answers SET trueAnswer = ? WHERE id = ?`,
                    [obj.trueAnswer === 1 ? 0 : 1, obj.answerId]);
            } catch (e) {
                throw e;
            }
            return 'ok'
        } else {
            throw new Error('There can be no more than 4 true answers');
        }
    }

    async alreadyPaymentForConsultation (obj) {
        try {
            var result = await pool.query(`SELECT paymentsForConsultations.id FROM paymentsForConsultations WHERE doctorId = ? AND userId = ?`,
                [obj.doctorId, obj.myId]);
        } catch (e) {
            throw e;
        }

        if (result.length > 0) {
            return 1
        }
        else {
            return 0
        }
    }

    async likeAnswer (obj) {
        try {
            var likes = await pool.query(`SELECT answers.likesCount FROM answers WHERE id = ?`,
                [obj.answerId]);
        } catch (e) {
            throw e;
        }

        if (likes.length > 0){
            try {
                var result = await pool.query(`UPDATE answers SET likesCount = ? WHERE id = ?`,
                    [likes[0].likesCount && likes[0].likesCount !== '' ? likes[0].likesCount + '|' + obj.idUser : obj.idUser, obj.answerId]);
            } catch (e) {
                throw e;
            }
            return 'ok'
        } else {
            throw new Error('answer is not found');
        }
    }

    async searchByFilters (obj) {
        console.log('searchByFilters');
        var addSql = '';
        if (obj.sectionOfMedicine !== ''){
            addSql += ` WHERE questions.sectionOfMedecine = '${obj.sectionOfMedicine}' `;
        }
        console.log(obj.keywords);
        if (obj.keywords !== '') {
            console.log('hey!', obj.keywords);
            if (addSql !== ''){
                addSql += ' AND '
            }
            else {
                addSql += ' WHERE '
            }
            addSql += '(';
            var keywords = obj.keywords.split(',');
            for (var i = 0; i < keywords.length; i++){
                if (i !== 0) {
                    addSql += ' OR'
                }
                addSql+= ` questions.keyword LIKE '%${keywords[i].trim()}%' `
            }
            addSql += ')';
        }
        if (obj.currency !== ''){
            if (addSql !== ''){
                addSql += ' AND '
            }
            else {
                addSql += ' WHERE '
            }
            addSql += ` questions.paymentCurrency = '${obj.currency}' `;
        }

        console.log('add sql ', addSql);

        try {
            var result = await pool.query(`SELECT questions.*, MONTHNAME(datePost) AS month, DATE_FORMAT(datePost, '%e') AS day, YEAR(datePost) AS fullYear, TIME_FORMAT(datePost, '%H:%i') AS time, users.firstLastName AS userName, users.avatarPath FROM questions LEFT JOIN users ON questions.userId = users.id ${addSql} ORDER BY questions.datePost DESC`);
        } catch (e) {
            throw e;
        }

        return result;
    }
}

module.exports = new QuestionsModel();