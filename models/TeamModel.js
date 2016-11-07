'use strict';

const mysql = require('mysql');
const DBConfig = require('./DBConfig');
const pool = mysql.createPool(DBConfig);
const transactionWrapper = require('./TransactionWrapper');

/*******************
 *  Create
 *  @param: team_data = {user_idx, team_name, team_rule, team_category, team_max_cap, team_public}
 ********************/
exports.create = (team_data, done)=> {
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