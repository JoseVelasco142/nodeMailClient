/**
 * Created by root on 12/01/16.
 */
var express = require('express');
var router = express.Router();

// GET INBOX PAGE
router.get('/', function(req, res) {
    if(req.session.mail) {
        res.render('inbox', {
            title: 'Bandeja de entrada',
            mail: req.session.mail
        });
    } else
        res.render('index', { title: 'Login' });
});

module.exports = router;

