var mysql = require('mysql');
var fs = require('fs');
const express = require('express')
var session = require('express-session')
const app = express()
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('uploads'));

var img_email;
var multer = require('multer')

var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },


  filename: function (req, file, cb) {

    //   console.log(req);
    //   console.log(file);
    //  console.log(req.session.username);
    var datetimestamp = Date.now();

    let sql = "SELECT * FROM member_profile WHERE email = '" + req.session.username + "'";
    //   console.log(sql);
    con.query(sql, (err, results) => {

      console.log('aaaaaaaaaaaaaaas');

      cb(null, results[0]['id'] + "-" + file.fieldname + '-' + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    })
  }

});


var upload = multer({ //multer settings
  storage: storage
  ,
  fileFilter: function (req, file, cb) {


    console.log(file.mimetype)


    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    }
    else {
      console.log("wrong type")
      
      cb(null, false);
    
      
    }
    // 
  },


})

var n_admin;
var n_user;
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "trueincube"
});



con.connect(function (err) { if (err) throw err; });

app.use(session({
  secret: 'incube',
  resave: false,
  saveUninitialized: true,

}))

app.get('/api/data_admin', (req, res) => {

  let sql = "SELECT * FROM member_profile";
  con.query(sql, (err, results) => {

    res.json(results);//[{ "surname": results[0]['fname'],"email": results[0]['email'],"phone":results[0]['phone_num'],"university": results[0]['university'],"registerDate": "registerDate","complete": "complete"}])


  })


})
app.post('/api/signup_insert', (req, res) => {   // Router เวลาเรียกใช้งาน


  let sql_checkMail = "SELECT * FROM signin WHERE email  = '" + req.body.email + "'";
  con.query(sql_checkMail, (err, results) => {
    numRows = results.length;
    if (err) throw err  // ดัก error
    console.log(numRows)
    console.log(results)// แสดงผล บน Console 
    //res.json(results)   // สร้างผลลัพธ์เป็น JSON ส่งออกไปบน Browser
    if (numRows == 0) {

      let ts = Date.now();
      let date_ob = new Date(ts);
      let date = date_ob.getDate();
      let month = date_ob.getMonth() + 1;
      let year = date_ob.getFullYear();
     var timecurrent = (year + "-" + month + "-" + date);
      let sql_member_profile = "INSERT INTO member_profile (`disname`,`university`,`phone_num`,`email`,`date_register`) VALUES ('" + req.body.disname + "', '" + req.body.university + "','" + req.body.phone + "', '" + req.body.email + "', '" + timecurrent + "')";
      con.query(sql_member_profile, (err, results) => {
        if (err) throw err  // ดัก error
        //console.log(results) // แสดงผล บน Console 
        //res.json(results)   // สร้างผลลัพธ์เป็น JSON ส่งออกไปบน Browser
      })

      let sql__signin = "INSERT INTO signin (`email`,`password`) VALUES ('" + req.body.email + "', '" + req.body.password + "')";
      con.query(sql__signin, (err, results) => {
        if (err) throw err

        console.log(results);
        let sql_select_uid = "SELECT * FROM signin WHERE email = '" + req.body.email + "'";
        con.query(sql_select_uid, (err, results) => {
          if (err) throw err
          console.log(results[0]['id']);


          //var sql_signin_uid = "INSERT INTO member_profile (uid) VALUES ('" + results[0]['id'] + "')";
          var sql_signin_uid = "UPDATE member_profile SET uid='" + results[0]['id'] + "' WHERE email='" + req.body.email + "'"
          con.query(sql_signin_uid, (err, results) => {
            if (err) throw err

          })
          sql_signin_uid = "INSERT INTO member_startup (uid) VALUES ('" + results[0]['id'] + "')";
          con.query(sql_signin_uid, (err, results) => {
            if (err) throw err

          })
        })
      })
      res.json({ "data": "ลงทะเบียนสำเร็จ" })
    }
    else {
      res.json({ "data": "Email นี้ได้ถูกลงทะเบียนเเล้ว" })
      console.log("duplicate")
    }

  })

})

app.get('/signup_test', (req, res) => {   // Router เวลาเรียกใช้งาน
  //log.console(req.body.test)
  if (req.session.logincount) {
    req.session.logincount += 1;

    // res.json({ "msg": "err3count" })

    console.log(req.session.logincount);
    if (req.session.logincount == 3) {

      res.json({ "msg": "email หรือ password ไม่ถูกต้อง" })
    }
    res.end();
  }
  else {


    req.session.logincount = 1;
    console.log(req.session.logincount);
    res.end();
  }
})

app.get('/', (req, res) => {

  fs.readFile('index.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    res.end();
  });
})

