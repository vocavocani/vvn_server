'use strict';

const mysql = require('mysql');
const DBConfig = require('./DBConfig');
const pool = mysql.createPool(DBConfig);

const jwt = require('jsonwebtoken');
const config = require('../config');

/*******************
 *  Authenticate
 *  @param: token
 ********************/
exports.auth = (token, done) => {
  jwt.verify(token, config.jwt.cert, (err, decoded) => {
    if (err) {
      return done(err);
    } else {
      const sql = "SELECT user_idx FROM user WHERE user_id = ?";

      pool.query(sql, [decoded.id], (err, rows) => {
        if (err) {
          return done(err);
        } else {
          if (rows.length == 0) {
            return done(401);
          } else {  // 인증 성공
            return done(null, rows[0].user_idx);
          }
        }
      })
    }
  });
};
