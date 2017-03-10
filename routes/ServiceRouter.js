'use strict';

const validate = require('express-validation');
const ParamValidation = require('../config/ParamValidation');

const controller = require('../controllers');
const AuthCtrl = controller.AuthCtrl;
const UserCtrl = controller.UserCtrl;
const TeamCtrl = controller.TeamCtrl;
const PostCtrl = controller.PostCtrl;
const TestCtrl = controller.TestCtrl;

module.exports = (router) => {
  // USER
  router.route('/user/register')
    .post(validate(ParamValidation.user_register), UserCtrl.register);
  router.route('/user/login')
    .post(validate(ParamValidation.user_login), UserCtrl.login);


  // TEAM
  router.route('/team')
    .post(AuthCtrl.auth, validate(ParamValidation.team_create), TeamCtrl.create);
  router.route('/team/:team_idx')
    .get(validate(ParamValidation.team_retrieve), TeamCtrl.retrieve); // 팀 메인페이지 조회
  router.route('/team/:team_idx/apply')
    .post(AuthCtrl.auth, validate(ParamValidation.team_apply), TeamCtrl.apply)
    .put(AuthCtrl.auth, validate(ParamValidation.team_confirm), TeamCtrl.confirm);

  // POST
  router.route('/team/:team_idx/post')
    .get(validate(ParamValidation.post_retrieve), PostCtrl.retrieve) // 담벼락 조회
    .post(AuthCtrl.auth, validate(ParamValidation.post_write), PostCtrl.write); // 담벼락 쓰기
  router.route('/team/:team_idx/post/:post_idx')
    .put(AuthCtrl.auth, validate(ParamValidation.post_edit), PostCtrl.edit) //담벼락 수정
    .delete(AuthCtrl.auth, PostCtrl.delete); // 담벼락 삭제
  
  // TEST
  router.route('/team/:team_idx/test')
    .get(AuthCtrl.auth, validate(ParamValidation.test_retrieve), TestCtrl.retrieve)
    .post(AuthCtrl.auth, validate(ParamValidation.test_create), TestCtrl.create);

  return router;
};