'use strict';

const controller = require('../controllers');
const AuthCtrl = controller.AuthCtrl;
const UserCtrl = controller.UserCtrl;
const TeamCtrl = controller.TeamCtrl;

module.exports = (router) => {
  // USER
  router.route('/user/register')
    .post(UserCtrl.register);
  router.route('/user/login')
    .post(UserCtrl.login);

  // TEAM
  router.route('/team')
    .post(AuthCtrl.auth, TeamCtrl.create);
  return router;
};
