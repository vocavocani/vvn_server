'use strict';

const userModel = require('../models/userModel');
const config = require('../config');

/*******************
 *  Register
 ********************/
exports.register = async (req, res, next) => {
  const regType = /^[A-Za-z0-9+]*$/;  // only en, num
  if (!req.body.id || !req.body.nickname || !req.body.pw_1 || !req.body.pw_2) {  // parameter check
    return next(9401);
  }

  // Wrong param
  if (!regType.test(req.body.id) || req.body.pw_1 != req.body.pw_2) {
    return next(400);
  }

  let result = '';
  try {
    const user_data = {
      user_id: req.body.id,
      user_password: config.do_ciper(req.body.pw_2),
      user_nickname: req.body.nickname
    };

    result = await userModel.register(user_data);

  } catch (error) {
    return next(error);
  }

  // success
  return res.json(result);
};

/*******************
 *  Login
 ********************/
exports.login = async (req, res, next) => {
  if (!req.body.id || !req.body.pw) {  // parameter check
    return next(9401);
  } else {
    let result = '';

    try {
      const user_data = {
        user_id: req.body.id,
        user_password: config.do_ciper(req.body.pw)
      };

      result = await userModel.login(user_data);
    } catch (error) {
      return next(error);
    }

    // success
    return res.header('token', result.token).json(result.profile);
  }
};