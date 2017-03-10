/**
 * Created by nayak on 2017. 1. 15..
 */
'use strict';

const mysql = require('mysql');
const DBConfig = require('./../config/DBConfig');
const pool = mysql.createPool(DBConfig);
const transactionWrapper = require('./TransactionWrapper');

/*******************
 *  Create
 *  @param: test_data = {test_title, test_content, test_number, test_date, test_cutline, test_time_limit, test_date_limit, user_idx, team_idx}
 ********************/
exports.create = (test_data) => {
  return new Promise((resolve, reject) => {
      const sql = "INSERT INTO test SET ?";

      pool.query(sql, test_data, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          if (rows.affectedRows == 1) {
            resolve(rows);
          } else {
            const _err = new Error("Create Team Test Custom error");
            reject(_err);
          }
        }
      });
    }
  ).then((result) => {
      return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM test WHERE test_idx = ?";

        pool.query(sql, result.insertId, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
  );
};