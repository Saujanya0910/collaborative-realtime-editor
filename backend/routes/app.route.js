
/**
 * Application routes
 * @param {import('express').Application} app 
 */
module.exports = function (app) {
  app.route('/').get((_, res) => res.send('Hello there! 👋'))
}