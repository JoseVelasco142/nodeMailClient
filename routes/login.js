/**
 * Created by root on 10/01/16.
 */
var express = require('express');
var router = express.Router();

var ldap  = require('ldapjs');
var SUFFIX = "dc=jvp,dc=com";
var client = ldap.createClient({
    url: 'ldap://192.168.1.200',
    timeout: 5000,
    connectTimeout: -1
    });
    client.bind('cn=admin,'+SUFFIX, '1', function(err) {
        if(err) console.log(err);
    });

router.post('/', function(req, res) {
    if(req.body.login) {
        var mail = req.body.mail;
        var password = req.body.password;
        var loginFilter = {
            filter: '(&(objectClass=CourierMailAccount)(mail='+mail+')(userPassword='+password+'))',
            scope: 'sub'
        };
        client.search('ou=People,'+SUFFIX, loginFilter, function(err, response) {
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
