const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const Student = require('../models/student');

const transporter = nodemailer.createTransport(sendGridTransport({
    auth:{
        api_key: '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'
    }
}));

exports.getSettings = (req, res, next) => {
    res.render('student/settings/settings',{ pageTitle: 'Settings' });
};

exports.getChangeName = (req, res, next) => {
    const studentName = req.student.name.split(" ");
    const firstName = studentName[0];
    const middleName = studentName.length == 3 ? studentName[1] : "";
    const lastName = studentName.length == 3 ? studentName[2] : studentName[1];

    res.render('student/settings/changeName', {
        pageTitle: 'Change Name',
        firstName: firstName,
        middleName: middleName,
        lastName: lastName
    });
};

exports.postChangeName = (req, res, next) => {
    let newName;
    if (req.body.middleName != "")
        newName = req.body.firstName + " " + req.body.middleName + " " + req.body.lastName;
    else
        newName = req.body.firstName + " " + req.body.lastName;
    req.student.name = newName;
    req.student.save().then(() => {
        res.redirect('/settings');
    }).catch(err => {
        console.log(err);
    });
};

exports.getChangePassword = (req, res, next) => {
    res.render('student/settings/changePassword', { pageTitle: 'Change Password' });
};

exports.postChangePassword = (req, res, next) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    bcrypt.compare(oldPassword, req.student.password).then(doMatch => {
        if (doMatch) {
            bcrypt.hash(newPassword, 12).then(password => {
                req.student.password = password;
                req.student.save().then(() => {
                    res.redirect('/settings');
                });
            }).catch(err => console.log(err));
        } else {
            res.redirect('/settings/changePassword');
        }
    }).catch(err => console.log(err));
};

exports.getFeedback = (req, res, next) => {
    res.render('student/settings/feedback', { pageTitle: 'Feedback' });
};

exports.postFeedback = (req, res, next) => {
    console.log(req.student.email);
    transporter.sendMail({
        to: 'eureka7673@gmail.com',
        from: req.student.email,
        subject: req.body.subject,
        html: `<p> ${req.body.feedback} <p>`
    }).catch(err => {
        console.log(err);
    });
    res.redirect('/settings');
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log("Error while logging out -:", err);
        res.redirect('/login');
    });
};