app.get('/api/get_MemberProfile_email', (req, res) => {
  let sql_select_uid = "SELECT * FROM signin WHERE email = '" + req.session.username + "'";
  con.query(sql_select_uid, (err, results) => {
    if (err) throw err

    console.log(results[0]['id']);
    sql = "SELECT * FROM member_profile WHERE uid = '" + results[0]['id'] + "'";
    con.query(sql, (err, results) => {

      results[0]['email'];
      results[0]['disname'];
      results[0]['phone_num'];
      results[0]['faculty'];
      results[0]['grad_level'];
      results[0]['citizen_id'];
      results[0]['title'];
      results[0]['fname'];
      results[0]['lname'];
      results[0]['birthday'];
      results[0]['sex'];
      results[0]['work_exp'];
      results[0]['truelap'];
      results[0]['university'];
      results[0]['avatar'];



      console.log("IMG" + results[0]['avatar']);
      res.json({ "avatar": results[0]['avatar'], "email": results[0]['email'], "disname": results[0]['disname'], "phone_num": results[0]['phone_num'], "grad_level": results[0]['grad_level'], "faculty": results[0]['faculty'], "citizen_id": results[0]['citizen_id'], "title": results[0]['title'], "fname": results[0]['fname'], "lname": results[0]['lname'], "birthday": results[0]['birthday'], "sex": results[0]['sex'], "work_exp": results[0]['work_exp'], "truelap": results[0]['truelap'], "university": results[0]['university'] })
      res.end();



    })
  })
})



app.get('/api/get_member_startup_email', (req, res) => {

  console.log("dddd " + req.session.username);

  let sql_select_uid = "SELECT * FROM signin WHERE email = '" + req.session.username + "'";
  con.query(sql_select_uid, (err, results) => {
    if (err) throw err


    let sql = "SELECT * FROM member_startup WHERE uid = '" + results[0]['id'] + "'";
    con.query(sql, (err, results) => {


      results[0]['startup_name'];
      results[0]['position'];
      results[0]['service_category'];
      results[0]['target_customer'];
      results[0]['funding_stage'];
      results[0]['document_link'];
      results[0]['vdo_link'];
      results[0]['logo'];





      res.json({ "startup_name": results[0]['startup_name'], "position": results[0]['position'], "service_category": results[0]['service_category'], "funding_stage": results[0]['funding_stage'], "document_link": results[0]['document_link'], "vdo_link": results[0]['vdo_link'], "logo": results[0]['logo'] })
      res.end();



    })
  })
})

app.post('/api/MemberProfile_UPDATE', upload.single('file_avater'), (req, res) => {
  var img, body;


  //console.log(req.file.filename);


  let sql_select_uid = "SELECT * FROM signin WHERE email = '" + req.body.email + "'";

  //console.log(sql_select_uid)



  con.query(sql_select_uid, (err, results) => {
    if (err) throw err
    // console.log(results[0]['email']);
    //img =results[0]['id']+"-"+req.file.filename; 
    img = "";
    if (req.file && typeof req.file.filename == 'string' && req.file.filename.length > 0){
      img = "avatar='" + req.file.filename + "',";

      
   

    sql = "UPDATE member_profile SET disname='" + req.body.disname + "',phone_num='" + req.body.phonenumber + "',faculty='" + req.body.faculty + "',grad_level='" + req.body.graduatelevel + "',citizen_id='" + req.body.citizenid + "',title='" + req.body.title + "',fname='" + req.body.firstname + "',lname='" + req.body.lastname + "',birthday='" + req.body.birthday + "',sex='" + req.body.sex + "',work_exp='" + req.body.experience + "',truelap='" + req.body.truelab + "'," + img + "university='" + req.body.university + "' WHERE uid='" + results[0]['id'] + "'"
    console.log(sql)
    con.query(sql, (err, results) => {
      res.json({ "data": "ลงทะเบียนสำเร็จ" })
      res.end();
    })
    }
 else {

  res.json({ "data": "wrong type" })
      res.end();
    }
    //})
    //UPDATE na ja 
    //sql  = "INSERT INTO member_profile (`email`,`disname`,`phone_num`,`faculty`,`grad_level`,`citizen_id`,`title`,`fname`,`lname`,`birthday`,`sex`,`work_exp`,`truelap`,`university`) VALUES ('" + req.body.email + "','" + req.body.disname + "','" + req.body.phonenumber + "','" + req.body.faculty + "','" + req.body.Graduated + "','" + req.body.citizenid + "','" + req.body.title + "','" + req.body.firstname + "','" + req.body.lastname + "','" + req.body.birthday + "','" + req.body.sex + "','" + req.body.experience + "','" + req.body.truelab + "','" + req.body.university + "')";



  })
})


