'use strict';

const controller = require('../controllers');
const AuthCtrl = controller.AuthCtrl;
const UserCtrl = controller.UserCtrl;
const TeamCtrl = controller.TeamCtrl;
const PostCtrl = controller.PostCtrl;

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
    .get(TeamCtrl.main); // 팀 메인페이지 조회

  // POST
  router.route('/post/:team_idx')
    .post(AuthCtrl.auth, PostCtrl.write); // 담벼락 쓰기


  return router;
};
