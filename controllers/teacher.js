const Course = require('../models/course');
const Class = require('../models/class');
module.exports.getHome = (req,res,next) => {
    if(!req.teacher)
    {
        res.redirect("/student");
    }
    const courseIds = [];
    req.teacher.courses.forEach(elem => {
        courseIds.push(elem.courseId);
    });
    Course.find({
        '_id':{
            $in:courseIds
        }},
        (err,courses)=>{
            // console.log(req.snackbar);
            res.render('teacher/home',{courses:courses,snackbar:req.query.snackbar});
        });
}
module.exports.getAddCourse = (req,res,next) => {
    res.render('teacher/addCourse');
}
module.exports.postAddCourse = (req,res,next) => {
    req.body.courseCode = req.body.courseCode.toUpperCase();
    console.log(req.body);
    Course.findOne({
        courseCode:req.body.courseCode
    })
    .then(existingCourse => {
        console.log(existingCourse);
        if(existingCourse)
        {
            // res.render('teacher/home?',{courses:courses,snackbar:"show"});
            // req.snackbar = "show";
            // next();
            res.redirect('/teacher?snackbar=show')
        }
        else{

                // data adaptation 

                let allBatches = req.body.allBatches.trim().split(" ");
                let teacherBatches = req.body.teacherBatches[1].trim().split(" ");

                console.log(allBatches);
                console.log(teacherBatches);

                const weekDays = [];
                const classes = [];
                const days = ["","MON","TUE","WED","THU","FRI","SAT"];
                const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                for(let i = 1;i<=6;i++)
                {
                    if(req.body[i.toString()][0] !== '' && req.body[i.toString()][1] !== '')
                    {
                        weekDays.push(i);
                    }
                }
                // console.log(weekDays);
                let start = new Date(req.body.startDate);
                let end = new Date(req.body.endDate);
                let classsn =1;
                let loop = new Date(start);
                while(loop <= end){           
                if(weekDays.includes(loop.getDay()))
                {
                    const cls = new Class({
                        title:"class "+classsn.toString(),
                        schedule:{
                            date:loop.getDate().toString(),
                            day:days[loop.getDay()],
                            month:months[loop.getMonth()],
                            time:req.body[loop.getDay().toString()][0] + " - " + req.body[loop.getDay().toString()][1]
                        },
                        venue:"LT-1"
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
                Class.insertMany(classes,(err,result) => {
                    console.log(result);
                    const finClasses = [];
                    result.forEach(item => {
                        finClasses.push({
                            class:item,
                            batches:teacherBatches
                        })
                    });
                    const co = new Course({
                        courseName:req.body.courseName,
                        courseCode:req.body.courseCode,
                        courseTeam:[{
                            name:req.teacher.name,
                            role:"team member",
                            batches:teacherBatches,
                        }],
                        batches:allBatches,
                        classes:finClasses,
                        courseTextbooks:[],
                        courseReferences:[],
                        courseDescription:req.body.courseDescription
                    });
                    co.save()
                        .then(cou => {
                            req.teacher.courses.push({
                                courseId:cou._id,
                                role:"team member",
                                batches:teacherBatches
                            });
                            req.teacher.save()
                                        .then(r => {
                                            res.redirect("/");
                                        })
                        });
                })
                
        }
    })
    
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
module.exports.postJoinExistingCourse = (req,res,next) => {
    courseCode = req.body.code;
    // Course.findOne({courseCode:courseCode})
    //       .then( course => {
    //           course.
    //       } )
    //       .catch(err => console.log(err));
}

module.exports.getCourse = (req,res,next) => {
    Course.findById(req.params.courseId)
        .then(course => {
            // console.log(course);
            res.render('teacher/course',{course:course});  
        })
        .catch(err => console.log(err));
}

module.exports.getCourseStudents = (req,res,next) => {
    Course.findById(req.params.courseId)
        .then(course => {
            res.render('teacher/courseStudents',course);
        })
}











// const co = new Course({
//     courseName:req.body.courseName,
//     courseCode:req.body.courseCode,
//     courseTeam:[{
//         name:req.teacher.name,
//         role:"team member",
//         batches:teacherBatches,
//     }],
//     batches:allBatches,
//     classes:[
//         {
//             class:{
//             classId:"5dd12a9d1c9d440000c99151",
//             title:"class",
//             timing:"09:00 - 10:00",
//             date:"15",
//             month:"NOV",
//             day:"SAT",
//             },
//             batch:"B5"
//         }
//     ],
//     courseTextbooks:[{
//         name:"Comp net",
//         author:"author author"
//     }],
//     courseReferences:["dummy1","dummy2"],
//     courseDescription:"very nice course"
// });