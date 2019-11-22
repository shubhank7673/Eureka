const express = require('express');
const router = express.Router();
const teacherControllers = require('../controllers/teacher')

router.get('/',teacherControllers.getHome);
router.get('/addCourse',teacherControllers.getAddCourse);
router.post('/addCourse',teacherControllers.postAddCourse);
router.get('/course/:courseId',teacherControllers.getCourse);
router.get('/course/:courseId/students',teacherControllers.getCourse);
router.post('/course/:courseId/students',teacherControllers.getCourse);

module.exports = router;