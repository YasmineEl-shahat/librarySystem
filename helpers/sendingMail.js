const nodemailer = require("nodemailer");
const mailgen = require("mailgen");
const { EMAIL, PASSWORD } = require("../env");
const { response, request } = require("express");
module.exports = (recieverMail, password) => {
  let config = {
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  };
  let transporter = nodemailer.createTransport(config);

  var mailGenerator = new mailgen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js/",
    },
  });
  var mailResponse = {
    body: {
      name: "member",
      intro: "Welcome to our power of girls library",
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  var email = mailGenerator.generate(mailResponse);
  let message = {
    from: EMAIL,
    to: recieverMail,
    subject: "welcome to the library",
    text: "successfuly register in our library ",
    html: `<h3>Please activate your account </h3>
        <ul><li>Add image</li><li>Update this password :${password}</li></ul>`,
  };
  transporter.sendMail(message, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(info);
    }
  });
};
