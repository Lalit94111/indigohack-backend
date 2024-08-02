const nodemailer = require('nodemailer');
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_SENDER_PASSWORD
    }
})


const sendMail =async (toEmail, subject, html) => {
    const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: toEmail,
        subject: subject,
        html: html
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.log('Error Sending Mail :' + err)
        else console.log('Email sent: ' + info.response);
    })
}

module.exports = sendMail