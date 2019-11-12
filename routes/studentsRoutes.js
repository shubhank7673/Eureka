const express = require('express');

const router = express.Router();

// settings routes
router.get('/settings',(req,res,next) => {
});
router.get('/settings/changeName',(req,res,next) => {
});
router.get('/settings/changePassword',(req,res,next) => {
});
router.get('/settings/changeAvatar',(req,res,next) => {
});
router.get('/settings/feedBack',(req,res,next) => {
});
router.get('/settings/logout',(req,res,next) => {
});


// course routes 
router.get('/courses',(req,res,next) => {
}); 
router.get('/courses/joinByCode',(req,res,next) => {
}); 
router.get('/course/:courseId',(req,res,next) => {
});
router.get('/course/:courseId/analytics',(req,res,next) => {
});
router.get('/course/:courseId/discussion',(req,res,next) => {
});
router.get('/course/:courseId/class/:classId',(req,res,next) => {
});
router.get('/course/:courseId/class/:classId/:quizId',(req,res,next) => {
    console.log(req.params.courseId,req.params.classId,req.params.quizId);
});
router.get('/course/:courseId/class/:classId/feedback',(req,res,next) => {
});
router.get('/course/:courseId/class/:classId/:pollId',(req,res,next) => {
});

module.exports = router;   