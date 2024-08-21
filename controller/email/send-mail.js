const nodemailer = require('nodemailer');

const sendMail = async (to, subject, html, cc) => {
    return new Promise(async (resolve, reject) => {
        // Create a nodemailer transporter using your email service provider's SMTP settings
        const transporter = nodemailer.createTransport({
            host: 'webversesolution.com',
            port: 465,
            auth: {
                user: 'creerlio@webversesolution.com',
                pass: 'MjP0I+Ob5NGP'
            }
        });

        // Construct the email message
        const mailOptions = cc ? {
            from: 'creerlio@webversesolution.com',
            to,
            subject,
            html,
            cc
        } : {
            from: 'creerlio@webversesolution.com',
            to: to,
            subject: subject,
            html: html
        };

        // Send the email
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
            // Add this inside the sendMail function, before the transporter.sendMail call
            console.log('Sending email to:', to);

        });
    });
};

module.exports = sendMail;