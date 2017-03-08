'use strict';

const mysql = require('mysql');
const DBConfig = require('./../config/DBConfig');
const pool = mysql.createPool(DBConfig);
const transactionWrapper = require('./TransactionWrapper');


//담벼락 조회
/**
 * TODO 조회값 추가
 * Post retrieve
 * @param team_idx
 */
exports.retrieve = (team_idx) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT p.post_idx, p.user_idx, p.team_idx, p.post_contents, p.post_uploadtime, p.post_updatetime, u.user_nickname " +
        "FROM post as p " +
        "LEFT JOIN user as u ON p.user_idx = u.user_idx " +
        "WHERE p.team_idx = ?";

    pool.query(sql, team_idx, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// 담벼락 쓰기 권한 체크
/**
 * team member permission check
 * @param check_data = {user_idx, team_idx}
 */
exports.teamMemberCheck = (...check_data) => {
  return new Promise((resolve, reject) => {
      const sql =
        "SELECT team_member_permission " +
        "FROM team_member " +
        "WHERE user_idx =? AND team_idx =?";


      pool.query(sql, check_data, (err, rows) => {
        if (err){
          reject(err);
        } else {
          if ( rows[0].team_member_permission == 1 || rows[0].team_member_permission == 0) { // 팀장(1) or 팀원(0) 이면 작성가능
            resolve(null);
          } else {
            reject(9402);
          }
        }
      });
  });
};




// 담벼락 쓰기
/**
 * Post write
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



// 담벼락 수정/삭제 권한 확인
// 본인이 작성한 글만 수정삭제 가능
// 팀장은 팀원이 작성한 글 !삭!제!만 예외로 가능
// 팀에 속해야함 and 본인이 써야함


exports.editPermissionCheck = (...check_data) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT user_idx " +
      "FROM post " +
      "WHERE user_idx =? AND post_idx =? ";

    pool.query(sql, check_data, (err, rows) => {
      console.log(rows[0]);
      console.log(check_data[0]);
      if (err) {
        reject(err);
      }else {
        if (rows[0].user_idx == check_data[0]){
          resolve(null);
        } else {
          reject(9402);
        }
      }
    })
  })
};


// 담벼락 수정
exports.edit = (post_data) => {
  return new Promise((resolve, reject) => {

    const sql =
      "UPDATE post SET post_contents = ? "+
      "WHERE user_idx = ? AND post_idx =? ";

    pool.query(sql, post_data, (err, rows) => {
      if(err){
        reject(err);
      } else {
        if (rows.affectedRows == 1){ // 담벼락 수정 시도
          resolve(rows);
        } else {
          const _err = new Error("Post Edit Error");
          reject(_err);
        }
      }
    });

  });
};



// 담벼락 삭제
exports.delete = () => {

};