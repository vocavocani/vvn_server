'use strict';

const mysql = require('mysql');
const DBConfig = require('./DBConfig');
const pool = mysql.createPool(DBConfig);
const transactionWrapper = require('./TransactionWrapper');



// 담벼락 쓰기
/**
 *
 * @param post_data = {user_idx, team_idx, post_contents}
 **/
exports.write = (post_data) => {
  return new Promise((resolve, reject) => {

    const sql = "INSERT INTO post(user_idx, team_idx, post_contents) " +
      "VALUES (?, ?, ?) ";

    pool.query(sql, [post_data.user_idx, post_data.team_idx, post_data.post_contents], (err, rows)=> {
      if (err){
        reject(err);
      } else {
        // resolve(rows);
       if (rows.affectedRows == 1){ // 담벼락 쓰기 시도
          resolve(rows);
        } else {
          const _err = new Error("Post Write Error");
          reject(_err);
        }
      }
    })
  })
};

