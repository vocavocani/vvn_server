'use strict';

const controller = require('../controllers');
const AuthCtrl = controller.AuthCtrl;
const UserCtrl = controller.UserCtrl;
const TeamCtrl = controller.TeamCtrl;
const TestCtrl = controller.TestCtrl;

module.exports = (router) => {
  // USER
  router.route('/user/register')
    .post(UserCtrl.register);
  router.route('/user/login')
    .post(UserCtrl.login);


  // TEAM
  router.route('/team')
    .post(AuthCtrl.auth, TeamCtrl.create);
  router.route('/team/:team_idx/apply')
    .post(AuthCtrl.auth, TeamCtrl.apply)
    .put(AuthCtrl.auth, TeamCtrl.confirm);

  router.route('/team/main/:team_idx')
    // .get(AuthCtrl.auth, TeamCtrl.main);
    .get(TeamCtrl.main);
  
  // TEST
  router.route('/:team_idx/test')
    .post(AuthCtrl.auth, TestCtrl.create);

  return router;
};