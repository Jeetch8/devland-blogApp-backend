const Mailjet = require("node-mailjet");

const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

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
  const request = await mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "4m5lrbq@mydefipet.live",
          Name: "Sample Parlour",
        },
        To: [
          {
            Email: `${reciverEmail}`,
            Name: `${reciverName}`,
          },
        ],
        Subject: `${emailSubject}`,
        TextPart: "",
        HTMLPart: HTMLContent,
      },
    ],
  });
  return await request.response.status;
};

module.exports = { sendMailJetEmail };

const sendMail = async () => {
  var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "9808d431746167",
      pass: "f134ac62e06615",
    },
  });
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });
};
