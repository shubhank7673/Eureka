const express = require('express');
const router = express.Router();
const teacherControllers = require('../controllers/teacher')

router.get('/',teacherControllers.getHome);
router.get('/addCourse',teacherControllers.getAddCourse);
router.get('/joinExistingCourse',teacherControllers.getJoinExistingCourse);
router.post('/joinExistingCourse',teacherControllers.postJoinExistingCourse);
router.post('/addCourse',teacherControllers.postAddCourse);
router.post('/deleteCourse/:courseId',teacherControllers.postDeleteCourse);
router.get('/course/:courseId',teacherControllers.getCourse);
// router.get('/course/:courseId/students',teacherControllers.getCourse);
// router.post('/course/:courseId/students',teacherControllers.getCourse);
router.get('/course/:courseId/students',teacherControllers.getCourseStudents);
router.get('/course/:courseId/students/:studentId',teacherControllers.getStudentInfo);
router.get('/course/:courseId/class/:classId',teacherControllers.getClass);
router.get('/quiz/:quizId',teacherControllers.getQuiz);
router.post('/quiz/:quizId/update',teacherControllers.postProblem);
router.get('/quiz/:quizId/finishAdding',teacherControllers.getFinish);
router.get('/quiz/CreateQuiz',teacherControllers.getCreateQuiz);
router.post('/quiz/CreateQuiz',teacherControllers.postCreateQuiz);
router.get('/quiz/:quizId/studentQuizDetail/:studentId',teacherControllers.getStudentQuizDetail);
/***********************  Testing Only *********/
router.post("/startQuiz/:quizId",teacherControllers.postStartQuiz);

module.exports = router;