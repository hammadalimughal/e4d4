const nodemailer = require('nodemailer');

const sendMail = async (to, subject, html, cc) => {
    return new Promise(async (resolve, reject) => {
        // Create a nodemailer transporter with the necessary SMTP settings
        const transporter = nodemailer.createTransport({
            host: 'webversesolution.com',
            port: 465,
            secure: true, // Use true if you're using port 465 (SSL)
            auth: {
                user: 'creerlio@webversesolution.com',
                pass: 'MjP0I+Ob5NGP'
            },
            tls: {
                // Do not fail on invalid certs
                rejectUnauthorized: false
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
            // Log the email being sent
            console.log('Sending email to:', to);
        });
    });
};

module.exports = sendMail;
