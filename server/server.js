const express = require('express');
var mysql = require('mysql');
var cors = require('cors');
const app = express();
const port = 8000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8100"
  }
});
const users = [];
const messageArray = {};

app.use(cors());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

var con = mysql.createConnection({
  host: "localhost",
  user: "admin_node",
  password: "P@ssw0rd1",
  database: "studybuddy"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
count = 0; 
io.on('connection', (socket) => {
  socket.on('registerChat', (userId) => {
    users.push({
      sockId: socket.id,
      username: userId
    });
    console.log("connected users ", users);
  });

  socket.on('chat message', (msg) => {
    console.log('on message', socket.id);
    console.log('message to: ' + msg.to);
    console.log('message: ' + msg.message);
    console.log('message from: ' + msg.from);

    if(!messageArray[msg.from]){
      messageArray[msg.from] = {};
    }
    if(!messageArray[msg.from][msg.to]) {
      messageArray[msg.from][msg.to] = [];
    }
    messageArray[msg.from][msg.to].push({
      type: 'sent',
      to:  msg.to,
      msg: msg.message
    });
    for (let i=0; i<users.length; i++) {
      if(msg.to === users[i].username) {
        socket.to(users[i].sockId).emit("private message", {
          message: msg.message,
          from:  msg.from,
        });
        if(!messageArray[msg.to]){
          messageArray[msg.to] = [];
        }
        if(!messageArray[msg.to][msg.from]) {
          messageArray[msg.to][msg.from] = [];
        }
        messageArray[msg.to][msg.from].push({
          type: 'received',
          message: msg.message,
          from:  msg.from,
        });
      }
    }
  });    
});


app.post('/allMessages', (req, res) => {
  const fromId =  req.body.from;
  const result = messageArray[fromId] ? messageArray[fromId] : [];
  res.send(JSON.stringify(result)); 
});


app.post('/allMessagesBetween', (req, res) => {
  const fromId =  req.body.from;
  const toId = req.body.to;
  const result = messageArray[fromId] && messageArray[fromId][toId] ? messageArray[fromId][toId] : [];
  res.send(JSON.stringify(result));  
})

server.listen(3000, () => {
  console.log('listening on *:3000');
});
















app.get('/', (req, res) => {
  res.send('Hello world sample default service path');
});


app.get('/getData', (req, res) => {
  var sql = `SELECT sample_table.Name,sample_table.id FROM sample_schema.sample_table`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + JSON.stringify(result));
    res.send(JSON.stringify(result));
  });
});

/** loin signup and registration */

app.post('/login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  console.log("username: " + username);
  console.log("password: " + password);
  var sql = `SELECT 
  U.user_type,
  U.userid,
  U.username,
  S.course_id,
  S.approved_status as student_status,
  F.approved_status as faculty_status,
  F.faculty_id,
  S.ssn as student_id
  FROM User_Type U 
  LEFT JOIN student S ON U.userid = S.userid 
  LEFT JOIN faculty_staff F ON  U.userid = F.userid
  where user_email = ? AND usr_password = ?`;

  con.query(sql, [username, password], function (err, result) {
    if (err) {
      console.log("Error: " + JSON.stringify(result));
      res.send('Error: ' + JSON.stringify(err));
    }

    console.log("Result: " + JSON.stringify(result));

    if (result && result.length > 0) {
      res.send(JSON.stringify(result));
    } else {
      res.send("false");
    }
  });
});

app.post('/signUp', (req, res) => {
  var sql = `insert into User_Type(
    username,
    user_type	,
    usr_password,
    user_email,
    password_attempt_count,
    is_blocked,
    user_block_time,
    create_time,
    last_modify_time) values ?`;

  var values = [
    [req.body.name, req.body.userType, req.body.password, req.body.signup_email, 0, 0, new Date(), new Date(), new Date()]
  ]

  console.log('Request data ', req.body);

  con.query(sql, [values], function (err, result) {
    if (err) {
      return res.send('Error: ' + JSON.stringify(err));
    }
    res.send(JSON.stringify('success'));
    console.log("Number of records inserted: " + result.affectedRows);
  });
});

