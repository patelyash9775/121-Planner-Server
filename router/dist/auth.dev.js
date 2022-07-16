"use strict";

var express = require('express');

var router = express.Router();

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var authenticate = require('../middleware/authenticate');

var nodemailer = require('nodemailer');

require('../db/conn');

var User = require('../model/userSchema');

var Meeting = require('../model/meetingSchema');

var Otp = require('../model/otp');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  secure: false,
  auth: {
    user: 'emailsender881@gmail.com',
    pass: 'vjzriivrouldvxkr'
  }
});
router.get('/', function (req, res) {
  res.send("Hello world from the server auth.js");
}); // using promises
// router.post('/register', (req,res)=> {
//     const {name,email,phone,work,password,cpassword} = req.body;
//     if(!name || !email || !phone || !work || !password || !cpassword){
//         return res.status(422).json({error:"Pz filled the field properly"});
//     }
//     User.findOne({email:email})
//     .then((userExist) => {
//         if(userExist){
//             return res.status(422).json({error:"Email already Exist"});
//         }
//     const user = new User({name,email,phone,work,password,cpassword});
//     user.save().then(() => {
//         res.status(201).json({message: "User registered successfuly"});
//     }).catch((err) => res.status(500).json({error:"Failed to registered"}));
//     }).catch(err => {console.log(err); });
// });
// Async-Await

