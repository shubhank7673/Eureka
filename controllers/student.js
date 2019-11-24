const mongoose = require('mongoose');

const Course = require('../models/course');
const Quiz = require('../models/quiz');
const quizMap = new Map();
const getRemaingTime = require('../utils/timeRemaining');

const path = require('path')
const dummyCourses = [{ _id: 1, courseName: "Operating Systems", courseCode: "14B11CI121", courseAdmin: "Dr. Anju Shukla" },
{ _id: 2, courseName: "Math", courseCode: "14B11MA321", courseAdmin: "Dr. B.R. Gupta" },
{ _id: 3, courseName: "Computer Networks", courseCode: "14B11CI611", courseAdmin: "Dr. Mahesh Kumar" }
]
const course = {
    _id: 3,
    courseName: "Computer Networks",
    courseCode: "14B11CI411",
    courseAdmin: {
        name: "Dr. Mahesh Kumar"
    },
    courseTeam: [
        { name: "Dr. Mahesh Kumar", role: "Course Admin" },
        { name: "Dr. Neelesh Kumar", role: "Team member" }
    ],
    classes: [
        {
            class: {
                _id: 1,
                title: "class 1",
                date: "19",
                day: "SAT",
                month: "JAN",
                timing: "09:00AM - 10:00AM",
            },
            batch: "b4"
        },
        {
            class: {
                _id: 2,
                title: "class 2",
                date: "21",
                day: "MON",
                month: "JAN",
                timing: "09:00AM - 10:00AM",
            },
            batch: "b4"
        }
    ],
    courseDescription: "A very nice course",
    textbooks: [{
        name: "Data Communication and networking",
        author: "Behrouz A Forouzan"
    }],
    links: ["dummy1.com", "dummy2.com", "dummy3.com"]
}

module.exports.getCourses = (req,res,next) => {
    res.render('student/courses',{title:'courses',courseList:dummyCourses,snackbar:req.query.snackbar});
}
module.exports.getHome = (req,res,next) => {
    const courseIds = [];
    // console.log(req.student.courses);
    req.student.courses.forEach(item => {
        // console.log(item);
        courseIds.push(item.course);
    });
    // console.log(courseIds);
    // console.log(req.query.snackbar);
    Course.find({
        '_id':{
            $in:courseIds
        }
    },(err,courses) => {
        // console.log(courses);
        for(let course of courses)
        {
            course.courseTeam.forEach(member => {
                if(member.batches.includes(req.student.batch))
                {
                    course.facultyName = member.name;
                    // console.log(member,course.facultyName);
                }
            })
        }
        res.render('student/courses',{title:'courses',courseList:courses,snackbar:req.query.snackbar});
    });
}
module.exports.getCourse = (req,res,next) => {
    // console.log(req.params.courseId);
    Course.findById(req.params.courseId)
          .then(course => {
            //   console.log(course);
              res.render('student/course',{title:'course',course:course,batch:req.student.batch})
          })
          .catch(err => {
              console.log("failed to fetch the course");
          })
}
exports.getAnalytics = (req, res, next) => {
    let analytics;
    req.student.courses.forEach(item => {
        if(req.params.courseId == item.course)
        {
            analytics = item.analytics;
        }
    })
    // console.log(analytics);
    res.render('student/analytics', {
        pageTitle: 'Analytics',
        curr_avatar: req.student.avatar,
        analytics:analytics,
        courseId:req.params.courseId
    });
};
module.exports.getClass = (req, res, next) => {
    res.render('student/class');
};

