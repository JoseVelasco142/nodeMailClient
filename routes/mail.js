var express = require('express');
var router = express.Router();
var Client = require('node-poplib-gowhich').Client;
var port = 110;
var smtpPort = 25;
var host = "10.10.2.200";
var CONNECTION = require('../connection_params.js');
var SMTPConnection = require('smtp-connection');

router.post('/', function(req, res) {
   if((req.body.getMails) && (req.session.mail)) {
       var client = new Client({
           hostname: CONNECTION.HOST,
           port:  CONNECTION.POP3_PORT,
           tls: false,
           mailparser: true,
           username: req.session.mail,
           password: req.session.password
       });
       var mails = [];
       client.connect(function() {
           client.count(function(err, count){
                if(count > 0) {
                    client.retrieveAll(function(err, messages) {
                        messages.forEach(function(message) {
                            mails.push({
                                'from': message.from[0].address,
                                'date': message.receivedDate,
                                'subject': message.subject,
                                'text': message.text
                            });
                        });
                        res.send(mails);
                        client.quit();
                    });
                } else {
                    res.send('1');
                }
           });
       });
   }
   else if (req.body.sendMail) {
       var options = {
           port: CONNECTION.SMTP_PORT,
           host: host,
           secure: false,
           debug: true
       };
       var connection = new SMTPConnection(options);
       connection.connect(function(){
           console.log("smtp_connected");
       });
       var env = {
           from: req.session.mail,
           to: req.body.to
       };
       var message = "subject: "+req.body.subject+"\r\n"+ req.body.text+"\r\n .";
       setTimeout(function(){
           connection.send(env, message, function(err, info) {
               connection.close();
               res.send('0');
           });
       }, 1000);

   } else if (req.body.deleteMail) {
       var mail = req.body.idMail;
       //noinspection JSDuplicatedDeclaration
       var clientDel  = new Client({
           hostname: host,
           port:  port,
           tls: false,
           mailparser: true,
           username: req.session.mail,
           password: req.session.password
       });
       clientDel.connect(function() {
           clientDel.delete(mail, function(err, msgs){
              if(err == null) {
                  clientDel.quit();
                  res.send('0');
              } else {
                  res.send('1');
              }
           });
       });
   }
});

module.exports = router;
