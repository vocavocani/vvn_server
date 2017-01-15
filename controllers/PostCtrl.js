'use strict';

const postModel = require('../models/PostModel');


// 담벼락 쓰기
exports.write = async (req, res, next) => {
  if (!req.params.team_idx||!req.body.contents){
    return next(9401);
  }
  else {
    let result ='';

    try {
      const post_data = {
        user_idx: req.user_idx,
        team_idx: req.params.team_idx,
        post_contents: req.body.contents
      };

      result = await postModel.write(post_data);
    }catch (error){
      return next(error);
    }

    return res.json(result);
  }
};