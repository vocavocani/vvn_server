const log = require('./config/logger');
const errors = require('./errors');

module.exports = (app) => {
  app.use((err, req, res, next) => {
    // 에러 로그
    log.error(`\n\x1b[31m[ERROR Handler] \u001b[0m \n\x1b[34m[Request PATH - ${req.path}] \u001b[0m \n`, err);

    // 내부 에러
    if (isNaN(err)) {
      err = 500;
    }
    // 잘못된 파라미터 확인
    if (err == 9401) {
      log.error(`\n\x1b[36m[Request Params] \u001b[0m \n`, req.body);
    }

    return res.status(errors[err].status).json([
      errors[err]
    ]);
  });
};