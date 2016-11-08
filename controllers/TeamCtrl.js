'use strict';

const teamModel = require('../models/TeamModel');

/*******************
 *  Create
 ********************/
exports.create = (req, res, next) => {
  if (!req.body.name || !req.body.max_cap || !req.body.category || !req.body.rule || !req.body.public) {  // parameter check
    return next(9401);
  } else {
    const team_data = {
      user_idx: req.user_idx,
      team_name: req.body.name,
      team_rule: req.body.rule,
      team_category_idx: req.body.category,
      team_max_cap: req.body.max_cap,
      team_public: req.body.public
    };

    teamModel.create(team_data, (err, result) =>{
      if (err) {
        return next(err);
      } else {
        return res.json(result);
      }
    });
  }
};

/*******************
 *  Apply
 ********************/
exports.apply = async (req, res, next) => {
  if (!req.params.team_idx) {  // parameter check
    return next(9401);
  } else {
    // TEAM Checking
    try {
      await teamModel.check(req.params.team_idx);
    } catch(error) {
      return next(error);
    }

    // TEAM apply
    const apply_data = {
      team_idx: req.params.team_idx,
      user_idx: req.user_idx,
      team_member_apply_msg: req.body.message
    };

    teamModel.apply(apply_data, (err, result) => {
      if (err) {
        return next(err);
      } else {
        return res.json(result);
      }
    });
  }
};