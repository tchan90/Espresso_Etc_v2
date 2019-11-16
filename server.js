require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");

app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "html");

app.use(express.static(__dirname));

app.get("/contactUs", function(req, res) {
  res.sendFile(path.join(__dirname + "/contactUs.html"));
});
app.get("/success-msg", function(req, res) {
  res.sendFile(path.join(__dirname + "/success-msg.html"));
});

app.post("/contactUs", function(req, res) {
  console.log(req.body);
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });
//using fake email address here
  let mailOptions = {
    from: "fakeemailaddress@gmail.com",
    to: "fakeemailaddress@gmail.com",
    subject: "Message from Website",
    html: `
    <h1>Message from website</h1>
    <h3>Contact Details</h3>
    <ul>
    <li>Name:${req.body.name}</li>
    <li>Email:${req.body.email}</li>
    <li>Subject:${req.body.subject}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `
  };

  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      console.log("Error Occured: ", err);
    } else {
      console.log("Email Sent!");
    }
  });
  res.redirect("/success-msg");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on  ${PORT}`);
});
