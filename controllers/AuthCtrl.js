'use strict';

const userModel = require('../models/AuthModel');

/*******************
 *  Authenticate
 ********************/
exports.auth = (req, res, next) => {
  if (!req.headers.token) {
    return next(401);
  } else {
    userModel.auth(req.headers.token, (err, user_idx) => {
      if (err) {
        return next(err);
      } else {
        req.user_idx = user_idx;
        return next();
      }
    });
  }
};