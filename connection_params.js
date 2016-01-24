/**
 * Created by root on 23/01/16.
 */
// CONNECTION PARAMS
    //LDAP Connection login use :
    // objectClass=CONNECTION.FILTER_LDAP
    // CONNECTION.MAIL = session.mail
    // CONNECTION.PASSWORD = session.password

    var CONNECTION = {
        HOST: "10.10.2.200",
        SMTP_PORT: 25,
        POP3_PORT: 110,
        LDAP_SUFFIX: "dc=jvp,dc=com",
        FILTER_LDAP: "CourierMailAccount",
        USERS_LDAP_OU: "People",
        MAIL: "mail",
        PASSWORD: 'userPassword'
    };

module.exports = CONNECTION;