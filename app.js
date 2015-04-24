var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

var GenericPayload = function(){
    var GenericObj = function(){
        var counter = 0;
        var lastIndex = 0;
        var db = [];
        db[lastIndex] = counter;
        counter++;

        this.getCounter = function(){
            var obj = {
                id: lastIndex,
                value: db[lastIndex]
            };
            return obj;
        };
        this.getCounterFromIndex = function(id){
            var arr = [];
            for (var i = id++; i < lastIndex; i++){
                var obj = {
                    id: i,
                    value: db[i]
                };
                // or should I use "arr[i] =" ?
                arr.push(obj);
            }
            console.log(id, arr);
            return arr;
        };
        this.getDB = function(){
            return db;
        };

        this.incCounter = function(){
            lastIndex++;
            db[lastIndex] = counter;
            counter++;
        };
        this.doubleCounter = function(){
            lastIndex++;
            db[lastIndex] = counter;
            counter *= 2;
        };
        this.zeroCounter = function(){
            lastIndex++;
            db[lastIndex] = counter;
            counter = 0;
        };
    };
    var genericObj = new GenericObj();

    var GenericTickerController = function(active, interval){
        var isActive;
        var tickInterval;

        var init = function(active, interval){
            isActive = active;
            tickInterval = interval;
        };
        init(active, interval);

        this.activate = function(){
            isActive = true;
        };
        this.deactivate = function(){
            isActive = false;
        };
        this.status = function(){
            return isActive;
        };
        this.getTickInterval = function(){
            return tickInterval;
        };
    };
    var genericTickerController = new GenericTickerController(true, 1000);

    var GenericTicker = function(){

        var tickerFunction = function(){
            setTimeout(function(){
                if (genericTickerController.status) {
                    genericObj.incCounter();
                }

                tickerFunction();
            }, genericTickerController.getTickInterval());
        };
        tickerFunction();
    };
    var genericTicker = new GenericTicker();

    this.getCounterValue = function(){
        return genericObj.getCounter();
    };
    this.getCounterValuesFromIndex = function(id){
        return genericObj.getCounterFromIndex(id);
    };
    this.getAllCounterValues = function(){
        return genericObj.getDB();
    };
    this.doubleCounterValue = function(){
        genericObj.doubleCounter();
    };
    this.zeroCounterValue = function(){
        genericObj.zeroCounter();
    };
};
app.genericPayload = new GenericPayload();

app.use('/', routes);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
