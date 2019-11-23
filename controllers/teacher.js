const Quiz = require('../models/quiz');

exports.getStartQuiz = (req,res,next) =>{
    res.render("teacher/startQuiz");
}

exports.postStartQuiz = (req,res,next) => {
    Quiz.findById(req.params.quizId).then(quiz =>{
        let d = new Date();
        quiz.startTime = d;
        quiz.markModified("startTime");
        quiz.save().then(() => {
            console.log("Quiz Started!");
        }).catch(err => console.log(err));
    });
    res.redirect("/startQuiz/1");
}  