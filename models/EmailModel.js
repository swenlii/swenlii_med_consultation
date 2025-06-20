var mysql = require('mysql');
var pool = require('./DBConnectionModel').returnPoolConnection();
var crypto = require('crypto');
var nodemailer = require('nodemailer');

class EmailModel {
    constructor() {
    }

    sendEmailToUser(emailObj) {
        return new Promise((resolve, reject) => {

            var transporter = nodemailer.createTransport({
                service: 'Yandex',
                auth: {
                    user: 'test_service@localcrypto.cloud',
                    pass: 'ZZjndaAzzkfZAAZh1x!'
                }
            });

            transporter.sendMail({
                from: 'test_service@localcrypto.cloud',
                to: emailObj.email,
                subject: emailObj.subject,
                html: emailObj.htmlText
            }, (error, infoSuccess) => {
                if (error) {
                    console.log("error in sending email: ", error);
                    return reject(error);
                } else {
                    console.log("success in sending email: ", infoSuccess);
                    return resolve(infoSuccess);
                }
            });
        })
    }

    async registeredDoctor (email, password) {
        console.log('registered doctor ', email, password);
        let emailObj = {
            email: email,
            subject: 'Thank you for registering for med-consultation.com!',
            htmlText: "We welcome you to the site medrevolushon.<br>" +
                "You are registered on our website as a doctor. This is your login information:<br>" +
                "<br>" +
                "<b>Email:</b> " + email + "<br>" +
                "<b>Password:</b> " + password+ "<br>" +
                "<br>" +
                "By accessing our site under your account, you will be able to answer questions, correspond with patients and manage your answers to questions."
        };


        try {
            let emailResponse = this.sendEmailToUser(emailObj)
        } catch (e) {
            throw e
        }
    }

    async newAnswer (email, name, text) {
        console.log('new answer', email, name, text);
        let emailObj = {
            email: email,
            subject: 'There is a new answer to your question!',
            htmlText: "Hello!<br>" +
                "There is a new answer to your question from Dr. " + name + ":<br>" +
                "<br>" +
                text
        };


        try {
            let emailResponse = this.sendEmailToUser(emailObj)
        } catch (e) {
            throw e
        }
    }

    async registerUser (email, password) {
        console.log('registerUser ', email, password);
        let emailObj = {
            email: email,
            subject: 'Thank you for registering for med-revolution.com!',
            htmlText: "We welcome you to the site medrevolushon.<br>" +
                "You are registered on our website as a patient. This is your login information:<br>" +
                "<br>" +
                "<b>Email:</b> " + email + "<br>" +
                "<b>Password:</b> " + password + "<br>" +
                "<br>" +
                "By accessing our site under your account, you can change your password, email, name, you can correspond with doctors and manage your questions."
        };


        try {
            let emailResponse = this.sendEmailToUser(emailObj)
        } catch (e) {
            throw e
        }
    }

    async newConsultation(email, doctorName, userName) {
        console.log('newConsultation', email, doctorName, userName);
        if (!email || !doctorName || !userName) {
            throw new Error('No recipients defined.');
        }

        let emailObj = {
            email: email,
            subject: 'You have ordered a consultation',
            htmlText: "Good day, " + doctorName + "!<br>" +
                "We inform you that the " + userName + " ordered a consultation with you."
        };
        console.log('send email ', JSON.stringify(emailObj));

        try {
            let emailResponse = this.sendEmailToUser(emailObj)
        } catch (e) {
            throw e
        }

        return 'all ok'
    }

    async newConsultationToUser(email, doctorName, userName) {
        console.log('newConsultationToUser', email, doctorName, userName);
        if (!email || !doctorName || !userName) {
            throw new Error('No recipients defined.');
        }

        let emailObj = {
            email: email,
            subject: 'You have ordered a consultation',
            htmlText: "Good day, " + userName + "!<br>" +
                "The payment for the consultation of Dr. " + doctorName + " was successful. <br>Now you can write a message to him."
        };
        console.log('send email ', JSON.stringify(emailObj));

        try {
            let emailResponse = this.sendEmailToUser(emailObj)
        } catch (e) {
            throw e
        }

        return 'all ok'
    }
}

module.exports = new EmailModel();