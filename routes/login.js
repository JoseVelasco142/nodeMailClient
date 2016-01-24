/**
 * Created by root on 10/01/16.
 */
var express = require('express');
var router = express.Router();
var CONNECTION = require('../connection_params.js');
var ldap  = require('ldapjs');

var client = ldap.createClient({
    url: 'ldap://'+CONNECTION.HOST,
    timeout: 5000,
    connectTimeout: -1
    });


router.post('/', function(req, res) {
    if(req.body.login) {
        var mail = req.body.mail;
        var password = req.body.password;
        var loginFilter = {
            filter: '(&(objectClass='+CONNECTION.FILTER_LDAP
                    +')('+CONNECTION.MAIL
                    +'='+mail+')('+CONNECTION.PASSWORD
                    +'='+password+'))',
            scope: 'sub'
        };
        var userDn = 'cn='+req.body.mail.split('@')[0]+',ou='+CONNECTION.USERS_LDAP_OU+','+CONNECTION.LDAP_SUFFIX;
        client.bind(userDn, req.body.password, function(err) {
            if(err) console.log(err.message);
        });
        client.search('ou='+CONNECTION.USERS_LDAP_OU+','+CONNECTION.LDAP_SUFFIX, loginFilter, function(err, response) {
            var entries = [];
            response.on('searchEntry', function(entry) {
                entries.push(entry.object);
            });
            response.on('end', function(result) {
                if(entries.length > 0) {
                    req.session.mail = mail;
                    req.session.password = password;
                    res.send({
                         authorize: true,
                         inbox:"http://localhost:3000/inbox"
                    });
                } else {
                    res.send({
                        authorize: false
                    });
                }
            });
        });
    } else if (req.body.logOut) {
        req.session.destroy();
        res.send("http://localhost:3000")
    }
});

module.exports = router;
