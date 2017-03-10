/**
 * Created by nayak on 2017. 1. 15..
 */
'use strict';

const mysql = require('mysql');
const DBConfig = require('./../config/DBConfig');
const pool = mysql.createPool(DBConfig);
const transactionWrapper = require('./TransactionWrapper');

/**
 *  Retrieve
 *  @param: team_idx = team_idx
 */
exports.retrieve = (team_idx, user_idx) => {
  return new Promise((resolve, reject) => {
      const sql =
        "SELECT test_idx, test_title, test_date, test_number, user_idx " +
        "FROM test " +
        "WHERE team_idx = ?";

      pool.query(sql, [team_idx], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    }
  ).then((test_list) => {
    const test_idx_list = [];
    test_list.forEach((test) => {
      test_idx_list.push(test.test_idx);
    });

    return new Promise((resolve, reject) => {
      const sql =
        "SELECT test_result_idx, test_result_correct_number, test_idx " +
        "FROM test_result " +
        "WHERE user_idx = ? AND test_idx IN ?";

      pool.query(sql, [user_idx, [test_idx_list]], (err, rows) => {
        if (err) {
          reject(err);
        } else{
          const result = {
            test_list,
            test_result_list: rows
          };
          resolve(result);
        }
      });
    })
  });
};


/**
 *  Create
 *  @param: test_data = {test_title, test_content, test_number, test_date, test_cutline, test_time_limit, test_date_limit, user_idx, team_idx}
 */
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