router.post('/register', function _callee(req, res) {
  var _req$body, name, username, email, phone, work, password, cpassword, userExist, usernameExist, user;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, username = _req$body.username, email = _req$body.email, phone = _req$body.phone, work = _req$body.work, password = _req$body.password, cpassword = _req$body.cpassword;

          if (!(!name || !username || !email || !phone || !work || !password || !cpassword)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(422).json({
            error: "Pz filled the field properly"
          }));

        case 3:
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 6:
          userExist = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(User.findOne({
            username: username
          }));

        case 9:
          usernameExist = _context.sent;

          if (!userExist) {
            _context.next = 14;
            break;
          }

          return _context.abrupt("return", res.status(422).json({
            error: "Email already Exist"
          }));

        case 14:
          if (!usernameExist) {
            _context.next = 18;
            break;
          }

          return _context.abrupt("return", res.status(422).json({
            error: "Username already Exist"
          }));

        case 18:
          if (!(password != cpassword)) {
            _context.next = 22;
            break;
          }

          return _context.abrupt("return", res.status(422).json({
            error: "Password are not matching"
          }));

        case 22:
          user = new User({
            name: name,
            username: username,
            email: email,
            phone: phone,
            work: work,
            password: password,
            cpassword: cpassword
          });
          _context.next = 25;
          return regeneratorRuntime.awrap(user.save());

        case 25:
          res.status(201).json({
            message: "user registered successfully"
          });

        case 26:
          _context.next = 31;
          break;

        case 28:
          _context.prev = 28;
          _context.t0 = _context["catch"](3);
          console.log(_context.t0);

        case 31:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 28]]);
});
router.post('/SendRequest', function _callee2(req, res) {
  var _req$body2, sender, username, date, location, restaurant, status, condition, meeting;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, sender = _req$body2.sender, username = _req$body2.username, date = _req$body2.date, location = _req$body2.location, restaurant = _req$body2.restaurant, status = _req$body2.status, condition = _req$body2.condition;

          if (!(!sender || !username || !date || !location || !restaurant || !status || !condition)) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(422).json({
            error: "Pz filled the field properly"
          }));

        case 3:
          _context2.prev = 3;
          meeting = new Meeting({
            sender: sender,
            username: username,
            date: date,
            location: location,
            restaurant: restaurant,
            status: status,
            condition: condition
          });
          _context2.next = 7;
          return regeneratorRuntime.awrap(meeting.save());

        case 7:
          res.status(201).json({
            message: "Request sent successfully"
          });
          _context2.next = 13;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](3);
          console.log(_context2.t0);

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 10]]);
});
var Email;
router.post('/Reset1', function _callee3(req, res) {
  var email, userLogin, otpcode, otpData, otpResponse, mailOptions;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          email = req.body.email;
          Email = email;

          if (email) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: "Plz filled the field properly"
          }));

        case 5:
          _context3.next = 7;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 7:
          userLogin = _context3.sent;

          if (userLogin) {
            _context3.next = 12;
            break;
          }

          res.status(400).json({
            error: "Invalid Email"
          });
          _context3.next = 19;
          break;

        case 12:
          otpcode = Math.floor(Math.random() * 10000 + 1);
          otpData = new Otp({
            email: email,
            code: otpcode,
            expireIn: new Date().getTime() + 300 * 1000
          });
          _context3.next = 16;
          return regeneratorRuntime.awrap(otpData.save());

        case 16:
          otpResponse = _context3.sent;
          mailOptions = {
            from: 'emailsender881@gmail.com',
            to: email,
            subject: 'Your OTP',
            text: 'Your OTP is ' + otpcode
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              res.json({
                message: "Email verified and OTP has been sent"
              });
            }
          });

        case 19:
          _context3.next = 24;
          break;

        case 21:
          _context3.prev = 21;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);

        case 24:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 21]]);
});
router.post('/OtpVerify', function _callee4(req, res) {
  var code, email, data, currentTime, diff;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          code = req.body.code;
          email = Email;
          _context4.next = 5;
          return regeneratorRuntime.awrap(Otp.find({
            email: email,
            code: code
          }));

        case 5:
          data = _context4.sent;
          console.log(data);

          if (data) {
            currentTime = new Date().getTime();
            diff = data.expireIn - currentTime;

            if (diff < 0) {
              res.status(400).json({
                error: "Invalid OTP"
              });
            } else {
              res.json({
                message: "OTP verified"
              });
            }
          } else {
            res.status(400).json({
              error: "Invalid OTP"
            });
          }

          _context4.next = 13;
          break;

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
router.post('/ResetPass', function _callee5(req, res) {
  var password, email, newPassword, result;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          password = req.body.password;
          email = Email;
          newPassword = password;
          console.log("new Password", newPassword, email);
          _context5.next = 7;
          return regeneratorRuntime.awrap(bcrypt.hash(newPassword, 12));

        case 7:
          newPassword = _context5.sent;
          _context5.next = 10;
          return regeneratorRuntime.awrap(User.updateOne({
            email: email
          }, {
            $set: {
              password: newPassword
            }
          }));

        case 10:
          result = _context5.sent;
          res.status(201).json({
            message: "Reset password successfully"
          });
          _context5.next = 17;
          break;

        case 14:
          _context5.prev = 14;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);

        case 17:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
router.post('/signin', function _callee6(req, res) {
  var _req$body3, email, password, token, userLogin, isMatch;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _req$body3 = req.body, email = _req$body3.email, password = _req$body3.password;

          if (!(!email || !password)) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            error: "Pz filled the field properly"
          }));

        case 4:
          _context6.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 6:
          userLogin = _context6.sent;

          if (!userLogin) {
            _context6.next = 19;
            break;
          }

          _context6.next = 10;
          return regeneratorRuntime.awrap(bcrypt.compare(password, userLogin.password));

        case 10:
          isMatch = _context6.sent;
          _context6.next = 13;
          return regeneratorRuntime.awrap(userLogin.generateAuthToken());

        case 13:
          token = _context6.sent;
          console.log(token);
          res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000),
            httpOnly: true
          });

          if (!isMatch) {
            res.status(400).json({
              error: "Invalid Credientials"
            });
          } else {
            res.json({
              message: "user signin successfully"
            });
          }

          _context6.next = 20;
          break;

        case 19:
          res.status(400).json({
            error: "Invalid Credientials"
          });

        case 20:
          _context6.next = 25;
          break;

        case 22:
          _context6.prev = 22;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);

        case 25:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 22]]);
});
router.get('/about', authenticate, function (req, res) {
  //  console.log("Hello my About");
  res.send(req.rootUser);
}); //get user data for contact us

