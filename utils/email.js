const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

/**
 * @class Email
 * @description Class that creates and sends emails
 * @param user User object where we can retrieve user details from
 * @param url Link that we may need to include in the email (resetPassword, callToAction...)
 * @this Binded email class object
 **/
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.from = `Support Team <${process.env.EMAIL_FROM}>`;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.url = url;
  }

  /**
   * @function  newTransport
   * @description Creates a transport object to send mail
   * @return  Nodemailer transport object
   * @this  Binded email class object
   **/
  newTransport() {
    // we will only create transport objects and send emails in the production environment
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    } else {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
  }

  /**
   * @function  send
   * @description Send email
   * @param template Template of email
   * @param subject Subject of email
   * @this  Binded email class object
   **/
  async send(template, subject) {
    // 1. Render HTML for email based on pre-defined pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      lastName: this.lastName,
      subject: subject,
      url: this.url,
    });
    // 2. Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html: html,
      text: htmlToText.fromString(html),
    };
    // 3. Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  /**
   * @function  sendWelcome
   * @description Send templated welcome email
   * @this  Binded email class object
   **/
  async sendWelcome() {
    await this.send('welcome', 'Welcome to ReviewIO!');
  }

  /**
   * @function  passwordReset
   * @description Send templated reset password email
   * @this  Binded email class object
   **/
  async sendPasswordReset() {
    await this.send('passwordReset', 'Forgot your password?');
  }
};
