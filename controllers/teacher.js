const Course = require('../models/course');
const Class = require('../models/class');
const Student = require('../models/student');
const Quiz = require('../models/quiz');
const getRemainingTime = require('../utils/timeRemaining');

module.exports.getHome = (req, res, next) => {
    if (!req.teacher) {
        res.redirect("/student");
    }
    const courseIds = [];
    req.teacher.courses.forEach(elem => {
        courseIds.push(elem.courseId);
    });
    Course.find({
        '_id': {
            $in: courseIds
        }
    },
        (err, courses) => {
            // console.log(req.snackbar);
            res.render('teacher/home', { courses: courses, snackbar: req.query.snackbar, message: req.query.message });
        });
}
module.exports.getAddCourse = (req, res, next) => {
    res.render('teacher/addCourse');
}
module.exports.postAddCourse = (req, res, next) => {
    req.body.courseCode = req.body.courseCode.toUpperCase();
    // console.log(req.body);
    Course.findOne({
        courseCode: req.body.courseCode
    })
        .then(existingCourse => {
            console.log(existingCourse);
            if (existingCourse) {
                // res.render('teacher/home?',{courses:courses,snackbar:"show"});
                // req.snackbar = "show";
                // next();
                res.redirect('/teacher?snackbar=show&message=course with same code already exist')
            }
            else {
                // data adaptation 
                let allBatches = req.body.allBatches.trim().split(" ");
                let teacherBatches = req.body.teacherBatches[1].trim().split(" ");

                console.log(allBatches);
                console.log(teacherBatches);

                const weekDays = [];
                const classes = [];
                const days = ["", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                for (let i = 1; i <= 6; i++) {
                    if (req.body[i.toString()][0] !== '' && req.body[i.toString()][1] !== '') {
                        weekDays.push(i);
                    }
                }
                // console.log(weekDays);
                let start = new Date(req.body.startDate);
                let end = new Date(req.body.endDate);
                let classsn = 1;
                let loop = new Date(start);
                while (loop <= end) {
                    if (weekDays.includes(loop.getDay())) {
                        const cls = new Class({
                            title: "class " + classsn.toString(),
                            schedule: {
                                date: loop.getDate().toString(),
                                day: days[loop.getDay()],
                                month: months[loop.getMonth()],
                                time: req.body[loop.getDay().toString()][0] + " - " + req.body[loop.getDay().toString()][1]
                            },
                            venue: "LT-1",
                            classIncharge: req.teacher._id
                        });
                        classes.push(cls);
                        // cls.save()
                        //     .then(cls => {
                        //         classes.push({
                        //             class:cls,
                        //             batch:teacherBatches
                        //         });
                        //     })
                        // const obj = {
                        //     title:"class",
                        //     timing:req.body[loop.getDay().toString()],
                        //     date:loop.getDate(),
                        //     month:loop.getMonth()+1,
                        //     day:days[loop.getDay()]
                        // }
                    }
                    let newDate = loop.setDate(loop.getDate() + 1);
                    loop = new Date(newDate);
                }
                Class.insertMany(classes, (err, result) => {
                    console.log(result);
                    const finClasses = [];
                    result.forEach(item => {
                        finClasses.push({
                            class: item,
                            batches: teacherBatches
                        })
                    });
                    const co = new Course({
                        courseName: req.body.courseName,
                        courseCode: req.body.courseCode,
                        courseTeam: [{
                            name: req.teacher.name,
                            role: "Team member",
                            batches: teacherBatches,
                        }],
                        batches: allBatches,
                        classes: finClasses,
                        courseTextbooks: [],
                        courseReferences: [],
                        courseDescription: req.body.courseDescription,
                        startDate: req.body.startDate,
                        endDate: req.body.endDate
                    });
                    co.save()
                        .then(cou => {
                            req.teacher.courses.push({
                                courseId: cou._id,
                                role: "Team member",
                                batches: teacherBatches
                            });
                            req.teacher.save()
                                .then(r => {
                                    res.redirect("/");
                                })
                        })
                        .catch(err => console.log(err))
                })

            }
        })
        .catch(err => console.log(err))

    // co.save()
    //   .then(result => {
    //       req.teacher.courses.push({
    //           courseId:result._id,
    //           role:"Course Admin",
    //           batches:result.courseTeam[0].batches
    //       });
    //       req.teacher.save()
    //                  .then(ret => {
    //                      res.redirect("/");
    //                  })
    //   })  
    //   .catch(err =>  console.log(err));
}

module.exports.getCourse = (req, res, next) => {
    Course.findById(req.params.courseId)
        .then(course => {
            // console.log(course);
            let tBatches = [];
            req.teacher.courses.forEach(item => {
                if (item.courseId.toString() === course._id.toString()) {
                    tBatches = item.batches;
                }
            });
            //console.log(tBatches);             
            res.render('teacher/course', { course: course, teacher: req.teacher, tBatches: tBatches });
        })
        .catch(err => console.log(err));
}

module.exports.getCourseStudents = (req, res, next) => {
    // req.params.courseId
    Course.findById(req.params.courseId)
        .then(course => {
            const studentIds = [];
            Student.find({
                '_id': {
                    $in: course.students
                }
            }, (err, students) => {
                res.render('teacher/courseStudents', { course: course, students: students });
            })
        })
}
module.exports.postDeleteCourse = (req, res, next) => {

    Course.findById(req.params.courseId)
        .then(course => {
            const studentIds = [];
            Student.find({
                '_id': {
                    $in: course.students
                }
            }, (err, students) => {
                students.forEach(student => {
                    let updatedCourses = [];
                    student.courses.forEach(item => {
                        if (item.course.toString() !== course._id.toString()) {
                            updatedCourses.push(item);
                        }
                    })
                    console.log(updatedCourses);
                    student.courses = updatedCourses;
                    console.log(student);
                    student.save()
                        .then(() => {

                        })
                        .catch(err => console.log(err));
                })
                Course.remove({ _id: req.params.courseId }, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.redirect('/');
                    }
                });
            })
        })
}
module.exports.getStudentInfo = (req, res, next) => {
    // console.log(req.params.studentId);
    Student.findById(req.params.studentId)
        .then(student => {
            let analytics = {};
            student.courses.forEach(item => {
                if (item.course == req.params.courseId) {
                    analytics = item.analytics;
                }
            })
            console.log(student.avatar);
            res.render('teacher/studentInfo', { student: student, analytics: analytics });
        })
        .catch(err => {
            console.log(err);
        })
}
module.exports.getJoinExistingCourse = (req, res, next) => {
    console.log(req.query);
    Course.findOne({
        courseCode: req.query.courseCode.toUpperCase()
    })
        .then(course => {
            if (!course) {
                res.redirect('/teacher?snackbar=show&message=course does not exist');
            }
            else {
                res.render('teacher/joinExistingCourse', { course: course });
            }
        })

}
module.exports.postJoinExistingCourse = (req, res, next) => {
    console.log(req.body);
    let teacherBatches = req.body.teacherBatches[1].trim().split(" ");
    const weekDays = [];
    const classes = [];
    const days = ["", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 1; i <= 6; i++) {
        if (req.body[i.toString()][0] !== '' && req.body[i.toString()][1] !== '') {
            weekDays.push(i);
        }
    }
    // console.log(weekDays);
    // console.log(req.body.startDate,req.body.endDate)
    let start = new Date(req.body.startDate);
    let end = new Date(req.body.endDate);
    let classsn = 1;
    let loop = new Date(start);
    // console.log(weekDays);
    // console.log(loop,start,end);
    while (loop <= end) {
        // console.log(loop.getDay());           
        if (weekDays.includes(loop.getDay())) {
            const cls = new Class({
                title: "class " + classsn.toString(),
                schedule: {
                    date: loop.getDate().toString(),
                    day: days[loop.getDay()],
                    month: months[loop.getMonth()],
                    time: req.body[loop.getDay().toString()][0] + " - " + req.body[loop.getDay().toString()][1]
                },
                venue: "LT-1",
                classIncharge: req.teacher._id
            });
            // console.log(cls);
            classes.push(cls);
        }
        let newDate = loop.setDate(loop.getDate() + 1);
        loop = new Date(newDate);
    }
    // console.log(classes);
    Class.insertMany(classes, (err, result) => {
        if (!err) {
            console.log('result', result);
            const finClasses = [];
            result.forEach(item => {
                finClasses.push({
                    class: item,
                    batches: teacherBatches
                })
            });
            console.log('finclasses', finClasses);
            Course.findById(req.body.courseId)
                .then(course => {
                    course.classes = course.classes.concat(finClasses);
                    console.log('course.classes', course.classes);
                    course.courseTeam.push({
                        batches: teacherBatches,
                        name: req.teacher.name,
                        role: "Team member"
                    })
                    course.save()
                        .then(resCourse => {
                            req.teacher.courses.push({
                                batches: teacherBatches,
                                courseId: resCourse._id,
                                role: "Team member"
                            })
                            console.log(req.teacher);
                            req.teacher.save()
                                .then(() => {
                                    res.redirect('/');
                                })
                                .catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
        }
    })
}

exports.getClass = (req, res, next) => {
    Class.findById(req.params.classId)
        .populate('classIncharge')
        .populate('inClassAct.quiz')
        .then(reqClass => {
            res.render('teacher/class', {
                title: reqClass.title,
                classIncharge: reqClass.classIncharge.name,
                teacherAvatar: reqClass.classIncharge.avatar,
                schedule: reqClass.schedule,
                quizes: reqClass.inClassAct.quiz,
            })
        }).catch(err => console.log(err));
};

module.exports.getCreateQuiz = (req, res, next) => {
    res.render('teacher/createQuiz');
}

module.exports.postCreateQuiz = (req, res, next) => {
    console.log(req.body.title, req.body.duration)
    let quiz = new Quiz({
        title: req.body.title,
        duration: req.body.duration,
        maxOptions: "4",
        isFinish: false,
        problems: [{
            statement: "",
            options: ["", "", "", ""],
            correct: [""],
            correctOptions: []
        }],
        responses: []
    })
    quiz.save()
        .then((quiz) => {
            res.render('teacher/addQuizQuestions', { totalProblems: quiz.problems.length, quiz: quiz, problem: quiz.problems[0], problemIndex: 0 });
        })
        .catch(err => console.log(err));
}

module.exports.getFinish = (req, res, next) => {
    res.redirect('/');
}

module.exports.postProblem = (req, res, next) => {
    // console.log(req.params.quizId);
    console.log(req.body);
    // console.log(req.body.buttonClicked.toString());
    Quiz.findById(req.params.quizId)
        .then(quiz => {
            quiz.problems[+req.body.currentProblem].statement = req.body.statement;
            // console.log(req.body.A);
            let options = [req.body.A, req.body.B, req.body.C, req.body.D];
            console.log(options);
            quiz.problems[+req.body.currentProblem].options = options;
            // quiz.problems[+req.body.currentProblem].options[1] = req.body.B;
            // quiz.problems[+req.body.currentProblem].options[2] = req.body.C;
            // quiz.problems[+req.body.currentProblem].options[3] = req.body.D;
            quiz.problems[+req.body.currentProblem].correct = req.body.correct.split(",");
            quiz.problems[+req.body.currentProblem].correctOptions = req.body.correctOptions.split(",");
            quiz.save()
                .then((qui) => {
                    if (req.body.buttonClicked === "end") {
                        res.send();
                    }
                    else if (req.body.buttonClicked.trim() == "" || req.body.buttonClicked.trim() == "+") {
                        qui.problems.push({
                            options: ["", "", "", ""],
                            correct: [],
                            statement: "",
                            correctOptions: []
                        });
                        qui.save()
                            .then(qu => {
                                res.send({
                                    totalProblems: qu.problems.length,
                                    quiz: qu,
                                    problem: qu.problems[qu.problems.length - 1],
                                    problemIndex: qu.problems.length - 1,
                                    added: true,
                                    correctOptions: qu.problems[qu.problems.length - 1].correctOptions
                                })
                            })
                            .catch(err => console.log(err));
                    }
                    else {
                        console.log("here");
                        res.send({
                            totalProblems: qui.problems.length,
                            quiz: qui,
                            problem: qui.problems[+req.body.buttonClicked - 1],
                            problemIndex: +req.body.buttonClicked - 1,
                            added: false,
                            correctOptions: qui.problems[+req.body.buttonClicked - 1].correctOptions
                        })
                    }
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    // console.log(+req.body.currentProblem);
    // console.log(+req.body.buttonClicked);
    // console.log(req.body.correct.split(","));
    // console.log(req.body);
}

exports.postStartQuiz = (req, res, next) => {
    Quiz.findById(req.params.quizId).then(quiz => {
        let d = new Date();
        /****************** Uncomment this line to start quiz *********/
        quiz.startTime = d;
        quiz.markModified("startTime");
        const timerId = setTimeout(() => {
            quiz.isFinish = true;
            quiz.save(() => {
                console.log('Quiz Ended');
                clearTimeout(timerId);
            })
        }, (quiz.duration + 5) * 1000);
        quiz.save().then(quiz => {
            console.log("Quiz Started!");
            res.send({
                remTime: quiz.duration - getRemainingTime(d)
            });
        }).catch(err => console.log(err));
    });
}

exports.getQuiz = (req, res, next) => {
    Quiz.findById(req.params.quizId)
        .then(quiz => {
            if(!quiz.isFinish){
                res.send("Wait for the quiz to end!");
            }
            if (quiz.summaryPresent) {
                quiz.populate("summary.studentsPerf.studentId").execPopulate().then(quiz => {
                    res.render("teacher/quizEnd", {
                        quizId: quiz._id,
                        avgClassScore: quiz.summary.avgClassScore,
                        minScore: quiz.summary.minScore,
                        maxScore: quiz.summary.maxScore,
                        startTime: String(quiz.startTime).split("GMT")[0],
                        quizTitle: quiz.title,
                        studentsPerf: quiz.summary.studentsPerf
                    });
                });
            } else {
                let studentScore = new Map();
                for (let i = 0; i < quiz.problems.length; i++) {
                    let correctMap = new Map();
                    for (let j = 0; j < quiz.problems[i].correct.length; j++) {
                        correctMap.set(quiz.problems[i].correct[j], 1);
                    }
                    for (let j = 0; j < quiz.responses.length; j++) {
                        let currStudentScore = studentScore.get(quiz.responses[j].studentId) || 0;
                        let correctCount = 0, selectCount = 0;
                        for (let setOption of quiz.responses[j].response[i]) {
                            if (correctMap.get(setOption)) {
                                correctCount++;
                                selectCount++;
                            } else
                                selectCount++;
                        }
                        if (quiz.problems[i].correct.length == selectCount && selectCount == correctCount) {
                            currStudentScore += 5;
                        }
                        studentScore.set(quiz.responses[j].studentId, currStudentScore);
                    }
                }
                let studentsPerf = [];
                let maxScore = 0;
                let minScore = 5 * quiz.problems.length;
                let avgClassScore = 0;
                studentScore.forEach((score, studentId) => {
                    studentsPerf.push({
                        studentId: studentId,
                        score: score
                    });
                    maxScore = Math.max(score, maxScore);
                    minScore = Math.min(score, minScore);
                    avgClassScore += score;
                });
                avgClassScore = avgClassScore / studentScore.size;
                studentsPerf.sort((a, b) => {
                    return a.score < b.score
                });
                quiz.summary = {
                    avgClassScore: avgClassScore,
                    minScore: minScore,
                    maxScore: maxScore,
                    studentsPerf: studentsPerf,
                };
                quiz.summaryPresent = true;
                return quiz.save(() => {
                    quiz.populate("summary.studentsPerf.studentId").execPopulate().then(quiz => {
                        res.render("teacher/quizEnd", {
                            quizId: quiz._id,
                            avgClassScore: quiz.summary.avgClassScore,
                            minScore: quiz.summary.minScore,
                            maxScore: quiz.summary.maxScore,
                            startTime: String(quiz.startTime).split("GMT")[0],
                            quizTitle: quiz.title,
                            studentsPerf: quiz.summary.studentsPerf
                        });
                    }).catch(err => console.log(err));
                });
            }
        }).catch(err => console.log(err));
};

exports.getStudentQuizDetail = (req, res, next) => {
    Student.findById(req.params.studentId)
        .then(student => {
            let index = student.quiz.findIndex(ele => {
                return ele.quizId == req.params.quizId;
            });
            Quiz.findById(req.params.quizId).then(quiz => {
                return res.render('teacher/studentQuizDetail', {
                    quizTitle: quiz.title,
                    responses: student.quiz[index].responses,
                    problems: quiz.problems,
                    startTime: String(quiz.startTime).split("GMT")[0]
                });
            }).catch(err => console.log(err));
        });
};
