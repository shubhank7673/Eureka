const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const Student = require('../models/student');

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: 'hidden'
    }
}));

exports.getSettings = (req, res, next) => {
    res.render('student/settings/settings', {
        pageTitle: 'Settings',
        curr_avatar: req.student.avatar,
        name: req.student.name,
        email: req.student.email,
    });
};

exports.getChangeName = (req, res, next) => {
    res.render('student/settings/changeName', { 
        pageTitle: 'Change Name',
        curr_avatar: req.student.avatar,
        name: req.student.name,
        email: req.student.email,
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
    res.render('student/settings/changePassword', {
        pageTitle: 'Change Password',
        curr_avatar: req.student.avatar,
        name: req.student.name,
        email: req.student.email
    });
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

exports.getChangeAvatar = (req, res, next) => {
    res.render('student/settings/changeAvatar', {
        pageTitle: 'Change Avatar',
        curr_avatar: req.student.avatar,
        name: req.student.name,
        email: req.student.email,
    });
};

exports.postChangeAvatar = (req, res, next) => {
    if (req.student.avatar != req.body.update_avatar) {
        Student.findOne({ email: req.student.email }).then(student => {
            student.avatar = req.body.update_avatar;
            student.save().then(() => {
                res.redirect("/settings");
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    } else
        res.redirect("/settings");
};

exports.getFeedback = (req, res, next) => {
    res.render('student/settings/feedback', {
        pageTitle: 'Feedback',
        curr_avatar: req.student.avatar,
        name: req.student.name,
        email: req.student.email,
    });
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

exports.getAboutUs = (req, res, next) => {
    res.send("Under Development!");
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log("Error while logging out -:", err);
        res.redirect('/login');
    });
};