app.post('/register', (req, res) => {
  req.body.dob = req.body.dob.slice(0, 10);
  req.body.joining_date = req.body.joining_date.slice(0, 10);
  const age = Math.abs(new Date(new Date().getTime() - new Date(req.body.dob).getTime()).getUTCFullYear() - 1970);

    const values = [[
      req.body.first_name, 
      req.body.middle_name, 
      req.body.last_name, 
      req.body.dob, 
      age, 
      req.body.gender, 
      req.body.personal_email_id,
      req.body.phone_number, 
      req.body.joining_date, 
      req.body.father_name, 
      req.body.mother_name, 
      req.body.emergency_contact_name, 
      req.body.emergency_contact_number, 
      req.body.address_line_3, 
      req.body.address_line_1, 
      req.body.address_line_2, 
      req.body.city, 
      req.body.pincode, 
      false, 
      req.body.userid,
      req.body.course_id
    ]];

    const sqlQ = `INSERT INTO Student (
      first_name, 
      middle_name, 
      last_name, 
      dob, 
      age, 
      gender, 
      personal_email_id,
      phone_number, 
      joining_date, 
      father_name, 
      mother_name, 
      emergency_contact_name, 
      emergency_contact_number, 
      address_line_3, 
      address_line_1, 
      address_line_2, 
      city, 
      pincode, 
      approved_status, 
      userid,
      course_id) values ?`;
    con.query(sqlQ, [values], function (error, results, fields) {
      if (error) {
        return res.send(JSON.stringify(error));
      }
      res.send(JSON.stringify('success'));
      console.log("Number of records inserted: " + results.affectedRows);
    });

});

/** loin signup and registration */

/** Admin APIs */

// create new course
/**
 * insert into  Course_Details(course_name,

course_details,course_duration,number_of_semester,

subject_count_per_sem,last_date) 
values('Sofware Systems',
'The programme enables the learners to specialize in some of the fastest growing 
domains like Data Analytics, Internet of Things, Embedded Systems, Security, 
Networks and Cloud.',2,4,4,now())
 */
app.post('/create_course', (req, res) => {
  const values = [[req.body.course_name,
  req.body.course_details,
  req.body.course_duration,
  req.body.number_of_semester,
  req.body.subject_count_per_sem,
  new Date().toISOString().slice(0,10)]]
  const sqlQ = `insert into  Course_Details(course_name, 
    course_details, course_duration, number_of_semester,   
    subject_count_per_sem,last_date) values ?`;
  con.query(sqlQ, [values], function (error, results, fields) {
    if (error) {
      return res.send(JSON.stringify(error));
    }
    res.send(JSON.stringify('success'));
    console.log("Number of records inserted: " + results.affectedRows);
  });
});

/**edit course */
app.post('/edit_course', (req, res) => {
  const values = [req.body.course_name,
  req.body.course_details,
  req.body.course_duration,
  req.body.number_of_semester,
  req.body.subject_count_per_sem,
  new Date().toISOString().slice(0,10),
  req.body.course_id]
  const sqlQ = `update Course_Details set course_name = ?, 
    course_details = ?, 
    course_duration = ?, 
    number_of_semester = ?,   
    subject_count_per_sem= ?,
    last_date = ? where course_id = ?`;
  con.query(sqlQ, values, function (error, results, fields) {
    if (error) {
      return res.send(JSON.stringify(error));
    }
    res.send(JSON.stringify('success'));
    console.log("Number of records inserted: " + results.affectedRows);
  });
});

// create new subject

/**
 * insert into  Subjects(subject_name ,subject_code,
subject_description  ,text_book_1,
text_book_2   ,is_elective,
reference_material_url     ,semester     ,
syllabus_details_url ,
course_id) values('subjectname','subjectcode','subject_description',
'text_book_1','text_book_2',true,'url',1,'',1,1)
 */

app.post('/create_subject', (req, res) => {
  const values = [[req.body.subject_name,
  req.body.subject_code,
  req.body.subject_description,
  req.body.text_book_1,
  req.body.text_book_2,
  req.body.is_elective,
  req.body.reference_material_url,
  req.body.semester,
  req.body.syllabus_details_url,
  req.body.course_id]
  ];
  const sqlQ = `insert into  Subjects (subject_name, 
    subject_code,
    subject_description,
    text_book_1,
    text_book_2,
    is_elective,
    reference_material_url,
    semester,
    syllabus_details_url,
    course_id) values ?`;
  con.query(sqlQ, [values], function (error, results, fields) {
    if (error) {
      return res.send(JSON.stringify(error));
    }
    res.send(JSON.stringify('success'));
    console.log("Number of records inserted: " + results.affectedRows);
  });
});

