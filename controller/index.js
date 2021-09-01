var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.status(200).json({ 'status': 'ok' });
});

module.exports = router;

//gmt@mentonit.net
// gmt123
// Gmt@123
// sequelize-auto -o "/models" -d gmt -h localhost -u root