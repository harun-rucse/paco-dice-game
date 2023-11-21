const nodemailer = require("nodemailer");
const emailTemplate = require("../utils/email-template");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.username = user.username;
    this.url = url;
    this.from = `${process.env.APP_NAME} <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // Sendgrid
      return nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    // Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: template,
    };

    // Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendPasswordReset() {
    const title = "Reset Your Password";
    const description = `Tap the button below to reset your customer account password. If you didn't request a new password, you can safely delete this email.`;
    const buttonText = "Reset Password";

    const template = emailTemplate({
      title,
      description,
      buttonText,
      name: this.username,
      url: this.url,
    });

    await this.send(
      template,
      `Your password reset token (valid for only ${process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN} minutes)`
    );
  }
};
