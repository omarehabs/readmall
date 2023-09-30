const nodemailer = require('nodemailer');



async function sendVerificationEmail(sendTo, userId, verificationToken) {
    const from = process.env.AUTH_EMAIL;
    const transporter = nodemailer.createTransport({
        host: process.env.AUTH_HOST,

        auth: {
            user: from,
            pass: process.env.AUTH_PASS
        }
    });

    const mailOptions = {
        subject: 'please verfiy your email - READMALL',
        html:
            `<p> please verifi your email, this link expires in 4 hours </p>
        <p> click <a  href="${process.env.FORWARD_EMAIL_URL}/${userId}/${verificationToken}" > here </a></p>`,
        from,
        to: sendTo,
    };
    return await transporter.sendMail(mailOptions);
}



async function sendResetPasswordEmail(sendTo, userId, verificationToken) {
    console.log(userId, verificationToken);
    const from = process.env.AUTH_EMAIL;
    const transporter = nodemailer.createTransport({
        host: process.env.AUTH_HOST,

        auth: {
            user: from,
            pass: process.env.AUTH_PASS
        }
    });

    const mailOptions = {
        subject: 'please verfiy your email to reset your password - READMALL',
        html:
            `<p> a link below to reset password but be carefull it expires in 20 minutes and you can only use it once </p>
        <p> click <a  href="${process.env.RESET_PASSWORD_REDIRECT_LINK}?userId=${userId}&token=${verificationToken}" > here </a></p>`,
        from,
        to: sendTo,
    };
    return await transporter.sendMail(mailOptions);
}


module.exports = { sendVerificationEmail, sendResetPasswordEmail };