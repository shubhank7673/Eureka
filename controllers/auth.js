const bcrypt = require('bcryptjs');
const Student = require('../models/student');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', { pageTitle: 'Login' });
};

exports.postLogin = (req, res, next) => {
    Student.findOne({ email: req.body.email }).then((student) => {
        if (!student) {
            // Check for teacher
            res.redirect('/login');
        } else {
            bcrypt.compare(req.body.password, student.password).then((doMatch) => {
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.isStudent = true;
                    req.session.student = student;
                    req.session.save((err) => {
                        console.log('Error while logging in -: ', err);
                        res.send("Login Sucessfull!");
                    });
                } else {
                    res.redirect('/login');
                }
            }).catch(err => {
                console.log(err);
                res.redirect('/');
            });
        }
    }).catch(err => {
        console.log('error');
        res.redirect('/invalid');
    });
};