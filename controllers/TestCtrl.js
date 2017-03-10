/**
 * Created by nayak on 2016. 12. 16..
 */
'use strict';

const testModel = require('../models/TestModel');
const teamModel = require('../models/TeamModel');
const utils = require('../utils');


/**
 *  Retrieve
 */
exports.retrieve = async (req, res, next) => {
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

    result = await testModel.retrieve(req.params.team_idx, req.user_idx);
    // 시험을 본 사람에 테스트 결과를 tested 변수에 삽입
    result.test_list.forEach((test) => {
      result.test_result_list.some((test_result) => {
        if (test.test_idx == test_result.test_idx) {
          test.tested = test_result;
          return true;
        }
      });
    });
  } catch (error) {
    return next(error);
  }

  // success
  // test_list만 응답 결과로 전송
  return res.json(result.test_list);
};

/**
 *  Create
 *  @param: content = [{question: '', answer: ''}, ...]
 */
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