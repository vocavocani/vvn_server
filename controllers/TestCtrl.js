/**
 * Created by nayak on 2016. 12. 16..
 */
'use strict';

const testModel = require('../models/TestModel');
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
    // TODO - 유저가 팀의 사람인지 판단하는 과정이 필요

    const test_data = {
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