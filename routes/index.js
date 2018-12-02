var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Agile Shope Customized Agile Cards,  Books & Posters'});
});

router.get('/checkout', function (req, res, next) {
    res.render('checkout', {title: 'Checkout'});
});

module.exports = router;
