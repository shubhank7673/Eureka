const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const MONGODB_URI = 'mongodb+srv://eureka:eureka129@eureka-o1gai.mongodb.net/Eureka?retryWrites=true&w=majority';
const csrf = require('csurf');

const Student = require('./models/student');
const Course = require('./models/course');
const Teacher = require('./models/teacher');
const Class = require('./models/class');

const studentRoutes = require('./routes/studentsRoutes');
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/techerRoutes');

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const CsrfProtection = csrf();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({ secret: 'secret', resave: false, saveUninitialized: false, store: store })
);
app.use(CsrfProtection);
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

// app.use('/',(req,res,next)=>{
//     res.render('student/class');
// })

// app.use('/createQuiz',(req,res,next) => {
//     res.render('teacher/createQuiz');
// })

app.use(authRoutes);

app.use((req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.redirect('/login');
        // next();
    }
    else if (req.session.isStudent) {
        Student.findOne({ email: req.session.student.email }).then(student => {
            req.student = student;
            // console.log("yes working !!")
            // req.student.courses = courses;
            next();
        }).catch(err => {
            console.log(err);
        });
    }
    else if(req.session.isTeacher)
    {
        Teacher.findOne({ email: req.session.teacher.email }).then(teacher =>{
            req.teacher = teacher;
            // console.log("yes working !!")
            // req.student.courses = courses;
            next();
        }).catch(err => {
            console.log(err);
        });
    }
});
// app.use(teacherRoutes);
app.use('/add-class',(req,res,next) => {
    const cls = new Class({
        title:"class ",
        schedule:{
            date:"15",
            day:"MON",
            month:"Nov",
            time:"09:00 - 10:00"
        },
        venue:"LT-1"
    })
    cls.save()
    .then(res => {
        console.log(res);
    })
    .catch(err => console.log(err));
});

app.use('/student',studentRoutes);
app.use('/teacher',teacherRoutes);
app.use('/',(req,res,next) => {
    if(req.session.isTeacher){
        res.redirect('/teacher');
    }
    else{
        res.redirect('/student');
    }
});

app.use('/invalid',(req,res,next) => {
    if(req.session.isTeacher){
        res.redirect('/teacher?snackbar=show&message=Something went wrong');
    }
    else{
        res.redirect('/student?snackbar=show&message=Something went wrong');
    }
});
const PORT = process.env.PORT || 5000;
mongoose.connect(MONGODB_URI).then(() => {
    console.log('Database Connected');
    app.listen(PORT,()=>{console.log(`running on port ${PORT}`)});
}).catch(err => {
    console.log('Database connection error');
});
