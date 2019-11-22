const mongoose = require('mongoose');
const Course = require('../models/course');

const path = require('path')
const dummyCourses = [{_id:1,courseName:"Operating Systems",courseCode:"14B11CI121",courseAdmin:"Dr. Anju Shukla"},
                      {_id:2,courseName:"Math",courseCode:"14B11MA321",courseAdmin:"Dr. B.R. Gupta"},
                      {_id:3,courseName:"Computer Networks",courseCode:"14B11CI611",courseAdmin:"Dr. Mahesh Kumar"}
                    ]
const course = {
    _id:3,
    courseName:"Computer Networks",
    courseCode:"14B11CI411",
    courseAdmin:{
        name:"Dr. Mahesh Kumar"
    },
    courseTeam:[
        {name:"Dr. Mahesh Kumar",role:"Aourse Admin"},
        {name:"Dr. Neelesh Kumar",role:"Team member"}
    ],
    classes:[
        {
            class:{
                _id:1,
                title:"class 1",
                date:"19",
                day:"SAT",
                month:"JAN",
                timing:"09:00AM - 10:00AM",
            },
            batch:"b4"
        },
        {
            class:{
                _id:2,
                title:"class 2",
                date:"21",
                day:"MON",
                month:"JAN",
                timing:"09:00AM - 10:00AM",
            },
            batch:"b4"
        }
    ],
    courseDescription:"A very nice course",
    textbooks:[{
        name:"Data Communication and networking",
        author:"Behrouz A Forouzan"
    }],
    links:["dummy1.com","dummy2.com","dummy3.com"]
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
    console.log(req.query.snackbar);
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
    
    // const courses = [];
    // let cnt=0;
    // // console.log(req.student.courses.length);
    // req.student.courses.forEach(item => {
    //     // console.log("working !!")
    //     Course.findById(item.course)
    //             .then(res => {
    //                 courses.push({
    //                     course:res,
    //                     analytics:item.analytics
    //                 });
    //                 cnt++;
    //             })
    //             .catch(err =>{
    //                 console.log(err)
    //             });
    // });
    // while(courses.length<req.student.courses.length);
    // console.log(courses);
    // req.student
    //    .populate('courses.course')
    //    .execPopulate()
    //    .then(student => {
    //     console.log("this is working");
    //    })
    //    .catch(err => {
    //        console("error while fetching courses ",err);
    //    })
}
module.exports.getCourse = (req,res,next) => {
    // console.log(req.params.courseId);
    Course.findById(req.params.courseId)
          .then(course => {
              console.log(course);
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
module.exports.getClass = (req,res,next) => {
    // console.log(req.params.courseId,req.params.classId);
    res.render('student/class');
}
module.exports.postJoinCourse = (req,res,next) => {
        console.log(req.body.courseCode);
        // let check = false;
        // req.student.courses.forEach(item => {
        //     if(item.course == req.body.courseCode)
        //     {
        //         check = true;
        //     }
        // })
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
                    req.student.courses.push({
                        course:result._id,
                        // facultyName:facultyName,
                        analytics:{
                            avgQuizSc:0,
                            noQuizAtt:0,
                            noPollAtt:0
                        }   
                    })
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