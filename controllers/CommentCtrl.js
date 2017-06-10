'use strict';

const commentModel = require('../models/CommentModel');
const teamModel = require('../models/TeamModel');
const member_permission = require('../utils').member_permission;


// 담벼락 조회
exports.retrieve = async(req, res, next) => {
  let result = '';

  try {
    result = await commentModel.retrieve(req.params.post_idx);
  } catch (error) {
    return next(error);
  }

  return res.json(result);
};


// 담벼락 쓰기
exports.write = async(req, res, next) => {
  let result = '';

  try {
    //Comment write permission check
    switch (await teamModel.getTeamMemberPermission(req.params.team_idx, req.user_idx)){
      case member_permission.MASTER_MEMBER: break;
      case member_permission.APPROVED_MEMBER: break;
      case null:
        return next(400); break;
      default:
        return next(9402);
    }

    const comment_data = {
      user_idx: req.user_idx,
      post_idx: req.params.post_idx,
      comment_contents: req.body.contents
    };


    result = await commentModel.write(comment_data);
  } catch (error) {
    return next(error);
  }

  return res.json(result);
};
