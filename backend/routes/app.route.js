const { codeSubmissionHandler } = require('../controllers/sourcecodeController');

/**
 * Application routes
 * @param {import('express').Application} app 
 */
module.exports = function (app) {
  app.route('/').get((_, res) => res.send('Hello there! 👋'));
  app.route('/code/submit').post(codeSubmissionHandler);
}