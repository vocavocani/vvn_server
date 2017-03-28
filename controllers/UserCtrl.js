'use strict';

const userModel = require('../models/userModel');
const config = require('../config/config');

/*******************
 *  Register
 ********************/
exports.register = async(req, res, next) => {
  if (req.body.pw_1 != req.body.pw_2) {
    return next(1204);
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
exports.login = async(req, res, next) => {
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
  return res.json(result);
};