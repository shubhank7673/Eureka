const express = require('express');
const router = express.Router();

const teacherController = require('../controllers/teacher.js');

/***********************  Testing Only *********/
router.get("/startQuiz/:quizId",teacherController.getStartQuiz);
router.post("/startQuiz/:quizId",teacherController.postStartQuiz);

module.exports = router;