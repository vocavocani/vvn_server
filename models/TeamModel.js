'use strict';

const mysql = require('mysql');
const DBConfig = require('./DBConfig');
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
        return reject(err);
      } else {
        if (rows.length == 0) {
          const _err = new Error("Not found this team");
          return reject(_err);
        } else {
          return resolve(null);
        }
      }
    });
  });
};

/*******************
 *  Create
 *  @param: team_data = {user_idx, team_name, team_rule, team_category, team_max_cap, team_public}
 ********************/
exports.create = (team_data, done) => {
  new Promise((resolve, reject) => {
    transactionWrapper.getConnection(pool)
      .then(transactionWrapper.beginTransaction)
      .then((context) => {
        return new Promise((resolve, reject) => {
          const sql = "INSERT INTO team SET ?";

          context.conn.query(sql, team_data, (err, rows) => {  // 팀 생성
            if (err) {
              context.error = err;
              return reject(context);
            } else {
              if (rows.affectedRows == 1) {
                context.result = rows;
                return resolve(context);
              } else {
                context.error = new Error("Team Create Custom error");
                return reject(context);
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
              return reject(context);
            } else {
              if (rows.affectedRows == 1) {
                return resolve(context);
              } else {
                context.error = new Error("Team Create Custom error");
                return reject(context);
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
              return reject(context);
            } else {
              context.result = rows;
              return resolve(context);
            }
          });
        })
      })
      .then(transactionWrapper.commitTransaction)
      .then((context) => {
        context.conn.release();
        return done(null, context.result);
      })
      .catch((context) => {
        context.conn.rollback(() => {
          context.conn.release();
          return done(context.error);
        });
      });
  });
};

/*******************
 *  Apply
 *  @param: apply_idx = {team_idx, user_idx, team_member_apply_msg}
 ********************/
exports.apply = (apply_data, done) => {
  new Promise((resolve, reject) => {
      const sql = "INSERT INTO team_member SET ?";

      pool.query(sql, apply_data, (err, rows) => {
        if (err) {
          return reject(err);
        } else {
          if (rows.affectedRows == 1) {
            return resolve(rows);
          } else {
            const _err = new Error("Team Apply Custom error");
            return reject(_err);
          }
        }
      });
    }
  ).then((result) => {
      return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM team_member WHERE team_member_idx = ?";

        pool.query(sql, result.insertId, (err, rows) => {
          if (err) {
            return reject(err);
          } else {
            return resolve(rows);
          }
        });
      });
    })
    .then((result) => {
      return done(null, result);
    })
    .catch((err) => {
      return done(err);
    });
};