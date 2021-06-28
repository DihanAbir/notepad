const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper 
const sendEmail = async (options) => {
    // Create reusable transporte object using the default SMTP transporter
    const transporter = nodemailer.createTransport({ 
        host : process.env.SMTP_HOST,
        port : process.env.SMTP_PORT,
        auth : {
            user : process.env.SMTP_EMAIL, //generate ethereal user
            pass : process.env.SMTP_PASSWORD, //generate etheral password 
        }
    })

    // Send mail with defined transport object
    const message = ({
        from : `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // sender address
        to : options.email,
        subject : options.subject,
        text : options.message
    })

    const info = await transporter.sendMail(message);
    console.log("Message sent : %s", info.messageId);
} 


module.exports = sendEmail;