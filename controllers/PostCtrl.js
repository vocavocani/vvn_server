'use strict';

const postModel = require('../models/PostModel');
const teamModel = require('../models/TeamModel');
const member_permission = require('../utils').member_permission;


// 담벼락 조회
exports.retrieve = async(req, res, next) => {
  let result = '';

  try {
    result = await postModel.retrieve(req.params.team_idx);
  } catch (error) {
    return next(error);
  }

  return res.json(result);
};

// 담벼락 쓰기
exports.write = async(req, res, next) => {
  let result = '';

  try {
    //Post write permission check
    switch (await teamModel.getTeamMemberPermission(req.params.team_idx, req.user_idx)){
      case member_permission.MASTER_MEMBER: break;
      case member_permission.APPROVED_MEMBER: break;
      case null:
        return next(400); break;
      default:
        return next(9402);
    }

    const post_data = {
      user_idx: req.user_idx,
      team_idx: req.params.team_idx,
      post_contents: req.body.contents
    };

    result = await postModel.write(post_data);
  } catch (error) {
    return next(error);
  }

  return res.json(result);
};


//담벼락 수정
exports.edit = async(req, res, next) => {
  let result = '';

  try {
    //Post edit permission check

    await postModel.editPermissionCheck(req.user_idx, req.params.post_idx);

    const post_data = [
      req.body.contents,
      req.user_idx,
      req.params.post_idx
    ];

    result = await postModel.edit(post_data);

  } catch (error) {
    return next(error);
  }
  return res.json(result);
};


// 담벼락 삭제
exports.delete = async(req, res, next) => {

};