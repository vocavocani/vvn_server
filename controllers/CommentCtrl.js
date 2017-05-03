'use strict';

const commentModel = require('../models/CommentModel');
const teamModel = require('../models/TeamModel');

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
