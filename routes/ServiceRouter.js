'use strict';

const AuthCtrl = require('../controllers/AuthCtrl');
const UserCtrl = require('../controllers/UserCtrl');

exports.serviceRouter = (app) => {
  // User
  app.route('/api/user/register')
    .post(UserCtrl.register);
  app.route('/api/user/login')
    .post(UserCtrl.login);
};