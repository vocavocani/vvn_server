module.exports = {
  /**
   * 4XX ERROR
   */
  400: {
    "status": 400,
    "code": 0,
    "message": "잘못된 요청입니다.",
    "description": "Bad Request"
  },
  401: {
    "status": 401,
    "code": 0,
    "message": "로그인에 실패하였습니다.",
    "description": "Login Fail"
  },
  // Team 4XX Error Code
  1401: {
    "status": 400,
    "code": 0,
    "message": "이미 승인 절차가 진행된 유저입니다.",
    "description": "Already confirm user"
  },
  // Public 4XX Error Code
  9401: {
    "status": 400,
    "code": 0,
    "message": "파라미터가 잘못되었습니다.",
    "description": "invalid parameter"
  },
  9402: {
    "status": 403,
    "code": 0,
    "message": "권한이 없습니다.",
    "description": "Do not have permission"
  },
  10401: {
    "status": 401,
    "code": 0,
    "message": "만료된 인증 토큰 입니다.",
    "description": "expired token"
  },
  10403: {
    "status": 403,
    "code": 0,
    "message": "잘못된 인증 방식입니다.",
    "description": "invalid authentication"
  },

  /**
   * 5XX ERROR
   */
  500: {
    "status": 500,
    "code": 0,
    "message": "서버 오류",
    "description": "Internal Server Error"
  },

  /**
   * 2XX Exception
   */
  // User Error Code
  1201: {
    "status": 200,  // Exception
    "code": 0,
    "message": "아이디가 중복됩니다.",
    "description": "Exist Email"
  },
  1202: {
    "status": 200,  // Exception
    "code": 0,
    "message": "아이디가 존재하지 않습니다.",
    "description": "Not SignIn VocaVocaNi"
  },
  1203: {
    "status": 200,  // Exception
    "code": 0,
    "message": "비밀번호가 틀렸습니다.",
    "description": "Passwords no not match"
  }
};