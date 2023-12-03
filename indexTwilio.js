const http = require('http');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const express = require('express');
var io = require('socket.io')(http);
//var mongoose = require('mongoose');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')('ACf4c89b37da27698260483a56ca148d0e', '4b76bc4166bf0015287d63b4dbc2536b');

/*client.messages
  .create({
     body: 'Hey babe, I sent this from the app I am working on, so it can notify you when people are on and you can live chat with them through an application on your phone.  It could even tell you what they have and are currently looking at and etc',
     from: '+18015066318',
     to: '+14326616779'
   })
  .then(message => console.log(message.sid));*/


const app = express();

app.post('/', (req, res) => {
  const twiml = new MessagingResponse();

  twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

http.createServer(app).listen(3000, () => {
  console.log('Express server listening on port 3000');
});