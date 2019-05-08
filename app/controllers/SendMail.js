const nodemailer = require("nodemailer");
const Room = require("../models/Room.model");
// const pug = require("pug");

module.exports = {
  verify: (email, token) => {
    return new Promise((resolve, reject) => {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "skrwebstart@gmail.com",
          pass: "Ahenrajput10*"
        }
      });

      const link = `http://localhost:3000/user/verify/${email}/${token}`;

      let mailOptions = {
        from: "Sachin Kumar Rajput <myroomy.admin@gmail.com>",
        to: email,
        subject: "Website Testing",
        text: "This is a testing Email",
        html: `
            <h1>Test Link</h1>
            <a href=${link}>Verify</a>
          `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          reject(error);
          console.log("Mail not sended");
        } else {
          console.log("Mail Sended");
          resolve(info);
        }
      });
    });
  },
  book: (id, email) => {
    return new Promise((resolve, reject) => {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "skrwebstart@gmail.com",
          pass: "Ahenrajput10*"
        }
      });

      let mailOptions = {
        from: "Sachin Kumar Rajput <myroomy.admin@gmail.com>",
        to: email,
        subject: "Website Testing",
        text: "This is a testing Email",
        html: `
            <h1>Book Successfull</h1>
            <p>For enquery Contact: 123456</p>
          `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          console.log("Mail not sended");
          reject(error);
        } else {
          Room.findOneAndUpdate(
            { _id: id },
            {
              $set: {
                status: false
              }
            }
          ).then(result => {
            resolve(result);
            console.log("Update after email", result);
          });
          console.log("Mail Sended");
        }
      });
    });
  }
};
