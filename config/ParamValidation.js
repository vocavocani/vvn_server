const Joi = require('joi');

module.exports = {
  /*
   USER Validation
   */
  // POST - /user/register
  user_register: {
    body: {
      id: Joi.string().regex(/^[A-Za-z0-9+]*$/).required(),
      nickname: Joi.string().required(),
      pw_1: Joi.string().required(),
      pw_2: Joi.string().required()
    }
  },
  // POST - /user/login
  user_login: {
    body: {
      id: Joi.string().regex(/^[A-Za-z0-9+]*$/).required(),
      pw: Joi.string().required()
    }
  },


  /*
   TEAM Validation
   */
  // POST - /team
  team_create: {
    body: {
      name: Joi.string().required(),
      max_cap: Joi.number().required(),
      category: Joi.string().required(),
      rule: Joi.string().required(),
      is_public: Joi.string().required()
    }
  },
  // GET - /team/:team_idx
  team_retrieve: {
    params: {
      team_idx: Joi.number().required()
    }
  },
  // POST - /team/:team_idx/apply
  team_apply: {
    params: {
      team_idx: Joi.number().required()
    }
  },
  // PUT - /team/:team_idx/apply
  team_confirm: {
    body: {
      user_idx: Joi.string().required(),
      is_accept: Joi.boolean().required(),
    },
    params: {
      team_idx: Joi.number().required()
    }
  },


  /*
   POST Validation
   */
  // GET - /team/:team_idx/post
  post_retrieve: {
    params: {
      team_idx: Joi.number().required()
    }
  },
  // POST - /team/:team_idx/post
  post_write: {
    body: {
      contents: Joi.string().required()
    },
    params: {
      team_idx: Joi.number().required()
    }
  },
  // PUT - /team/:team_idx/post/:post_id
  post_edit: {
    body: {
      contents: Joi.string().required()
    },
    params: {
      team_idx: Joi.number().required(),
      post_idx: Joi.number().required()
    }
  },


  /*
   TEST Validation
   */
  // POST - /team/:team_idx/test
  test_create: {
    body: {
      title: Joi.string().required(),
      contents: Joi.string().required(),
      date: Joi.string().required(),
      cutline: Joi.string().required(),
      time_limit: Joi.string().required(),
      date_limit: Joi.string().required()
    },
    params: {
      team_idx: Joi.number().required()
    }
  },
};