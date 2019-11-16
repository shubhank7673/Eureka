const express = require('express');

const studentController = require('../controllers/student');
const settingsController = require('../controllers/settings');

const router = express.Router();

// settings routes
router.get('/settings',settingsController.getSettings);
router.get('/settings/changeName',settingsController.getChangeName);
router.post('/settings/changeName',settingsController.postChangeName);
router.get('/settings/changePassword',settingsController.getChangePassword);
router.post('/settings/changePassword',settingsController.postChangePassword);
router.get('/settings/changeAvatar',settingsController.getChangeAvatar);
router.post('/settings/changeAvatar',settingsController.postChangeAvatar);
router.get('/settings/feedback',settingsController.getFeedback);
router.post('/settings/feedback',settingsController.postFeedback);
router.get('/settings/aboutus',settingsController.getAboutUs);
router.post('/settings/logout',settingsController.postLogout);
router.get('/settings/aboutus',settingsController.getAboutUs);

// course routes
router.get('/',studentController.getHome);  
router.get('/courses',studentController.getCourses); 
router.get('/courses/joinByCode',(req,res,next) => {
}); 
router.get('/course/:courseId',studentController.getCourse);
router.get('/course/:courseId/analytics',studentController.getAnalytics);
router.get('/course/:courseId/discussion',(req,res,next) => {
});
router.get('/course/:courseId/class/:classId',studentController.getClass);
router.get('/course/:courseId/class/:classId/:quizId',(req,res,next) => {
    console.log(req.params.courseId,req.params.classId,req.params.quizId);
});
router.get('/course/:courseId/class/:classId/feedback',(req,res,next) => {
});
router.get('/course/:courseId/class/:classId/:pollId',(req,res,next) => {
});

module.exports = router;   