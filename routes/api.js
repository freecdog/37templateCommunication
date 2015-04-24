/**
 * Created by jaric on 24.04.2015.
 */

var express = require('express');
var router = express.Router();

router.get('/double', function(req, res, next) {
    req.app.genericPayload.doubleCounterValue();
    res.redirect('/');
});
router.get('/zero', function(req, res, next) {
    req.app.genericPayload.zeroCounterValue();
    res.redirect('/');
});
router.get('/valuesfrom/:id', function(req, res, next) {
    // check id validness
    var id = parseInt(req.params.id);
    res.send(req.app.genericPayload.getCounterValuesFromIndex(req.params.id));
});
router.get('/db', function(req, res, next) {
    res.send(req.app.genericPayload.getAllCounterValues());
});

module.exports = router;
