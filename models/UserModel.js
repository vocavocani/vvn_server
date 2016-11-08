'use strict';

const mysql = require('mysql');
const DBConfig = require('./DBConfig');
const pool = mysql.createPool(DBConfig);

const jwt = require('jsonwebtoken');
const config = require('../config');

/*******************
 *  Register
 *  @param: user_data = {user_id, user_password, user_nickname}
 ********************/
exports.register = (user_data, done) => {
  new Promise((resolve, reject) => {
      const sql = "SELECT user_id FROM user WHERE user_id = ?";

      pool.query(sql, [user_data.user_id], (err, rows) => {  // 아이디 중복 체크
        if (err) {
          return reject(err);
        } else {
          if (rows.length != 0) {  // 이미 아이디 존재
            return reject(1201);
          }else{
            return resolve(null);
          }
        }
      });
    }
  ).then(() => {
      return new Promise((resolve, reject) => {
        const sql = "INSERT INTO user SET ?";

        pool.query(sql, user_data, (err, rows) => {  // 가입 시도
          if (err) {
            return reject(err);
          } else {
            if (rows.affectedRows == 1) {
              return resolve(null);
            } else {
              const _err = new Error("User Register Custom error");
              return reject(_err);
            }
          }
        });
      });
    })
    .then(() => {
      return done(null);
    })
    .catch((err) => {
      return done(err);
    });
};

/*******************
 *  Login
 *  @param: user_data = {user_id, user_password}
 ********************/
exports.login = (user_data, done) => {
  new Promise((resolve, reject) => {
      const sql = "SELECT user_id FROM user WHERE user_id = ?";

      pool.query(sql, [user_data.user_id], (err, rows) => {  // 아이디 존재 검사
        if (err) {
          return reject(err);
        } else {
          if (rows.length == 0) {  // 아이디 없음
            return reject(1202);
          } else {
            return resolve(null);
          }
        }
      });
    }
  ).then(() => {
      return new Promise((resolve, reject) => {
        const sql =
          "SELECT user_id, user_nickname " +
          "FROM user " +
          "WHERE user_id = ? and user_password = ?";

        pool.query(sql, [user_data.user_id, user_data.user_password], (err, rows) => {
          if (err) {
            return reject(err);
          } else {
            if (rows.length == 0) {  // 비밀번호 틀림
              return reject(1203);
            } else {
              const profile = {
                id: rows[0].user_id,
                nickname: rows[0].user_nickname
              };
              const token = jwt.sign(profile, config.jwt.cert, {'expiresIn': "10h"});

              return resolve(token);
            }
          }
        });
      });
    })
    .then((token) => {
      done(null, token);
    })
    .catch((err) => {
      done(err);
    });
};