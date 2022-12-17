// const Mailjet = require("node-mailjet");
const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "9808d431746167",
    pass: "f134ac62e06615",
  },
});

const sendMailJetEmail = async ({
  reciverEmail,
  reciverName,
  emailPurpose,
  uuidLink,
}) => {
  let emailSubject = "";
  let HTMLContent = "";
  if (emailPurpose === "emailVerfication") {
    emailSubject = `${reciverName}, please verify your email`;
    HTMLContent = `<h3>Please click the Link below to verify your account <br> <a href=${uuidLink}>${uuidLink}</a></h3>`;
  } else if (emailPurpose === "resetPassword") {
    emailSubject = `${reciverName} your password reset link`;
    HTMLContent = `<h3>Please click the Link below to reset your account password <br> <a href=${uuidLink}>${uuidLink}</a></h3>`;
  }
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: `${reciverEmail}`, // list of receivers
    subject: `${emailSubject}`, // Subject line
    text: "", // plain text body
    html: HTMLContent, // html body
  });
  // const request = await mailjet.post("send", { version: "v3.1" }).request({
  //   Messages: [
  //     {
  //       From: {
  //         Email: "4m5lrbq@mydefipet.live",
  //         Name: "Sample Parlour",
  //       },
  //       To: [
  //         {
  //           Email: `${reciverEmail}`,
  //           Name: `${reciverName}`,
  //         },
  //       ],
  //       Subject: `${emailSubject}`,
  //       TextPart: "",
  //       HTMLPart: HTMLContent,
  //     },
  //   ],
  // });
  console.log(info);
  // return await request.response.status;
  // return info
};

module.exports = { sendMailJetEmail };
