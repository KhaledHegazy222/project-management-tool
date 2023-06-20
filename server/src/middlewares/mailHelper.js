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
    subject: 'Account Activation - Action Required',
    html: `
      <p>Dear User,</p>
      <p>Welcome to <b>PMT</b>! We are delighted to have you on board. Before you can fully access your account and enjoy our services, we need to verify your email address. Please follow the steps below to activate your account:</p>

      <ol>
        <li>Click on the following activation link: <a href="${process.env.HOME_PAGE_URL}?activate=${verificationId}">Activate Account</a><br>
            <small>(Note: The link will expire soon, so please make sure to complete the activation process promptly.)</small>
        </li>
        <li>You will be directed to a page confirming the successful activation of your account.</li>
      </ol>

      <p>If the above link does not work, please copy and paste the entire URL into your web browser's address bar.</p>

      <p>Once your account is activated, you will have access to all the features and benefits that come with being a member of our platform. We encourage you to explore our offerings and make the most of your experience.</p>

      <p>If you did not create an account or believe this email was sent to you in error, please disregard it. No further action is required.</p>

      <p>Thank you for choosing <b>PMT</b>. We look forward to serving you and providing you with an exceptional experience.</p>
      
      <p>Best regards,</p>
      <p>PMT team</p>`,
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
    subject: 'Password Reset Request - Action Required',
    html: `
    <p>Dear User,</p>
    <p>We received a request to reset your password for your account with PMT. To proceed with the password reset process, please follow the instructions below:</p>
    
    <ol>
        <li>Click on the following link to reset your password: <a href="${process.env.HOME_PAGE_URL}?reset=${resetId}">Reset Password</a><br>
            <small>(Note: The link will expire soon, so please make sure to complete the process promptly.)</small>
        </li>
        <li>You will be directed to a secure page where you can enter a new password for your account.</li>
    </ol>

    <p>If you did not initiate this password reset request or believe this email was sent to you in error, please disregard it. Your password will not be changed unless you follow the link and complete the reset process.</p>

    <p>Ensuring the security of your account is of utmost importance to us. If you have any concerns or need further assistance, please contact our support team.</p>

    <p>Best regards,</p>
    <p>PMT team<br>`,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    else console.log(info);
  });

  next();
};
