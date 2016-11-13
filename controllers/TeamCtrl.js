'use strict';

const teamModel = require('../models/TeamModel');

/*******************
 *  Create
 ********************/
exports.create = async (req, res, next) => {
  if (!req.body.name || !req.body.max_cap || !req.body.category || !req.body.rule || !req.body.public) {  // parameter check
    return next(9401);
  } else {
    let result = '';

    try {
      const team_data = {
        user_idx: req.user_idx,
        team_name: req.body.name,
        team_rule: req.body.rule,
        team_category_idx: req.body.category,
        team_max_cap: req.body.max_cap,
        team_public: req.body.public
      };

      result = await teamModel.create(team_data);

    } catch(error) {
      return next(error);
    }

    // success
    return res.json(result);
  }
};

/*******************
 *  Apply
 ********************/
exports.apply = async (req, res, next) => {
  if (!req.params.team_idx) {  // parameter check
    return next(9401);
  } else {
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

    } catch(error) {
      return next(error);
    }

    // success
    return res.json(result);
  }
};

/*******************
 *  Confirm
 ********************/
exports.confirm = async (req, res, next) => {
  if (!req.params.team_idx || !req.body.user_idx || !req.body.confirm ||
    !(req.body.confirm == 0 || req.body.confirm == 1)) {  // parameter check
    return next(9401);
  } else {
    let result = '';

    try {
      // Team master permission check
      await teamModel.confirmPermissionCheck(req.user_idx, req.params.team_idx);

      // Already confirm user check
      await teamModel.alreadyConfirmUserCheck(req.body.user_idx, req.params.team_idx);

      // Confirm Logic
      const confirm = (req.body.confirm == 0) ? 0 : -2;  // 0: 정회원, -2: 거절된 회원
      const confirm_data = [confirm, req.body.user_idx, req.params.team_idx];

      result = await teamModel.confirm(confirm_data);

    } catch(error) {
      return next(error);
    }

    // success
    return res.json(result);
  }
};