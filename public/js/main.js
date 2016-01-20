/**
 * Created by root on 10/01/16.
 */
var MAIL = {};
MAIL.prototype = ({
    doLogin: function(){
        var mail = $('#mail');
        var password = $('#password');
        var loginError =  $('#loginError');
        var loading = $('#loading');
        if((mail.val() != "") && (password != "")){
            $.ajax({
                type: 'POST',
                url: "http://localhost:3000/login",
                async: false,
                data: {
                    login: true,
                    mail: mail.val(),
                    password: password.val()
                }
            })
            .done(function (res) {
                loading.toggleClass('hide');
                setTimeout(function(){
                    if(res.authorize) {
                        window.location.href = res.inbox;
                    } else {
                        loginError.html('Email o contrase&ntilde;a incorrecto');
                        if (loginError.hasClass('hide')) loginError.toggleClass('hide');
                    }
                    loading.toggleClass('hide');
                }, 3000);
            });
        } else {
            loginError.html('Introduce tu email y tu contrase&ntilde;a');
            if (loginError.hasClass('hide')) loginError.toggleClass('hide');
        }
    },
    logOut: function(){
        $.ajax({
            type: 'POST',
            url: "http://localhost:3000/login",
            async: false,
            data: {
                logOut: true
            }
        })
        .done(function (res) {
            window.location.replace(res);
        })
    },
    getMails: function(){
        if(window.location.pathname == "/inbox") {
            $.ajax({
                type: 'POST',
                url: "http://localhost:3000/mail",
                data: {
                    getMails: true
                },
                beforeSend: function(){
                    $('#loadingInbox').toggleClass('hide');
                }
            })
            .done(function (mails) {
                if(mails != '1'){
                    top.mails = mails;
                    setTimeout(function(){
                        MAIL.prototype.mountMails(mails);
                    }, 1500);
                } else {
                    $('#mailList').append('<div id="noMSG" class="well-lg"> No tienes ning&uacute;n mensaje</div>');
                    $('#loadingInbox').toggleClass('hide');
                }
            })
        }
    },
    mountMails: function(mails) {
        var date;
        var hour;
        var count = 0;
        mails.forEach(function(mail) {
            date = mail.date.split('T')[0];
            hour = mail.date.split('T')[1].split('.')[0];
            count++;
            mailTemplate =
                '<div class="col-xs-12 mail">' +
                    '<div class="col-xs-1  mailButtons">' + //BUTTONS
                        '<div class="col-xs-12 col-sm-12 col-md-6 co-lg-6">' + //READ
                            '<button type="button" class="col-xs-12 btn btn-default readMail" ' +
                                'id="'+count+'" data-toggle="modal" data-target="#mailViewer">' +
                                    '<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>' +
                            '</button>' +
                        '</div>' +
                        '<div class="col-xs-12 col-sm-12 col-md-6 co-lg-6">' +  //CHECK
                            '<input type="checkbox" class="col-xs-12 ' +
                            'checkbox checkbox-inline checkMail" name="mail" value="'+count+'" />'+
                        '</div>'+
                    '</div>'+
                    '<div class="col-xs-10 mailData">' + //MAIL DATA
                        '<div class="col-xs-2 col-sm-2 hidden-md hidden-lg mailTitle">De: </div>'+
                            '<div class="col-xs-10 col-sm-10 col-md-3 col-lg-3 mailContent">'+mail.from+'</div>'+
                        '<div class="col-xs-2 col-sm-2 hidden-md hidden-lg mailTitle">Asunto: </div>'+
                            '<div class="col-xs-10 col-sm-10 col-md-6 col-lg-6 mailContent ">'+mail.subject+'</div>'+
                        '<div class="col-xs-2 col-sm-2 hidden-md hidden-lg mailTitle">Hora: </div>'+
                            '<div class="col-xs-10 col-sm-10 col-md-3 col-lg-3 mailContent">'+date+' at ' +hour+'</div>'+
                '</div>';
            $('#mailList').append(mailTemplate);
        });
        $('.readMail').click(function(){
            MAIL.prototype.readMail($(this).prop('id'));
            $('#mailViewer').show();
        });
        $('#loadingInbox').toggleClass('hide');
    },
    refreshMail: function() {
        $('#mailList').empty();
        MAIL.prototype.getMails();
    },
    readMail: function(mailID) {
        $('#viewerFrom').html(top.mails[mailID-1].from);
        $('#viewerDate').html(
            top.mails[mailID-1].date.split('T')[0]
            +" at "+
            top.mails[mailID-1].date.split('T')[1].split('.')[0]
        );
        $('#viewerSubject').html(top.mails[mailID-1].subject);
        $('#viewerReader').html(top.mails[mailID-1].text);
        $('#idRead').val(mailID);
        $('#mailViewer').fadeIn();
    },
    writeMail: function(){
        $('#mailWriter').fadeIn();
    },
    sendMail: function(){
        var loadingIcon =  $('#loadingInbox');
        var to = $('#writerTo') ;
        var subject = $('#writerSubject');
        var text = $('#writerText');
        if ((text.val() != '') && (subject.val() != '') && (to.val() !='')) {
            $.ajax({
                    type: 'POST',
                    url: "http://localhost:3000/mail",
                    data: {
                        sendMail: true,
                        to: to.val(),
                        subject: subject.val(),
                        text: text.val()
                    },
                    beforeSend: function(){
                        loadingIcon.toggleClass('hide');
                    }
                })
                .done(function (res) {
                    if (res == '0') {
                        $('#mailWriter').modal('toggle');
                        loadingIcon.toggleClass('hide');
                        to.val("");
                        subject.val("");
                        text.val("");
                        MAIL.prototype.refreshMail();
                    } else {
                        loadingIcon.toggleClass('hide');
                        alert("Dirección erronea o error del servidor");
                    }
                })
        } else {
            alert("Todos los campos son requeridos");
        }
    },
    deleteMail: function(idMail){
        var loadingIcon = $('#loadingInbox');
        $.ajax({
                type: 'POST',
                url: "http://localhost:3000/mail",
                data: {
                    deleteMail: true,
                    idMail: idMail
                },
                beforeSend: function(){
                    loadingIcon.toggleClass('hide');
                }
            })
            .done(function (res) {
                if(res == '0') {
                    loadingIcon.toggleClass('hide');
                    MAIL.prototype.refreshMail();
                } else {
                    loadingIcon.toggleClass('hide');
                    alert("Ha ocurrido un error eliminando el mensaje");
                }
            })
    },
    deleteMails: function(){
        var selected = $('input[name="mail"]:checked');
        var valOfSelected = [];
        if(selected.length>0){
            selected.each(function(){
                valOfSelected.push($(this).val())
            });
            MAIL.prototype.deleteMail(valOfSelected);
        } else {
            alert("Ningún mensaje marcado");
        }
    }
});

$(document).ready(function() {
    MAIL.prototype.getMails();
    top.mails = [];
    $('#loginBtn').click(function() {
        MAIL.prototype.doLogin();
    });
    $('#password').keyup(function(e){
        if (e.keyCode === 13) {
            MAIL.prototype.doLogin();
        }
    });
    $('#logOut').click(function(){
        MAIL.prototype.logOut();
    });
    $('#refreshMails').click(function(){
       MAIL.prototype.refreshMail();
    });
    $('#newMail').click(function(){
       MAIL.prototype.writeMail();
    });
    $('#writerSend').click(function(){
       MAIL.prototype.sendMail();
    });
    $('#viewerDelete').click(function(){
       MAIL.prototype.deleteMail($('#idRead').val());
    });
    $('#eraseMails').click(function(){
        MAIL.prototype.deleteMails();
    });
});