/**
 * Edit subject
 */

app.post('/edit_subject', (req, res) => {
  const values = [req.body.subject_name,
    req.body.subject_code,
    req.body.subject_description,
    req.body.text_book_1,
    req.body.text_book_2,
    req.body.is_elective,
    req.body.reference_material_url,
    req.body.semester,
    req.body.syllabus_details_url,
    req.body.course_id,
    req.body.faculty_id,
    req.body.subject_id];
  const sqlQ = `update Subjects set subject_name = ?, 
    subject_code = ?,
    subject_description = ?,
    text_book_1 = ?,
    text_book_2 = ?,
    is_elective = ?,
    reference_material_url = ?,
    semester = ?,
    syllabus_details_url = ?,
    course_id = ?,
    faculty_id = ? where subject_id = ?`;
  con.query(sqlQ, values, function (error, results, fields) {
    if (error) {
      return res.send(JSON.stringify(error));
    }
    res.send(JSON.stringify('success'));
    console.log("Number of records inserted: " + results.affectedRows);
  });
});

// get all course details
/**
 * Select * from Course_Details;
 * `course_id`, `course_name`, `course_details`, `course_duration`, `number_of_semester`, `subject_count_per_sem`, `last_date` 
 */
app.post('/getCourseDetails', (req, res) => {
  const sqlQ = `Select * from Course_Details`;
  con.query(sqlQ, [], function (err, result) {
    if (err) {
      console.log("Error: " + JSON.stringify(result));
      res.send('Error: ' + JSON.stringify(err));
    }
    console.log("Result: " + JSON.stringify(result));
    res.send(JSON.stringify(result));
  });
});

// get all subject details
/**
 * Select * from Course_Details;
 * `subject_id`, `subject_name`, `subject_code`, `subject_description`, `text_book_1`, `text_book_2`, `is_elective`, `reference_material_url`, `semester`, `syllabus_details_url`, `course_id`, `faculty_id`
 */
 app.post('/getSubjectList', (req, res) => {
  const sqlQ = `Select 
  S.subject_id,
  S.subject_name,
  S.subject_code,
  S.subject_description,
  S.text_book_1,
  S.text_book_2,
  S.is_elective,
  S.reference_material_url, 
  S.semester,
  S.syllabus_details_url,
  F.first_name,
  F.last_name,
  S.course_id,
  S.faculty_id,
  D.course_name 
  from subjects S LEFT JOIN faculty_staff F ON S.faculty_id = F.faculty_id 
  LEFT JOIN course_details D ON S.course_id = D.course_id;`;
  con.query(sqlQ, [], function (err, result) {
    if (err) {
      console.log("Error: " + JSON.stringify(result));
      res.send('Error: ' + JSON.stringify(err));
    }
    console.log("Result: " + JSON.stringify(result));
    res.send(JSON.stringify(result));
  });
});


// get sem info for the course
/**
 * select number_of_semester from Course_Details where course_id = ? 
 */
app.post('/getSemOfCourse', (req, res) => {
  const values = [req.body.course_id];
  const sqlQ = `select number_of_semester from Course_Details where course_id = ?`;
  con.query(sqlQ, [values], function (err, result) {
    if (err) {
      console.log("Error: " + JSON.stringify(result));
      res.send('Error: ' + JSON.stringify(err));
    }
    console.log("Result: " + JSON.stringify(result));
    res.send(JSON.stringify(result));
  });
});

// get faculty list
/**
 * select first_name,last_name,personal_email_id,
    phone_number,joining_date,total_experience,emergency_contact_name,
    address_line_1 from Faculty_Staff
 */
