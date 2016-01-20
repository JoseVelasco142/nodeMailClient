var express = require('express');
var router = express.Router();
var Client = require('node-poplib-gowhich').Client;
var port = 110;
var smtpPort = 25;
var host = "192.168.1.200";
var SMTPConnection = require('smtp-connection');
var options = {
    port: smtpPort,
    host: host,
    secure: false,
    debug: true
};

router.post('/', function(req, res) {
   if((req.body.getMails) && (req.session.mail)) {
       var client = new Client({
           hostname: host,
           port:  port,
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
       var connection = new SMTPConnection(options);
       var env = {
           from: req.session.mail,
           to: req.body.to
       };
       var message = "subject: "+req.body.subject+"\r\n"+ req.body.text;
       connection.connect(function(){
           console.log("connected");
       });
       setTimeout(function(){
           connection.send(env, message, function(err, info) {
               console.log(err);
               console.log(info);
               if(err){
                   res.send('1');
                   connection.close();
               }
               if(info) {
                   res.send('0');
                   connection.close();
               }
           });
       }, 1000);

   } else if (req.body.deleteMail) {
       var mail = req.body.idMail;
       var client = new Client({
           hostname: host,
           port:  port,
           tls: false,
           mailparser: true,
           username: req.session.mail,
           password: req.session.password
       });
       console.log("A BORRAR- "+mail);
       client.connect(function() {
          client.delete(mail, function(err, msgs){
              if(err == null) {
                  client.quit();
                  res.send('0');
              } else {
                  res.send('1');
              }
           });
       });
   }
});

module.exports = router;
