'use strict';

exports.getConnection = (pool) => {
  return new Promise((resolve, reject) => {

    pool.getConnection((err, conn) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(conn);
      }
    });
  });
};

exports.beginTransaction = (conn) => {
  return new Promise((resolve, reject) => {

    conn.beginTransaction((err) => {
      if (err) {
        return reject(err);
      } else{
        return resolve(conn);
      }
    });
  });
};