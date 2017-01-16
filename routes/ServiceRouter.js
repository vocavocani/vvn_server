'use strict';

const controller = require('../controllers');
const AuthCtrl = controller.AuthCtrl;
const UserCtrl = controller.UserCtrl;
const TeamCtrl = controller.TeamCtrl;
const PostCtrl = controller.PostCtrl;
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
    .get(TeamCtrl.retrieve); // 팀 메인페이지 조회

  // POST
  router.route('/team/:team_idx/post')
    .get(PostCtrl.retrieve) // 담벼락 조회
    .post(AuthCtrl.auth, PostCtrl.write); // 담벼락 쓰기
  router.route('/team/:team_idx/post/:post_idx')
    .put(AuthCtrl.auth, PostCtrl.edit) //담벼락 수정
    .delete(AuthCtrl.auth, PostCtrl.delete); // 담벼락 삭제

  // TEST
  router.route('/:team_idx/test')
    .post(AuthCtrl.auth, TestCtrl.create);

  return router;
};