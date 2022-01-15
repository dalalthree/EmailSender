var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require("./routes/testBackend");
const { MongoClient } = require('mongodb');
var nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { endianness } = require('os');
dotenv.config();
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/testBackend", testAPIRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


const uri = "mongodb+srv://" 
  + process.env.DB_USER + ":" 
  + process.env.DB_PASS
  + "@cluster0.euxda.mongodb.net/"
  + "mydb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log("error:");
  console.log(err);
  const totalQueries = 1;
  var completed = 0;
  const collection = client.db("mydb").collection("customers");
  var myobj = { name: "Company Inc", address: "Highway 37" };
  collection.insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    end();
  });
  function end(){
    if (++completed >= totalQueries){
      client.close;
    }
  }
  // perform actions on the collection object
});

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dalalryan717@gmail.com',
    pass: 'Yankees#42'
  }
});
  
var mailOptions = {
  from: 'dalalryan717@gmail.com',
  to: 'ryanadalal@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

module.exports = app;
