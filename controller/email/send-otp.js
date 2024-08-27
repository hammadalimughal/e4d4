// const Otp = require('../../Schema/OTP')
const sendMail = require('./send-mail')
const sendOtp = async (user, otpCode) => {
    const to = user.primaryEmail.email
    // const to = `codemark.codes@gmail.com`
    const subject = `One Time PIN (OTP) to Reset Your Account Password`
    var otpHtml = ''
    const arrayCode = Array.from((otpCode).toString())
    arrayCode.forEach((digit) => {
        otpHtml += `<td style="border: 1px solid rgba(0,0,0,0.2); border-radius: 5px; margin: 3px;">${digit}</td>`
    })
    const html = `<table bgcolor="#e5e5e5" width="100%" border="0" cellpadding="50" cellspacing="0">
    <tbody>
        <tr>
            <td align="center" style="max-width: 500px; width: 100%;">
                <table border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                        <tr>
                            <td width="500" bgcolor="#ffffff" style="width:600px">
                                <table border="0" cellpadding="0" cellspacing="0">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <table border="0" cellpadding="15" cellspacing="0">
                                                    <tbody>
                                                        <tr>
                                                            <td align="center" width="600"
                                                                style="width:600px;padding-bottom:2px">
                                                                    <img src="https://usdoorsdirect.org/images/logo.png"
                                                                        width="200"
                                                                        style="padding:0;object-fit: contain; max-width: 100%;">
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="center" width="600" height="1"
                                                                style="width:600px;padding:0">
                                                                <hr />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="width:600px;padding:0">
                                                <table border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff">
                                                    <tbody>
                                                        <tr>
                                                            <td style="width:50px;text-align:left" align="left"
                                                                width="50"></td>
                                                            <td style="padding:0px;width:500px;text-align:left"
                                                                align="left" width="500">
                                                                <br>
                                                                <p
                                                                    style="padding:0px;font-size:21px;font-weight:bold">
                                                                    Hi, ${user.fullName}!</p>
                                                                <p style="padding:0px;font-size:16px">We noticed
                                                                    that there was an attempt to reset your
                                                                    Creerlio account. Please enter
                                                                    the following One Time PIN (<span
                                                                        class="il">OTP</span>) in the Creerlio Web to
                                                                    login: </p>
                                                                <br>
                                                            </td>
                                                            <td style="width:50px;text-align:right" align="right"
                                                                width="50"></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="width:600px;padding:0">
                                                <table border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff">
                                                    <tbody>
                                                        <tr>
                                                            <td style="width:50px;text-align:left" align="left"
                                                                width="50"></td>
                                                            <td style="padding:0px;width:500px;text-align:left"
                                                                align="left" width="500">
                                                                <table cellpadding="10" cellspacing="5">
                                                                    <tbody>
                                                                        <tr>${otpHtml}</tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                            <td style="width:50px;text-align:right" align="right"
                                                                width="50"></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="width:600px;padding:0">
                                                <table border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff">
                                                    <tbody>
                                                        <tr>
                                                            <td style="width:50px;text-align:left" align="left"
                                                                width="50"></td>
                                                            <td style="padding:0px;width:500px;text-align:left"
                                                                align="left" width="500">
                                                                <p style="font-size:16px">This <span
                                                                        class="il">OTP</span> is valid for
                                                                    <strong>5</strong> minutes
                                                                </p>
                                                                <br>
                                                            </td>
                                                            <td style="width:50px;text-align:right" align="right"
                                                                width="50"></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="width:600px;padding:0">
                                                <table border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff">
                                                    <tbody>
                                                        <tr>
                                                            <td style="width:50px;text-align:left" align="left"
                                                                width="50"></td>
                                                            <td style="width:500px;text-align:left" align="left"
                                                                width="500">
                                                                <p style="font-size:16px;font-weight:bold">If this
                                                                    wasn't you:</p>
                                                                <p style="font-size:16px">You Can Safely Ignore this
                                                                    Email, Don't share this code to anyone.</p>
                                                                <br>
                                                            </td>
                                                            <td style="width:50px;text-align:left" align="left"
                                                                width="50"></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="width:600px;padding:0">
                                                <table border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff">
                                                    <tbody>
                                                        <tr>
                                                            <td style="width:50px;text-align:left" align="left"
                                                                width="50"></td>
                                                            <td style="padding:0px;width:500px;text-align:left"
                                                                align="left" width="500">
                                                                <p style="font-size:16px">Thank You,</p>
                                                                <p style="font-size:16px;font-weight:bold">Creerlio
                                                                </p>
                                                                <br>
                                                            </td>
                                                            <td style="width:50px;text-align:right" align="right"
                                                                width="50"></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>`
    await sendMail(to, subject, html)
}
module.exports = sendOtp