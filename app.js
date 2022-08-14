if(process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption")

mongoose.connect('mongodb://0.0.0.0:27017/userDB');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// const encKey = process.env.SOME_32BYTE_BASE64_STRING
// const sigKey = process.env.SOME_64BYTE_BASE64_STRING
const secret = process.env.SECRET_KEY
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]})

const User = mongoose.model('User', userSchema);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// !Home route
app.get('/', (req, res) => {
  res.render('home');
});

// !login route
app.get('/login', (req, res) => {
  res.render('login');
});

// !register route
app.get('/register', (req, res) => {
  res.render('register');
});

// !Registering a new User and login automatically
app.post('/register', (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  newUser.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.render('secrets');
    }
  });
});

// !login to our account
app.post('/login', (req, res) => {
  User.findOne({ email: req.body.username }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === req.body.password) {
          res.render('secrets');
        } else {
          console.log("password is wrong");
        }
      }else{
        console.log("no user found")
      }
    }
  });
});

// !Server
app.listen(3000, () => {
  console.log('Listening to http://localhost:3000');
});
