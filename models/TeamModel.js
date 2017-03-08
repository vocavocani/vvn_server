'use strict';

const mysql = require('mysql');
const DBConfig = require('./../config/DBConfig');
const pool = mysql.createPool(DBConfig);
const transactionWrapper = require('./TransactionWrapper');

/*******************
 *  Check
 *  @param: team_idx
 ********************/
exports.check = (team_idx) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT team_idx FROM team WHERE team_idx = ?";

    pool.query(sql, team_idx, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        if (rows.length == 0) {
          const _err = new Error("Not found this team");
          reject(_err);
        } else {
          resolve(null);
        }
      }
    });
  });
};

/*******************
 *  Create
 *  @param: team_data = {user_idx, team_name, team_rule, team_category, team_max_cap, team_public}
 ********************/
exports.create = (team_data) => {
  return new Promise((resolve, reject) => {
    transactionWrapper.getConnection(pool)
      .then(transactionWrapper.beginTransaction)
      .then((context) => {
        return new Promise((resolve, reject) => {
          const sql = "INSERT INTO team SET ?";

          context.conn.query(sql, team_data, (err, rows) => {  // 팀 생성
            if (err) {
              context.error = err;
              reject(context);
            } else {
              if (rows.affectedRows == 1) {
                context.result = rows;
                resolve(context);
              } else {
                context.error = new Error("Team Create Custom error");
                reject(context);
              }
            }
          });
        });
      })
      .then((context) => {
        return new Promise((resolve, reject) => {
          const sql = "INSERT INTO team_member(team_idx, user_idx, team_member_permission) values (?, ?, 1)";

          context.conn.query(sql, [context.result.insertId, team_data.user_idx], (err, rows) => {
            if (err) {
              context.error = err;
              reject(context);
            } else {
              if (rows.affectedRows == 1) {
                resolve(context);
              } else {
                context.error = new Error("Team Create Custom error");
                reject(context);
              }
            }
          });
        })
      })
      .then((context) => {
        return new Promise((resolve, reject) => {
          const sql = "SELECT * FROM team WHERE team_idx = ?";

          context.conn.query(sql, [context.result.insertId], (err, rows) => {
            if (err) {
              context.error = err;
              reject(context);
            } else {
              context.result = rows;
              resolve(context);
            }
          });
        })
      })
      .then(transactionWrapper.commitTransaction)
      .then((context) => {
        context.conn.release();
        resolve(context.result);
      })
      .catch((context) => {
        context.conn.rollback(() => {
          context.conn.release();
          reject(context.error);
        });
      });
  });
};

/*******************
 *  Apply
 *  @param: apply_data = {team_idx, user_idx, team_member_apply_msg}
 ********************/
exports.apply = (apply_data) => {
  return new Promise((resolve, reject) => {
      const sql = "INSERT INTO team_member SET ?";

      pool.query(sql, apply_data, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          if (rows.affectedRows == 1) {
            resolve(rows);
          } else {
            const _err = new Error("Team Apply Custom error");
            reject(_err);
          }
        }
      });
    }
  ).then((result) => {
      return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM team_member WHERE team_member_idx = ?";

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

/*******************
 *  Confirm Permission Check
 *  @param: user_idx, team_idx
 ********************/
exports.confirmPermissionCheck = (...check_data) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT team_member_permission " +
      "FROM team_member " +
      "WHERE user_idx = ? AND team_idx = ?";

    pool.query(sql, check_data, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        if (rows[0].team_member_permission == 1) {
          resolve(null);
        } else {
          reject(9402);
        }
      }
    });
  });
};

/*******************
 *  Already Confirm User Check
 *  @param: user_idx, team_idx
 ********************/
exports.alreadyConfirmUserCheck = (...check_data) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT team_member_permission " +
      "FROM team_member " +
      "WHERE user_idx = ? AND team_idx = ?";

    pool.query(sql, check_data, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        if (rows[0].team_member_permission == -1) {
          resolve(null);
        } else {
          reject(1401);
        }
      }
    });
  });
};

/*******************
 *  Confirm
 *  @param: confirm_data = [confirm, user_idx, team_idx]
 ********************/
exports.confirm = (confirm_data) => {
  return new Promise((resolve, reject) => {
      const sql = "UPDATE team_member SET team_member_permission = ? WHERE user_idx = ? AND team_idx = ?";

      pool.query(sql, confirm_data, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          if (rows.affectedRows == 1) {
            resolve([confirm_data[1], confirm_data[2]]);  // user_idx, team_idx
          } else {
            const _err = new Error("Team Confirm Custom error");
            reject(_err);
          }
        }
      });
    }
  ).then((data) => {
      return new Promise((resolve, reject) => {
        const sql =
          "SELECT team_idx, user_idx, team_member_permission " +
          "FROM team_member " +
          "WHERE user_idx = ? AND team_idx = ?";

        
        pool.query(sql, data, (err, rows) => {
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


/**
 * 팀 메인페이지 조회
 * @param team_idx
 */
exports.retrieve = (team_idx) => {
  return new Promise((resolve, reject) => {
    // 조회 값 추가 할것!
    const sql =
          "SELECT team_idx, team_name, team_category_idx, team_ranking, team_rule, team_max_cap, team_created_date " +
          "FROM team " +
          "WHERE team_idx = ? ";
      pool.query(sql, team_idx, (err, rows) => {
          if (err){
            reject(err);
          } else{
            resolve(rows);
          }
      })
  })
};