module.exports.getQuiz = (req, res, next) => {
    let index = req.student.quiz.findIndex(ele => {
        return ele.quizId == req.params.quizId;
    });
    // Quiz Stopped
    if (index != -1 && req.student.quiz[index].isSubmited) {
        Quiz.findById(req.student.quiz[index].quizId).then(quiz => {
            return res.render('student/quizEnd', {
                quizTitle: quiz.title,
                responses: req.student.quiz[index].responses,
                problems: quiz.problems,
                startTime: String(quiz.startTime).split("GMT")[0]
            });
        }).catch(err => console.log(err));
    }
    else {
        let quiz = quizMap.get(req.params.quizId);
        if (quiz == undefined) {
            Quiz.findById(req.params.quizId).then(quiz => {
                if (quiz.startTime == undefined) {
                    return res.redirect("/course/3/class/1");
                } else {
                    let responses = new Array(quiz.problems.length).fill(new Array("Not Submitted"));
                    req.student.quiz.push({
                        quizId: req.params.quizId,
                        responses: responses
                    });
                    quizMap.set(req.params.quizId, quiz);
                    req.student.save().then(() => {
                        res.render('student/quizRunning', {
                            quizTitle: quiz.title,
                            options: quiz.problems[0].options,
                            statement: quiz.problems[0].statement,
                            totalProblems: quiz.problems.length,
                            currProblemNo: 0,
                            quizId: quiz._id,
                            remTime: (quiz.duration - getRemaingTime(quiz.startTime)),
                            maxOptions: quiz.maxOptions
                        });
                    }).catch(err => console.log(err));
                }
            });
        } else {
            let responses = new Array(quiz.problems.length).fill(new Array("Not Submitted"));
            req.student.quiz.push({
                quizId: req.params.quizId,
                responses: responses
            });
            req.student.save().then(() => {
                res.render('student/quizRunning', {
                    quizTitle: quiz.title,
                    options: quiz.problems[0].options,
                    statement: quiz.problems[0].statement,
                    totalProblems: quiz.problems.length,
                    currProblemNo: 0,
                    quizId: quiz._id,
                    remTime: (quiz.duration - getRemaingTime(quiz.startTime)),
                    maxOptions: quiz.maxOptions
                });
            }).catch(err => console.log(err));
        }
    }
}
module.exports.postJoinCourse = (req,res,next) => {
        console.log(req.body.courseCode);
        // console.log(check);
        Course.findOne({
            courseCode:req.body.courseCode.toUpperCase()})
            .then(result => {
                if(!result)
                {
                    res.redirect('/student?snackbar=show')
                }
                else{
                    // let facultyName = "";
                    // result.courseTeam.forEach(teamMember => {
                    //     if(teamMember.batches.includes(req.student.batch))
                    //     {
                    //         facultyName = teamMember.name;
                    //     }
                    // })
                    
                    let check = false;
                    const updatedCourses1 = [];
                    req.student.courses.forEach(item => {
                        if(item.course.toString() === result._id.toString())
                        {
                            check = true;
                            item.analytics = {
                                avgQuizSc :0,
                                noQuizAtt:0,
                                noPollAtt:0
                            }
                        }
                        updatedCourses1.push(item);
                    })
                    if(!check)
                    {
                        req.student.courses.push({
                            course:result._id,
                            // facultyName:facultyName,
                            analytics:{
                                avgQuizSc:0,
                                noQuizAtt:0,
                                noPollAtt:0
                            }   
                        })
                    }
                    else{
                        req.student.courses = updatedCourses1;
                    }
                    req.student.save()
                        .then(r => {
                            result.students.push(req.student._id);
                            result.save()
                                    .then(() => {
                                    res.redirect('/student');
                                    })
                                    .catch(err => console.log(err))
                        })   
                        .catch(err => console.log(err));
                }
            })
            .catch(err => {
                console.log(err);
            })
}

module.exports.postQuiz = (req, res, next) => {
    const quiz = quizMap.get(req.params.quizId);
    const nextProblemNo = +req.params.problemNo;
    let index = req.student.quiz.findIndex(ele => {
        return ele.quizId == req.params.quizId;
    });
    if (quiz.problems.length > nextProblemNo) {
        req.student.quiz[index].responses[+req.body.currProblemNo] = req.body.ans.split(",");
        req.student.markModified('quiz');
        req.student.save().then(() => {
            res.send({
                options: quiz.problems[nextProblemNo].options,
                statement: quiz.problems[nextProblemNo].statement,
                totalProblems: quiz.problems.length,
                currProblemNo: nextProblemNo,
                quizId: quiz._id,
                savedAns: req.student.quiz[index].responses[nextProblemNo]
            });
        }).catch(err => console.log(err));
    } else {
        req.student.quiz[index].responses[+req.params.problemNo - 1] = req.body.ans.split(",");
        req.student.quiz[index].isSubmited = true;
        req.student.markModified('quiz');
        req.student.save().then(() => {
            res.redirect("/quiz/" + req.params.quizId);
        }).catch(err => console.log(err));
    }
};
