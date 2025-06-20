var mysql = require('mysql');
let pool = require('./DBConnectionModel').returnPoolConnection();
var emailModel = require('./EmailModel');
var coinbaseModel = require('./CoinBaseModel');
var fs = require('fs');
var path = require('path');

class AuthModel {
    constructor() {

    }

    async registerUser(obj) {

        console.log('registerUser');

        var registered = await this.isEmailRegistered(obj.userEmail);
        if (registered){
            console.log('Email ' + obj.userEmail + ' is already registered');
            throw new Error('Email ' + obj.userEmail + ' is already registered');
        }

        if (obj.password !== obj.repeatPassword) {
            return new Error('Passwords do not match');
        }
        else if (obj.password.length < 6 || obj.password.length > 200){
            return new Error('Your password must be at least 6 characters and no more than 200 characters in length');
        }
        else if (!obj.email.includes('@') || !obj.email.includes('.')){
            return new Error('Your email incorrect');
        }
        else if (obj.email.length < 4 || obj.email.length > 200){
            return new Error('Your email must be at least 6 characters and no more than 200 characters in length');
        }
        else if (obj.firstLastName.length < 4 || obj.firstLastName.length > 300){
            return new Error('Your full name must be at least 4 characters and no more than 300 characters in length');
        }
        else if (obj.experience.length > 400){
            return new Error('Your experience should be no more than 400 characters in length');
        }

        try {
            var result = await pool.query(`INSERT INTO users (isDoctor, email, firstLastName, password, aboutMe, avatarPath, experience, specializations, dateRegister) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                [1, obj.email, obj.firstLastName, obj.password, obj.aboutMe, '', obj.experience, obj.specializations]);
        } catch (e) {
            throw e;
        }

        if (result.insertId > 0) {
            try {
                var balance = await pool.query(`INSERT INTO doctorsBalance (userId) VALUES (?)`,
                    [result.insertId]);
            } catch (e) {
                throw e;
            }

            if (obj.avatarFile.FILE) {
                try {
                    var fileName = path.join(__dirname, `../public/images/users/${result.insertId}.${obj.avatarFile.type}`);

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

                    await fs.writeFileSync(fileName, obj.avatarFile.FILE,);
                } catch (e) {
                    throw e
                }

                try {
                    var res = await pool.query('UPDATE users SET avatarPath = ? WHERE id = ?', [`${result.insertId}.${obj.avatarFile.type}`, result.insertId])
                }  catch (e) {
                    throw e
                }
            }

            let emailResponse = emailModel.registeredDoctor(obj.email, obj.password);

            return result;
        }
        else {
            return new Error('Can\'t insert user');
        }
    }

    async authByEmailPass (email, password) {
        console.log('authByEmailPass');

        if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
            console.log('password', password, email);
            return new Error('validation error in auth modul')
        }

        if (password.length <= 5) {
            console.log('password', password);
            return new Error('Password is very short (min length is 6)');
        }

        if (email.length < 5 || email.includes("@") === false || email.includes(".") === false) {
            console.log('email', email);
            return new Error('Invalid email')
        }


        var re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        if (re.test(email) === false) {
            console.log('email', email);
            return new Error('Invalid email symbols')
        }
        console.log('authByEmailPass');
        try {
            var result = await pool.query(`SELECT * FROM users WHERE email = ?`, [email])
        }  catch (e) {
            console.log(e.message);
            throw e
        }

        if (result.length > 0 && result[0].id){

            try {
                var res = await pool.query(`SELECT users.* FROM users WHERE email = ? AND password = ?`, [email, password])
            }  catch (e) {
                throw e
            }

            if (res.length > 0 && res[0]) {
                if (res[0].isDoctor === 1){
                    try {
                        var currency = await pool.query(`SELECT doctorsBalance.* FROM doctorsBalance WHERE userId = ?`, [res[0].id])
                    }  catch (e) {
                        throw e
                    }
                    res[0].balance = currency[0];
                }
                return res[0]
            } else {
                return new Error('Incorrect email/password combination')
            }
        }
        else {
            console.log('This email is not registered');
            return new Error('This email is not registered');
        }
    }

    async updateUserData (obj) {
        console.log('updateUserData');

        var user = await this.authByEmailPass(obj.userEmail, obj.userPass);
        console.log('***',obj.currency);
        if (obj.currency !== ''){
            try {
                var result = await pool.query(`UPDATE doctorsBalance SET preferredCurrency = ? WHERE userId = ?`, [obj.currency, user.id]);
            }  catch (e) {
                throw e
            }
        }


        if (user && user.id) {
            try {
                var result = await pool.query(`UPDATE users SET aboutMe = ?, email = ?, firstLastName = ?, experience = ?, specializations = ? WHERE id = ?`, [obj.aboutMe, obj.email,  obj.firstLastName, obj.experience, obj.specializations, user.id]);
            }  catch (e) {
                throw e
            }
            return 'ok'
        }
        else {
            return new Error('Error when authorization');
        }
    }

    async changePassword (obj) {
        console.log('changePassword');

        if (obj.oldPassword !== obj.userPass) {
            return new Error('Old password incorrect');
        }

        var user = await this.authByEmailPass(obj.userEmail, obj.userPass);

        if (user && user.id) {
            try {
                var result = await pool.query(`UPDATE users SET password = ? WHERE id = ?`, [obj.newPassword, user.id]);
            }  catch (e) {
                throw e
            }
            return 'ok'
        }
        else {
            return new Error('Error when authorization');
        }
    }

    async changeAvatar (obj) {
        console.log('changeAvatar');
        var user = await this.authByEmailPass(obj.userEmail, obj.userPass);

        if (user && user.id) {
            try {
                var fileName = path.join(__dirname, `../public/images/users/${user.id}.${obj.avatarFile.type}`);

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

                await fs.writeFileSync(fileName, obj.avatarFile.FILE,);
            } catch (e) {
                throw e
            }

            try {
                var res = await pool.query('UPDATE users SET avatarPath = ? WHERE id = ?', [`${user.id}.${obj.avatarFile.type}`, user.id])
            }  catch (e) {
                throw e
            }
            return 'ok'
        }
        else {
            return new Error('Error when authorization');
        }
    }

    async sendMailForConsiltation (paymentId) {
        try {
            var doctor = await pool.query(`SELECT users.email, users.firstLastName AS name FROM paymentsForConsultations LEFT JOIN users ON doctorId = users.id WHERE paymentsForConsultations.id = ?`, [paymentId]);
        } catch (e) {
            throw e;
        }

        console.log(doctor[0].email, doctor[0].name);

        try {
            var user = await pool.query(`SELECT users.email, users.firstLastName AS name FROM paymentsForConsultations LEFT JOIN users ON userId = users.id WHERE paymentsForConsultations.id = ?`, [paymentId]);
        } catch (e) {
            throw e;
        }

        console.log(user[0].email, user[0].name);

        if (!doctor || !doctor[0] || !doctor[0].email || !doctor[0].name || !user || !user[0] || !user[0].email || !user[0].name){
            throw new Error ('user or doctor not fount for send email');
        }

        let emailResponse = emailModel.newConsultation(doctor[0].email, doctor[0].name, user[0].name);
        let emailResponse2 = emailModel.newConsultationToUser(user[0].email, doctor[0].name, user[0].name);
    }

    async isEmailRegistered (email) {
        try {
            var users = await pool.query(`SELECT users.* FROM users WHERE email = ?`, [email]);
        } catch (e) {
            throw e;
        }

        console.log('isEmailRegistered', users, users.length > 0);

        return users.length > 0;
    }

    async giveBalanceInOneCurrency (id){
        try {
            var currency = await pool.query(`SELECT doctorsBalance.* FROM doctorsBalance WHERE userId = ?`, [id])
        }  catch (e) {
            throw e
        }

        console.log('currency', currency[0].preferredCurrency);

        var Client = require('coinbase').Client;
        var client = new Client({'apiKey': 'c57b30f5-b7e4-4a9c-a26d-d1dc5d8131cf',
            'apiSecret': 'API SECRET'});

        await client.getExchangeRates({'currency': currency[0].preferredCurrency}, function(err, rates) {
                    if (err) {
                        console.log(err);
                        throw err;
                    } else {
                        console.log('exchangesRate');
                var balance = 0;
                if (currency[0] && rates.data.rates){
                    if (currency[0].RUB  > 0){balance += currency[0].RUB /rates.data.rates.RUB ;}
                    if (currency[0].USD  > 0){balance += currency[0].USD /rates.data.rates.USD ;}
                    if (currency[0].EUR  > 0){balance += currency[0].EUR /rates.data.rates.EUR ;}
                    if (currency[0].CZK  > 0){balance += currency[0].CZK /rates.data.rates.CZK ;}
                    if (currency[0].BTC  > 0){balance += currency[0].BTC /rates.data.rates.BTC ;}
                    if (currency[0].BCH  > 0){balance += currency[0].BCH /rates.data.rates.BCH ;}
                    if (currency[0].DAI  > 0){balance += currency[0].DAI /rates.data.rates.DAI ;}
                    if (currency[0].ETH  > 0){balance += currency[0].ETH /rates.data.rates.ETH ;}
                    if (currency[0].LTC  > 0){balance += currency[0].LTC /rates.data.rates.LTC ;}
                    if (currency[0].USDC > 0){balance += currency[0].USDC/rates.data.rates.USDC;}
                }
                console.log(balance);
                return {currency: currency[0].preferredCurrency, balance: balance}
            }
        });
    }
}

module.exports = new AuthModel();