router.get('/getdata', authenticate, function (req, res) {
  //  console.log("Hello my About");
  res.send(req.rootUser);
});
router.post('/contact', authenticate, function _callee7(req, res) {
  var _req$body4, name, email, phone, message, userContact, userMessage;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _req$body4 = req.body, name = _req$body4.name, email = _req$body4.email, phone = _req$body4.phone, message = _req$body4.message;

          if (!(!name || !email || !phone || !message)) {
            _context7.next = 4;
            break;
          }

          return _context7.abrupt("return", res.json({
            error: "plss filled the context form"
          }));

        case 4:
          _context7.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            _id: req.userID
          }));

        case 6:
          userContact = _context7.sent;

          if (!userContact) {
            _context7.next = 14;
            break;
          }

          _context7.next = 10;
          return regeneratorRuntime.awrap(userContact.addMessage(name, email, phone, message));

        case 10:
          userMessage = _context7.sent;
          _context7.next = 13;
          return regeneratorRuntime.awrap(userContact.save());

        case 13:
          res.status(201).json({
            message: "user Contact successfully"
          });

        case 14:
          _context7.next = 19;
          break;

        case 16:
          _context7.prev = 16;
          _context7.t0 = _context7["catch"](0);
          console.log(_context7.t0);

        case 19:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 16]]);
});
router.get('/logout', function (req, res) {
  // console.log("Hello my logout page");
  res.clearCookie('jwtoken', {
    path: '/'
  });
  res.status(200).send('User logout');
});
router.get('/SendRequest', function (req, res) {
  User.find({}, {
    username: 1,
    name: 1,
    work: 1,
    email: 1,
    phone: 1,
    _id: 0
  }).then(function (result) {
    res.send(result);
  })["catch"](function (err) {
    console.log(err);
  });
});
router.get('/ReceiveRequest', function _callee8(req, res) {
  var meeting, user;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(Meeting.find({}, {
            sender: 1,
            username: 1,
            date: 1,
            location: 1,
            restaurant: 1,
            status: 1,
            condition: 1,
            _id: 1
          }));

        case 3:
          meeting = _context8.sent;
          _context8.next = 6;
          return regeneratorRuntime.awrap(User.find({}, {
            username: 1,
            name: 1,
            email: 1,
            phone: 1,
            _id: 0
          }));

        case 6:
          user = _context8.sent;
          res.status(200).send({
            meeting: meeting,
            user: user
          }); // console.log(meeting, user)

          _context8.next = 13;
          break;

        case 10:
          _context8.prev = 10;
          _context8.t0 = _context8["catch"](0);
          console.log(_context8.t0);

        case 13:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
router.get('/MeetingStatus', function (req, res) {
  Meeting.find({}, {
    sender: 1,
    username: 1,
    date: 1,
    location: 1,
    restaurant: 1,
    status: 1,
    _id: 1
  }).then(function (result) {
    res.send(result);
  })["catch"](function (err) {
    console.log(err);
  });
});
router.post('/ReceiveRequest', function _callee9(req, res) {
  var _req$body5, id, status, condition, result;

  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _req$body5 = req.body, id = _req$body5.id, status = _req$body5.status, condition = _req$body5.condition; // console.log("Yash Patel",id,status,condition)

          _context9.next = 4;
          return regeneratorRuntime.awrap(Meeting.updateOne({
            _id: id
          }, {
            $set: {
              status: status,
              condition: condition
            }
          }));

        case 4:
          result = _context9.sent;
          res.status(201).json({
            message: "Response sent successfully"
          });
          _context9.next = 11;
          break;

        case 8:
          _context9.prev = 8;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0);

        case 11:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
module.exports = router;