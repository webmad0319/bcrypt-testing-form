const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt")
const User = require("../models/user")

router.post('/login', (req, res, next) => {
  // these are the provided credentials via the login form
  let username = req.body.username
  let password = req.body.password

  // destructuring operator, allows you to extract variables
  // and initialize them as you go
  // let {username, password} = req.body;

  // here, we are finding if the user exists and if so
  // we have to check the password
  // please note we are finding the user via their username
  User
    .findOne({ username: username })
    .then((userData) => {
      // here we compute if the user's provided password is ok or not
      const isAuthorized = bcrypt.compareSync(password, userData.password)

      // here we redirect the user to the right view
      // according to the previously aforementioned process
      // based on user's data retrieval based on the mongoose
      // model
      if (isAuthorized) {
        res.render("success", userData)
      } else {
        res.render("no-success")
      }

      // // res.json({authorized: isAuthorized})
    })


});

// get is the default browser action,
// so it will serve you when you navigate to /login
// the login form
router.get('/login', (req, res, next) => {
   // here we are providing the form the action it will use
  // so we can reuse the form for both login in and signing up
  const data = {
    action: "login"
  }

  res.render('index', data);
});


// get is the default browser action,
// so it will serve you when you navigate to /signup
// the signup form
router.get('/signup', (req, res, next) => {
  // here we are providing the form the action it will use
  // so we can reuse the form for both login in and signing up
  const data = {
    action: "signup"
  }

  res.render('index', data);
});

router.post('/signup', (req, res, next) => {
  // if (req.body.password.length < 8) {
  //   res.json({error: true})
  //   return
  // }

  // // if (req.body.password.test(/))

  // bcrypt setup for password hashing
  let saltRounds = 1
  let salt = bcrypt.genSaltSync(saltRounds)
  // please note that "req.body.password" is the provided 
  // password via the form
  let encryptedPwd = bcrypt.hashSync(req.body.password, salt)

  // here we are using the mongoose model to record
  // a new user based on the provided info via the form
  // VERY IMPORTANT!!!: please note that we are not
  // storing the plain text password, rather we are using
  // the encrypted one (named encryptedPwd)
  User
    .create({ username: req.body.username, password: encryptedPwd })
    // this (userGenerated) is the new user already generated in the promise
    .then((userGenerated) => {
      // now you are ready to enter in the app
      res.render("success", userGenerated)
    })
});

module.exports = router;
