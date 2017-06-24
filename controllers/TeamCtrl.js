'use strict';

const teamModel = require('../models/TeamModel');
const member_permission = require('../utils').member_permission;

/*******************
 *  My Team List
 ********************/
exports.list = async(req, res, next) => {
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

    result = await teamModel.list(req.user_idx);

  } catch (error) {
    return next(error);
  }

  // success
  return res.json(result);
};

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
    switch (await teamModel.getTeamMemberPermission(req.params.team_idx, req.user_idx)) {
      case member_permission.MASTER_MEMBER: break;
      case null:
        return next(400); break;
      default:
        return next(9402);
    }

    // Already confirm user check
    switch (await teamModel.getTeamMemberPermission(req.params.team_idx, req.body.user_idx)) {
      case member_permission.APPLY_MEMBER: break;
      case null:
        return next(400); break;
      default:
        return next(1405);
    }

    // Confirm Logic
    const permission = req.body.is_accept ? member_permission.APPROVED_MEMBER : member_permission.REJECTED_MEMBER;
    const confirm_data = [permission, req.body.user_idx, req.params.team_idx];

    result = await teamModel.confirm(confirm_data);

  } catch (error) {
    return next(error);
  }

  // success
  return res.json(result);
};


/*******************
 *  Detail retrieve
 ********************/
exports.retrieve = async(req, res, next) => {
  let result = '';
  try {
    result = await teamModel.retrieve(req.params.team_idx);
  } catch (error) {
    return next(error);
  }
  return res.json(result);
};





