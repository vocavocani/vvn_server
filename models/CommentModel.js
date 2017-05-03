'use strict';

const mysql = require('mysql');
const DBConfig = require('./../config/DBConfig');
const pool = mysql.createPool(DBConfig);
const transactionWrapper = require('./TransactionWrapper');


/**
 * Comment retrieve
 * @param post_idx
 * @returns {Promise}
 */
exports.retrieve = (post_idx) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT c.comment_idx, c.post_idx, c.comment_contents, u.user_nickname " +
      "FROM comment as c " +
      "LEFT JOIN user as u ON c.user_idx = u.user_idx " +
      "WHERE c.post_idx = ? ";

    pool.query(sql, post_idx, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

