'use strict';

const teamModel = require('../models/TeamModel');

/*******************
 *  Create
 ********************/
exports.create = async(req, res, next) => {
  let result = '';

  try {
    const team_data = {
      user_idx: req.user_idx,
      team_name: req.body.name,
      team_rule: req.body.rule,
      team_category_idx: req.body.category,
      team_max_cap: req.body.max_cap,
      team_is_public: req.body.is_public
    };

    result = await teamModel.create(team_data);

  } catch (error) {
    return next(error);
  }

  // success
  return res.json(result);
};

/*******************
 *  Apply
 ********************/
exports.apply = async(req, res, next) => {
  let result = '';

  try {
    // TEAM Checking
    await teamModel.check(req.params.team_idx);

    // TEAM apply
    const apply_data = {
      team_idx: req.params.team_idx,
      user_idx: req.user_idx,
      team_member_apply_msg: req.body.message
    };

    result = await teamModel.apply(apply_data);

  } catch (error) {
    return next(error);
  }

  // success
  return res.json(result);
};

/*******************
 *  Confirm
 ********************/
exports.confirm = async(req, res, next) => {
  let result = '';

  try {
    // Team master permission check
    await teamModel.confirmPermissionCheck(req.user_idx, req.params.team_idx);

    // Already confirm user check
    await teamModel.alreadyConfirmUserCheck(req.body.user_idx, req.params.team_idx);

    // Confirm Logic
    const permission = req.body.is_accept ? 0 : -2;  // 0: 정회원, -2: 거절된 회원
    const confirm_data = [permission, req.body.user_idx, req.params.team_idx];

    result = await teamModel.confirm(confirm_data);

  } catch (error) {
    return next(error);
  }

  // success
  return res.json(result);
};


// 팀 메인페이지 조회
exports.retrieve = async(req, res, next) => {
  let result = '';
  try {
    result = await teamModel.retrieve(req.params.team_idx);
  } catch (error) {
    return next(error);
  }
  return res.json(result);
};





