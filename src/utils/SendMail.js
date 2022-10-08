const nodemailer = require("nodemailer");
const Room = require("../apps/room/Room.model");
const Email_Id = process.env.Email_Id;
const Email_Pass = process.env.Email_Pass;

module.exports = {
  verify: (email, token, link) => {
    return new Promise((resolve, reject) => {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: Email_Id,
          pass: Email_Pass,
        },
      });

      let newlink = `${link}/user/verify/${email}/${token}`;

      let mailOptions = {
        from: "Admin myroomy <myroomy.admin@gmail.com>",
        to: email,
        subject: "Account Verify",
        text: `Verify Account Link <a href='${newlink}>Verify</a>'`,
        html: `
            <h1>Verify Account Link </h1>
            <a href=${newlink}>Verify</a>
          `,
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
          user: Email_Id,
          pass: Email_Pass,
        },
      });

      let mailOptions = {
        from: "Admin myroomy <myroomy.admin@gmail.com>",
        to: email,
        subject: "Room Booked",
        text: "This is a testing Email",
        html: `
            <h1>Book Successfull</h1>
            <p>For enquery Contact: 123456</p>
          `,
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
                status: false,
              },
            }
          ).then((result) => {
            resolve(result);
            console.log("Update after email", result);
          });
          console.log("Mail Sended");
        }
      });
    });
  },
};
