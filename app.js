const express = require('express');

const app = express();
const studentRoutes = require('./routes/studentsRoutes')
app.set('view engine','ejs');
app.set('views','views');

// app.use(express.static(path.join(__dirname,'public')));

app.use(studentRoutes);

app.listen(5000,()=>console.log('server on 5000'));