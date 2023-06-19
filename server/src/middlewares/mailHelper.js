const nodemailer = require('nodemailer');
require('dotenv').config();
const dbConnection = require('../db/connection');
const queries = require('../db/queries');

// eslint-disable-next-line consistent-return
exports.sendVerificationMail = async (req, res, next) => {
  const mail = req.mail ?? req.body.mail; // must be exist

  const getVerificationIdQuery = queries.queryList.GET_VERIFICATION_ID_QUERY;
  const values = [mail];
  const queryResp = await dbConnection.dbQuery(getVerificationIdQuery, values);
  if (queryResp.rows.length === 0) return res.sendStatus(400);

  const verificationId = queryResp.rows[0].verification_id;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SENDER_GMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.SENDER_GMAIL,
    to: mail,
    subject: 'Account Activation - PMT',
    html: `<p>Please click on the following link to verify your email address:</p>
    <a href="${process.env.HOME_PAGE_URL}?activate=${verificationId}">link</a>`,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    else console.log(info);
  });

  next();
};

exports.sendResetPasswordMail = (req, res, next) => {
  const mail = req.mail ?? req.body.mail; // must be exist
  const { resetId } = req;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SENDER_GMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.SENDER_GMAIL,
    to: mail,
    subject: 'Password Reset - PMT',
    html: `<p>Please click on the following link to reset your password:</p>
    <a href="${process.env.HOME_PAGE_URL}?reset=${resetId}">link</a>`,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    else console.log(info);
  });

  next();
};
