const express = require('express');
const cookieparser = require('cookie-parser');
const bodyparser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

const adminAuth = require('./routes/adminAuth.js')
const supervisors = require('./routes/supervisors.js')
const a_students = require('./routes/a_students.js')
const institutes = require('./routes/institutes.js')
const grades = require('./routes/grades.js')
const categories = require('./routes/categories.js')
const device = require('./routes/device.js')
const books = require('./routes/books.js')
const dashboard = require('./routes/dashboard')

const supervisorAuth = require('./routes/supervisorAuth.js')
const s_students = require('./routes/s_students.js')

const studentAuth = require('./routes/studentAuth.js')
const resources = require('./routes/resources.js')
const messages = require('./routes/messages.js')

app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(cookieparser());
app.use(cors());

app.use('/adminAuth', adminAuth);
app.use('/admin/supervisor', supervisors);
app.use('/admin/students', a_students);
app.use('/admin/institutes', institutes);
app.use('/admin/grades', grades);
app.use('/admin/categories', categories);
app.use('/admin/device', device);
app.use('/admin/books', books);
app.use('/admin/dashboard', dashboard);

app.use('/supervisorAuth', supervisorAuth);
app.use('/supervisor/students', s_students);
app.use('/supervisor/device', device);
app.use('/supervisor/messages', messages);

app.use('/studentAuth', studentAuth);
app.use('/student/resources', resources);
app.use('/student/messages', messages);

app.listen(port, () =>
    console.log("Listening on port..." + port + "\n")
);