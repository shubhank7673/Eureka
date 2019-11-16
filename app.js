const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const MONGODB_URI = 'mongodb+srv://eureka:LOLZ@eureka-o1gai.mongodb.net/Eureka';
const csrf = require('csurf');

const Student = require('./models/student');
const Course = require('./models/course');

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
app.use(CsrfProtection); //..
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

// app.use('/test',(req,res,next)=>{
//     Course.findById("5dcecce6ea1f025153a9fa9d")
//           .then(res => {
//               console.log(res);
//           })
//           .catch(err => console.log(err));
// })

// app.use('/',(req,res,next)=>{
//     res.render('student/class');
// })


app.use(authRoutes);

app.use((req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.redirect('/login');
        // next();
    }
    else if (req.session.isStudent) {
        Student.findOne({ email: req.session.student.email }).then(student =>{
            req.student = student;
            // req.student.courses = courses;
            next();
        }).catch(err => {
            console.log(err);
        });
    }
});
// app.use(teacherRoutes);
app.use(studentRoutes);

mongoose.connect(MONGODB_URI).then(() => {
    console.log('Database Connected');
    app.listen(5000,()=>{console.log("server on port 5000")});
}).catch(err => {
    console.log('Database connection error');
});