app.post('/api/member_startup_UPDATE', upload.single('file_logo'), (req, res) => {
  var img;



  // console.log(req.file.filename)

  let sql_select_uid = "SELECT * FROM signin WHERE email = '" + req.session.username + "'";

  con.query(sql_select_uid, (err, results) => {
    if (err) throw err

    console.log(req.file);
    img = "";
    if (req.file && typeof req.file.filename == 'string' && req.file.filename.length > 0)
      img = "logo='" + req.file.filename + "',";
    //img =results[0]['id']+"-"+req.file.filename; 
    // console.log(results[0]['id']);



    sql = "UPDATE member_startup SET position='" + req.body.position + "',service_category='" + req.body.service_category + "',startup_name='" + req.body.startup_name + "',target_customer='" + req.body.target_customer + "',funding_stage='" + req.body.funding_stage + "',document_link='" + req.body.document_link + "',vdo_link='" + req.body.vdo_link + "'," + img + "' WHERE uid='" + results[0]['id'] + "'"

    console.log(sql)

    con.query(sql, (err, results) => {
    })
    res.json({ "data": "ลงทะเบียนสำเร็จ" })
    res.end();



    //})
    //UPDATE na ja 
    //sql  = "INSERT INTO member_profile (`email`,`disname`,`phone_num`,`faculty`,`grad_level`,`citizen_id`,`title`,`fname`,`lname`,`birthday`,`sex`,`work_exp`,`truelap`,`university`) VALUES ('" + req.body.email + "','" + req.body.disname + "','" + req.body.phonenumber + "','" + req.body.faculty + "','" + req.body.Graduated + "','" + req.body.citizenid + "','" + req.body.title + "','" + req.body.firstname + "','" + req.body.lastname + "','" + req.body.birthday + "','" + req.body.sex + "','" + req.body.experience + "','" + req.body.truelab + "','" + req.body.university + "')";


  })

})

app.post('/api/signin', (req, res) => {



  let sql = "SELECT * FROM `admin` WHERE username='" + req.body.email + "' AND password='" + req.body.password + "'";

  con.query(sql, (err, results) => {

    if (err) throw err

    n = results.length;

    if (n > 0) {
      console.log("admin");
      console.log(results);
      console.log(results[0].username);

      let sess = req.session

      sess.username = results[0].username

      sess.status = "admin"

      res.json({ "msg": "admin" })



      //res.json({ "msg": sess.username });

    } else {
      sql = "SELECT * FROM signin WHERE email='" + req.body.email + "' AND password='" + req.body.password + "'";
     
      con.query(sql, (err, results) => {
 
        if (err) throw err

        n = results.length;

        if (n > 0) {
          let sess = req.session
          sess.username = results[0].email
          sess.status = "user"

          console.log("user");
          //  console.log("888" + sess.status)
          res.json({ "msg": "user" })
          //console.log(sql)
          res.end();
        }
        else {

          var msg = "err";
          if (req.session.logincount) {
            req.session.logincount += 1;

            // res.json({ "msg": "err3count" })

            console.log(req.session.logincount);

            if (req.session.logincount == 3) {

              msg = "err3count";
              req.session.logincount = 0;

            }
            res.json({ "msg": msg })//login ไม่ถูกต้อง
            res.end();
          }
          else {
            req.session.logincount = 1;
            console.log(req.session.logincount);
            res.json({ "msg": msg })//login ไม่ถูกต้อง
            res.end();

          }

        }

      })
    }

  })

})

app.get('/api/session_destroy', (req, res) => {

  req.session.destroy(); 
  res.writeHead(301,
    { Location: '/' }
  );
  res.end();

  
})

app.get('/api/check_status', (req, res) => {
  console.log(req.session.username);

  if (req.session.username == "admin") {

    res.writeHead(301,
      { Location: '/Admindashboard' }
    );
    res.end();

  }
  else {

  }

  if (req.session.status == "user") {

    res.writeHead(301,
      { Location: '/user_Dashboard' }
    );
    res.end();

  }
  else {

  }
})


app.post('/api/signup_test', (req, res) => {   // Router เวลาเรียกใช้งาน
  //log.console(req.body.test)
  console.log("aaaaaaaaaaaaaa");
})


app.get('/', (req, res) => {

  fs.readFile('index.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.write(data);
    res.end();
  });
})



app.get('/signup', (req, res) => {
  fs.readFile('signup.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8 ' });
    res.write(data);
    res.end();
  });
})


app.get('/test01', (req, res) => {
  fs.readFile('test01.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.write(data);
    res.end();
  });
})


app.get('/login', (req, res) => {
  fs.readFile('login.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.write(data);
    res.end();
  });
})

app.get('/MemberProfile', (req, res) => {


  fs.readFile('MemberProfile.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.write(data);
    res.end();

  });
})

app.get('/MemberStartupProfile', (req, res) => {
  fs.readFile('MemberStartupProfile.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.write(data);
    res.end();
  });

})

app.get('/forget', (req, res) => {
  fs.readFile('forget.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.write(data);
    res.end();
  });
})


app.get("/memberboard",(req,res)=>{

  console.log("aaaa")
  if(req.session.status == 'admin')
  {
    res.writeHead(301,{Location:'/Admindashboard'});
    res.end();
  }
  else if(req.session.status == "user")
  {
   fs.readFile('DashboardMember.html', function (err, data) {
     
      console.log(data)
      res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.write(data);
      res.end();
    });
  }
  else { console.log("qqqq")
    res.writeHead(301,
      { Location: '/' }
    );
    res.end();
  } 
})


app.get('/changePassword', (req, res) => {
  fs.readFile('changePassword.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.write(data);
    res.end();
  });

})

app.get('/Admindashboard', (req, res) => {

  console.log("session "+req.session.status);
  fs.readFile('Admindashboard.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.write(data);
    res.end();
  });

})


app.listen(3000, () => {
  console.log('Start server at port 3000.')
});