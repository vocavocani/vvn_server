'use strict';

const postModel = require('../models/PostModel');


// 담벼락 조회
exports.retrieve = async (req,res,next) => {
  if (!req.params.team_idx){ //파라미터 체크
    return next(9401);
  } else {

    let result ='';

      try{
        result = await postModel.retrieve(req.params.team_idx);
      }catch (error){
        return next(error);
      }

      return res.json(result);
  }

};

// 담벼락 쓰기
exports.write = async (req, res, next) => {
  if (!req.params.team_idx||!req.body.contents){
    return next(9401);
  }
  else {
    let result ='';

    try {
      //Post write permission check

      await postModel.teamMemberCheck(req.user_idx, req.params.team_idx);

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




//담벼락 수정
exports.edit = async (req,res,next) => {
  if (!req.params.team_idx || !req.params.post_idx || !req.body.post_contents){ //파라미터 체크
      return next(9401);
  } else {
      let result = '';

      try{
      //Post edit permission check

        await postModel.editPermissionCheck(req.user_idx, req.params.post_idx);

        const post_data = [
          req.body.post_contents,
          req.user_idx,
          req.params.post_idx
        ];

        result = await postModel.edit(post_data);

      }catch (error){
        return next(error);
      }
      return res.json(result);
  }

};



// 담벼락 삭제
exports.delete = async (req,res,next) => {

};