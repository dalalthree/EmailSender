//imports
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var nodemailer = require('nodemailer');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

//enviornment variable set up
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

//gets the information needed to send email
app.post("/sendEmail", function(req, res, next) {
  if(req.body.email.toLowerCase() == "mailing list"){
    sendMailingList(req.body.content);
  }
  else{
    sendEmail(req.body.email, req.body.subject, req.body.content);
  }
  //tells the user whether it succeded
  res.send("Email Sent");
});

app.post("/addToMailingList", function(req, res, next) {
  addToMailingList(req.body.name, req.body.email);
  //tells the user whether it succeded
  res.send("Added to Mailing List");
});


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

//mongo db
const uri = "mongodb+srv://" 
  + process.env.DB_USER + ":" 
  + process.env.DB_PASS
  + "@cluster0.euxda.mongodb.net/"
  + "mydb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
function addToMailingList(name, email){
  client.connect(err => {
    //makes sure all queries are complete before closing a connection
    const totalQueries = 2;
    var completed = 0;
    //sets up the collection
    const collection = client.db("mydb").collection("mailingList");
    
    //checks if someone with the email already signed up
    var query = { email: email };
    collection.find(query).toArray(function(err, result) {
      if (err) throw err;
      if (result.length > 0){
        client.close();
        console.log("person already in db");
        addPerson(false, null, null);
      }
      else{
        end();
        addPerson(true, name, email);
      }
    });
    //adds a person defined by paramaters to the colleciton
    function addPerson(success, name, email){
      var person = { name: name, email: email };
      if(success){
        collection.insertOne(person, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          end();
        });
      }
    }
    //if all queries are complete closes the connection
    function end(){
      if (++completed >= totalQueries){
        client.close;
      }
    }
  });
}

function sendMailingList(content){
  client.connect(err => {
    //makes sure all queries are complete before closing a connection
    const totalQueries = 1;
    var completed = 0;
    //sets up the collection
    const collection = client.db("mydb").collection("mailingList");
    
    //gets all emails in db
    collection.find({}).toArray(function(err, result) {
      if (err) throw err;
      for (var i = 0; i < result.length; i ++){
        sendEmail(
          result[i].email,
          "Mailing List News",
          "<h2>Hello " + result[i].name + ",</h2>" 
          + content
        );
      }
      end();
    });
    //if all queries are complete closes the connection
    function end(){
      if (++completed >= totalQueries){
        client.close;
      }
    }
  });
}

function sendEmail(email, subject, content){
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dalalryan717@gmail.com',
      pass: process.env.EMAIL_PASS
    }
  });
    
  var mailOptions = {
    from: 'dalalryan717@gmail.com',
    to: email,
    subject: subject,
    html: content
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log("Email Success: " + info);
    }
  });
}

module.exports = app;
