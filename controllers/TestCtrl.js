/**
 * Created by nayak on 2016. 12. 16..
 */
'use strict';

const testModel = require('../models/TestModel');
const teamModel = require('../models/TeamModel');
const utils = require('../utils');

/*******************
 *  Create
 *  @param: content = [{question: '', answer: ''}, ...]
 ********************/
exports.create = async (req, res, next) => {
  if (req.body.content.length < 4) {  // 문제는 최소 4개 이상
    return next(400);
  }

  let result = '';

  try {
    // Team Member Check
    switch (await teamModel.getTeamMemberPermission(req.params.team_idx, req.user_idx)){
      case utils.member_permission.MASTER_MEMBER: break;
      case utils.member_permission.APPROVED_MEMBER: break;
      case null:
        return next(400); break;
      default:
        return next(9402);
    }

    const test_data = {
      test_title: req.body.title,
      test_content: utils.makeTestContent(req.body.content),
      test_number: req.body.content.length,
      test_date: req.body.date,
      test_cutline: req.body.cutline,
      test_time_limit: req.body.time_limit,
      test_date_limit: req.body.date_limit,
      team_idx: req.params.team_idx,
      user_idx: req.user_idx
    };

    result = await testModel.create(test_data);

  } catch (error) {
    return next(error);
  }

  // success
  return res.json(result);
};