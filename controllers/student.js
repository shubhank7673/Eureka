const path = require('path')
const dummyCourses = [{_id:1,courseName:"Operating Systems",courseCode:"14B11CI121",courseAdmin:"Dr. Anju Shukla"},
                      {_id:2,courseName:"Math",courseCode:"14B11MA321",courseAdmin:"Dr. B.R. Gupta"},
                      {_id:3,courseName:"Computer Networks",courseCode:"14B11CI611",courseAdmin:"Dr. Mahesh Kumar"}
                    ]
const course = {
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
    res.render('student/courses',{title:'courses',courseList:dummyCourses});
}
module.exports.getHome = (req,res,next) => {
    res.render('student/courses',{title:'courses',courseList:dummyCourses});
}
module.exports.getCourse = (req,res,next) => {
    res.render('student/course',{title:'course',course:course})
}
exports.getAnalytics = (req,res,next) =>{
    res.render('student/analytics',{ pageTitle: 'Analytics' });
};