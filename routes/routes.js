module.exports = function (express, app, fs) {
  var router = express.Router();

  router.get('/', function (req, res, next) {
    res.render('index', {
      helpers: {}
    });
  });
  app.use('/', router);
};
