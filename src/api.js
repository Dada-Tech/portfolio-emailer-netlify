const express = require('express');
const serverless = require("serverless-http");
const Joi = require('@hapi/joi'); // class returned
require('dotenv').config();


const app = express();
const router = express.Router();

// SendGrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// use JSON parse in body. middleware
app.use(express.json());


router.get("/", (req, res) => {
  res.send("ok for now");
});

router.post("/mail", (req, res) => {
  const schema = Joi.object().keys({
    subject: Joi.string().min(3).required(),
    text: Joi.string().required()
  });

  const result = Joi.validate(req.body,schema);

  if(result.error)
  // 400 for bad request
    return  res.status(400).send(result.error.details[0].message);

  const msg = {
    to: 'daviddadaa@hotmail.com',
    from: 'david-dada-portfolio@dadadavid.com',
    subject: req.body.subject.toString(),
    text: req.body.text,
    html: '<strong>sent from Netlify Server</strong>',
  };

  sgMail
      .send(msg)
      .then(() => {
        //Celebrate
        // console.log('Email Sent!');
      })
      .catch(error => {
        //Log friendly error
        console.error(error.toString());

        //Extract error msg
        const {message, code, response} = error;

        //Extract response msg
        const {headers, body} = response;
      });

  res.send("email SENT");
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
