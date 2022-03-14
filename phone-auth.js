require("dotenv").config();

const express = require("express");
const app = express();

const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// /login
//     - phone number
//     - channel (sms/call)

// /verify
//     - phone number
//     - code

app.get("/", (req, res) => {
  res.status(200).send({
    message: "You are on Homepage",
    info: {
      login: "Send verification code through /login . It contains two params i.e. phonenumber and channel(sms/call)",
      verify: "Verify the recieved code through /verify . It contains two params i.e. phonenumber and code",
    },
  });
});

// Login Endpoint
app.get("/login", (req, res) => {
  if (req.query.phonenumber) {
    client.verify
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({
        to: `+${req.query.phonenumber}`,
        channel: req.query.channel === "call" ? "call" : "sms",
      })
      .then((data) => {
        res.status(200).send({
          message: "Verification is sent!!",
          phonenumber: req.query.phonenumber,
          data,
        });
      });
  } else {
    res.status(400).send({
      message: "Wrong phone number :(",
      phonenumber: req.query.phonenumber,
      data,
    });
  }
});

// Verify Endpoint
app.get("/verify", (req, res) => {
  if (req.query.phonenumber && req.query.code.length === 4) {
    client.verify
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: `+${req.query.phonenumber}`,
        code: req.query.code,
      })
      .then((data) => {
        if (data.status === "approved") {
          res.status(200).send({
            message: "User is Verified!!",
            data,
          });
        }
      });
  } else {
    res.status(400).send({
      message: "Wrong phone number or code :(",
      phonenumber: req.query.phonenumber,
      data,
    });
  }
});

// Listen to the server at  process.env.port
app.listen(process.env.PORT, () => {
  console.log(`Server is running at ${process.env.PORT}`);
});
