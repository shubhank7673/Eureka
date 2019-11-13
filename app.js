const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const MONGODB_URI = 'mongodb+srv://eureka:password@eureka-o1gai.mongodb.net/Eureka';
const csrf = require('csurf');

const Student = require('./models/student');

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
app.use((req, res, next) => {
    if (!req.session.isLoggedIn) {
        next();
    }
    else if (req.session.isStudent) {
        Student.findOne({ email: req.session.student.email }).then(student =>{
            req.student = student;
            next();
        }).catch(err => {
            console.log(err);
        });
    }
});

app.use(studentRoutes);
app.use(authRoutes);
app.use(teacherRoutes);

mongoose.connect(MONGODB_URI).then(() => {
    console.log('Database Connected');
    app.listen(3000);
}).catch(err => {
    console.log('Database connection error');
});