app.post('/getFacultyList', (req, res) => {
  const values = [];
  const sqlQ = `select  
  F.faculty_id, 
  F.first_name, 
  F.middle_name, 
  F.last_name, 
  F.dob, 
  F.age, 
  F.gender, 
  F.personal_email_id, 
  F.phone_number, 
  F.joining_date, 
  F.total_experience, 
  F.father_name, 
  F.mother_name, 
  F.emergency_contact_name, 
  F.emergency_contact_number, 
  F.address_line_3, 
  F.address_line_1, 
  F.address_line_2, 
  F.city, 
  F.pincode, 
  F.userid, 
  F.approved_status from Faculty_Staff F`;
  con.query(sqlQ, [values], function (err, result) {
    if (err) {
      console.log("Error: " + JSON.stringify(result));
      res.send('Error: ' + JSON.stringify(err));
    }
    console.log("Result: " + JSON.stringify(result));
    res.send(JSON.stringify(result));
  });
});

// get student list
/**
 * select first_name,last_name,phone_number,emergency_contact_name from Student
 */
app.post('/getStudentList', (req, res) => {
  const values = [];
  const sqlQ = `select 
  S.ssn,
  S.first_name, 
  S.middle_name, 
  S.last_name, 
  S.dob, 
  S.age, 
  S.gender, 
  S.personal_email_id,
  S. phone_number, 
  S.joining_date, 
  S.father_name, 
  S.mother_name, 
  S.emergency_contact_name, 
  S.emergency_contact_number, 
  S.address_line_3, 
  S.address_line_1, 
  S.address_line_2, 
  S.city, 
  S.pincode, 
  S.approved_status, 
  S.userid from Student S`;
  con.query(sqlQ, [values], function (err, result) {
    if (err) {
      console.log("Error: " + JSON.stringify(result));
      res.send('Error: ' + JSON.stringify(err));
    }
    console.log("Result: " + JSON.stringify(result));
    res.send(JSON.stringify(result));
  });
});

/*Get all the Subject details assigned for a Course
Input parameter: @CourseId
Output: List of Subject details

Select subject_name,subject_description,text_book_2,reference_material_url,syllabus_details_url 
from Subjects 
Where Course_Id=@CourseId
*/

app.post('/getCourseSubjects', (req, res) => {
  const values = [req.body.course_id];
  const sqlQ = `Select 
  * 
  from Subjects 
  Where course_id = ?`;
  con.query(sqlQ, values, function (err, result) {
    if (err) {
      console.log("Error: " + JSON.stringify(result));
      res.send('Error: ' + JSON.stringify(err));
    }
    console.log("Result: " + JSON.stringify(result));
    res.send(JSON.stringify(result));
  });
});

/** update student status
 * update Student set approved_status=true where userid=
 */

app.post('/updateStudents', (req, res) => {
  const values = [req.body.userid];
  const sqlQ = `update Student set approved_status=1 where userid = ?`;
  con.query(sqlQ, [values], function (err, result) {
    if (err) {
      console.log("Error: " + JSON.stringify(result));
      res.send('Error: ' + JSON.stringify(err));
    }
    console.log("Result: " + JSON.stringify(result));
    res.send(JSON.stringify('success'));
  });
});

/** update faculty approved status */
app.post('/updateFaculty', (req, res) => {
  const values = [req.body.userid];
  const sqlQ = `update Faculty_Staff set approved_status=1 where userid = ?`;
  con.query(sqlQ, [values], function (err, result) {
    if (err) {
      console.log("Error: " + JSON.stringify(result));
      res.send('Error: ' + JSON.stringify(err));
    }
    console.log("Result: " + JSON.stringify(result));
    res.send(JSON.stringify('success'));
  });
});

/** Admin APIs End */

/** Student API */

// Get course details we can use from course

// get it from getCourseDetails

// register student for a course

/*Get all the Mandatory Subjects for logged in student
Input parameter: @StudentId
Output: List of Subject details

Select subject_name,subject_description,text_book_2,reference_material_url,syllabus_details_url 
FROM Subjects S
JOIN Course_Enrolement CE ON CE.Course_Id = S.Course_Id
Where CE.Student_Id = @StudentId AND Is_Elective = 0

*/

app.post('/getMandatorySubject', (req, res) => {
  const values = [req.body.Student_Id];
  const sqlQ = `Select subject_name,subject_description,text_book_2,reference_material_url,syllabus_details_url 
  FROM Subjects S
  JOIN Course_Enrolement CE ON CE.Course_Id = S.Course_Id
  Where CE.Student_Id = ? AND Is_Elective = 0`;
  con.query(sqlQ, [values], function (err, result) {
    if (err) {
      console.log("Error: " + JSON.stringify(result));
      res.send('Error: ' + JSON.stringify(err));
    }
    console.log("Result: " + JSON.stringify(result));
    res.send(JSON.stringify(result));
  });
});

