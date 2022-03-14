require('dotenv').config()

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     from: '+12193275425',
     to: process.env.MY_PHONE_NUMBER,
     body: 'Hello World'

   })
  .then(message => console.log(message.sid));
