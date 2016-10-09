'use strict';

const controller = require('../controllers');
const AuthCtrl = controller.AuthCtrl;
const UserCtrl = controller.UserCtrl;

module.exports = (router) => {
  router.route('/user/register')
    .post(UserCtrl.register);
  router.route('/user/login')
    .post(UserCtrl.login);
  return router;
}