/*Get all the Elective Subjects for logged in student's enrolled course
Input parameter: @StudentId
Output: List of Subject details

Select subject_name,subject_description, 
FROM Subjects S
JOIN Course_Enrolement CE ON CE.Course_Id = S.Course_Id
JOIN Faculty_Staff 
Where CE.Student_Id = @StudentId AND Is_Elective = 1

*/

app.post('/getElectiveSubjectList', (req, res) => {
  const values = [req.body.Student_Id];
  const sqlQ = `Select subject_name,subject_description, 
  FROM Subjects S
  JOIN Course_Enrolement CE ON CE.Course_Id = S.Course_Id
  JOIN Faculty_Staff 
  Where CE.Student_Id = ? AND Is_Elective = 1`;
  con.query(sqlQ, [values], function (err, result) {
    if (err) {
      console.log("Error: " + JSON.stringify(result));
      res.send('Error: ' + JSON.stringify(err));
    }
    console.log("Result: " + JSON.stringify(result));
    res.send(JSON.stringify(result));
  });
});


/*Get Enrolled Course details for logged in student
Input parameter: @StudentId
Output: Enrolled Course details

Select course_name,course_duration,number_of_semester,subject_count_per_sem,last_date,course_details 
FROM Course_Enrolement CE 
JOIN Students S ON S.SSN = CE.Student_Id
JOIN Course_Details CD ON CD.Course_Id = CE.Course_Id
Where S.SSN = @StudentId

*/

app.post('/getEnrolledCourseDetail', (req, res) => {
  const values = [req.body.Student_Id];
  const sqlQ = `Select course_name,course_duration,number_of_semester,subject_count_per_sem,last_date,course_details 
  FROM Course_Enrolement CE 
  JOIN Students S ON S.SSN = CE.Student_Id
  JOIN Course_Details CD ON CD.Course_Id = CE.Course_Id
  Where S.SSN = ?`;
  con.query(sqlQ, [values], function (err, result) {
    if (err) {
      console.log("Error: " + JSON.stringify(result));
      res.send('Error: ' + JSON.stringify(err));
    }
    console.log("Result: " + JSON.stringify(result));
    res.send(JSON.stringify(result));
  });
});


/*Get Enrolled Subject assessment details
Input parameter: @SubjectId
Output: Enrolled Course details

Select subject_name,AssessmentType,Weightage,marks,AssessmentDate,Syllabus 
FROM Subjects S 
JOIN Course_Faculty_Mapping CFM ON CFM.course_id = S.Subject_Id
JOIN Course_Assesment_Details CAD ON CAD.course_faculty_mapping_id = CFM.course_faculty_mapping_id
Where S.Subject_Id = @SubjectId

*/

app.post('/getAssessmentDetail', (req, res) => {
  const values = [req.body.Subject_Id];
  const sqlQ = `Select subject_name,AssessmentType,Weightage,marks,AssessmentDate,Syllabus 
  FROM Subjects S 
  JOIN Course_Faculty_Mapping CFM ON CFM.course_id = S.Subject_Id
  JOIN Course_Assesment_Details CAD ON CAD.course_faculty_mapping_id = CFM.course_faculty_mapping_id
  Where S.Subject_Id = ?`;
  con.query(sqlQ, [values], function (err, result) {
    if (err) {
      console.log("Error: " + JSON.stringify(result));
      res.send('Error: ' + JSON.stringify(err));
    }
    console.log("Result: " + JSON.stringify(result));
    res.send(JSON.stringify(result));
  });
});



/** Student API End */


/** faculty data api */

//  after registration a faulty can select subject that he/she will teach - so an insert query after subject selection submit
/**
 * INSERT INTO Faculty_Staff
(first_name,middle_name,last_name,dob,age,gender,personal_email_id,phone_number,joining_date,total_experience,father_name,mother_name,
emergency_contact_name,emergency_contact_number,address_line_3,address_line_1,address_line_2,city,pincode,userid)
VALUES ('Faculty1_FName','Faculty_MName',Faculty_LName,'1985-10-07',33,Male,'Faculty1@email.com',9123456780,now(),10,'F1Father','F1Mother',
null,9123456780,null,null,null,Bangalore,560100,userid)

instead of userid, please give id corresponding to Faculty from UserType table

  req.body.dob = req.body.dob.slice(0, 10);
  req.body.joining_date = req.body.joining_date.slice(0, 10);
 */

