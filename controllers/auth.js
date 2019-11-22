const bcrypt = require('bcryptjs');
const Student = require('../models/student');
const Teacher = require('../models/teacher');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', { pageTitle: 'Login',isIncorrect:false });
};

exports.postLogin = (req, res, next) => {
    Student.findOne({ email: req.body.email }).then((student) => {
        if (!student) {
            // Check for teacher
            Teacher.findOne({ email:req.body.email })
                   .then((teacher) => {
                       if(!teacher)
                       {
                           res.render('auth/login',{isIncorrect:true});
                       }
                       else{
                           bcrypt.compare(req.body.password,teacher.password)
                                 .then((domatch) =>{
                                     if(domatch)
                                     {
                                        req.session.isLoggedIn = true;
                                        req.session.isTeacher = true;
                                        req.session.teacher = teacher;
                                        req.session.save((err) => {
                                            console.log('Error while logging in -: ', err);
                                            res.redirect('/teacher');
                                        });   
                                     }
                                     else{
                                        res.render('auth/login',{isIncorrect:true});
                                     }
                                 })
                       }
                   })
                   .catch(err => console.log("some error during fetching teacher",err));
        } else {
            bcrypt.compare(req.body.password, student.password).then((doMatch) => {
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.isStudent = true;
                    req.session.student = student;
                    req.session.save((err) => {
                        console.log('Error while logging in -: ', err);
                        res.redirect('/student');
                    });
                } else {
                    res.redirect('/login',{isIncorrect:true});
                }
            }).catch(err => {
                console.log(err);
                res.redirect('/');
            });
        }
    }).catch(err => {
        console.log('error',err);
        res.redirect('/invalid');
    });
};
exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log("Error while logging out -:", err);
        res.redirect('/login');
    });
};