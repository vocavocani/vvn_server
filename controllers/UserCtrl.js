'use strict';

const userModel = require('../models/userModel');
const config = require('../config');

/*******************
 *  Register
 ********************/
exports.register = (req, res, next) => {
  const regType = /^[A-Za-z0-9+]*$/;  // only en, num
  if (!req.body.id || !req.body.nickname || !req.body.pw_1 || !req.body.pw_2) {  // parameter check
    return next(9401);
  }

  // Wrong param
  if (!regType.test(req.body.id) || req.body.pw_1 != req.body.pw_2) {
    return next(400);
  }

  const user_data = {
    user_id: req.body.id,
    user_password: config.do_ciper(req.body.pw_2),
    user_nickname: req.body.nickname
  };

  userModel.register(user_data, (err) => {
    if (err) {
      return next(err);
    }
    return res.json();
  });
};

/*******************
 *  Login
 ********************/
exports.login = (req, res, next) => {
  if (!req.body.id || !req.body.pw) {  // parameter check
    return next(9401);
  } else {
    const user_data = {
      user_id: req.body.id,
      user_password: config.do_ciper(req.body.pw)
    };

    userModel.login(user_data, (err, token) =>{
      if (err) {
        return next(err);
      } else {
        return res.header('token', token).json();
      }
    });
  }
};