app.post('/register_faculty', (req, res) => {
  const age = Math.abs(new Date(new Date().getTime() - new Date(req.body.dob).getTime()).getUTCFullYear() - 1970);
  const values = [[req.body.first_name,
  req.body.middle_name,
  req.body.last_name,
  req.body.dob.slice(0, 10),
  age,
  req.body.gender,
  req.body.personal_email_id,
  req.body.phone_number,
  req.body.joining_date.slice(0, 10),
  req.body.father_name,
  req.body.mother_name,
  req.body.emergency_contact_name,
  req.body.emergency_contact_number,
  req.body.address_line_1,
  req.body.address_line_2,
  req.body.address_line_3,
  req.body.city,
  req.body.pincode,
  req.body.userid]];
  const sqlQ = `INSERT INTO Faculty_Staff
  (first_name,
    middle_name,
    last_name,
    dob,
    age,
    gender,
    personal_email_id,
    phone_number,
    joining_date,
    father_name,
    mother_name,
    emergency_contact_name,
    emergency_contact_number,    
    address_line_1,
    address_line_2,
    address_line_3,    
    city,
    pincode,
    userid)
    VALUES ?`;
  con.query(sqlQ, [values], function (error, results, fields) {
    if (error) {
      return res.send(JSON.stringify(error));
    }
    res.send(JSON.stringify('success'));
    console.log("Number of records inserted: " + results.affectedRows);
  });
});


// We need to list the current teaching subjects for the faculty
/**
 * SELECT S.Subject_Name,S.subject_description,S.text_book_2,S.reference_material_url,S.syllabus_details_url, C.course_name
FROM Subjects S 
JOIN Faculty_Staff F ON F.faculty_id = S.faculty_id
JOIN Course_Details C ON C.course_id = S.course_id
WHERE F.faculty_id = @FacultyId
 */

app.post('/getFacultySubjectDetail', (req, res) => {
  const values = [req.body.faculty_id];
  const sqlQ = `SELECT 
  S.subject_id,
  S.subject_name,
  S.subject_description,
  S.text_book_2,
  S.reference_material_url,
  S.syllabus_details_url, 
  C.course_name
  FROM Subjects S 
  JOIN Faculty_Staff F ON F.faculty_id = S.faculty_id
  JOIN Course_Details C ON C.course_id = S.course_id
  WHERE F.faculty_id = ?`;
  con.query(sqlQ, [values], function (err, result) {
    if (err) {
      console.log("Error: " + JSON.stringify(result));
      res.send('Error: ' + JSON.stringify(err));
    }
    console.log("Result: " + JSON.stringify(result));
    res.send(JSON.stringify(result));
  });
});

// add/update the subjects faculty is teaching
app.post('/updateSubjectDetail', (req, res) => {
  const values = [req.body.faculty_id,
    req.body.subject_id,
    req.body.course_id];
  const sqlQ = `UPDATE Subjects
  SET faculty_id = ? WHERE subject_id = ?`;
  con.query(sqlQ, values, function (err, result) {
    if (err) {
      console.log("Error: " + JSON.stringify(result));
      res.send(JSON.stringify(err));
    }
    console.log("Result: " + JSON.stringify(result));
    res.send(JSON.stringify("success"));
  });
});

// get the subjects faculty is teaching
app.post('/getCourseSubjectMapping', (req, res) => {
  const values = [req.body.course_id];
  const sqlQ = `SELECT S.subject_id,
  S.Subject_Name,
  S.subject_description,
  S.text_book_2,
  S.reference_material_url,
  S.syllabus_details_url
  FROM Subjects S WHERE course_id = ?`;
  con.query(sqlQ, values, function (err, result) {
    if (err) {
      console.log("Error: " + JSON.stringify(result));
      res.send(JSON.stringify(err));
    }
    console.log("Result: " + JSON.stringify(result));
    res.send(JSON.stringify(result));
  });
});


/** faculty data api End */

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});