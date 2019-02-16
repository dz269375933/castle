const castle = require('./castle');
const michelin = require('./michelin');
var starProperties = [];
var express = require('express');
var app = express();
var weekend = {};
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:63342");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});
app.get('/properties', (request, response) => {
    if (starProperties.length == 0) initStarArray();
    console.log("Send message……");
    var data = {};
    data.properties = starProperties;
    data.startDay = weekend.saturday;
    response.send(JSON.stringify(data));
})
var server = app.listen(9001, function () {
    initStarArray();
    console.log("nodejs listen 9001 …… ");
});

function initStarArray() {
    weekend = castle.getWeekDay();
    michelin.get().then((list) => {
        var map = new Map();
        list.forEach((cow) => {
            map.set(cow.name, cow)
        });
        castle.getProperties().then((properties) => {
            properties.forEach((property) => {
                var michelinObject = map.get(property.name);
                if (michelinObject == undefined | michelinObject == 'undefined') return;
                if (property.price == undefined | property.price == 'undefined') return;
                var temp = property;
                temp.addressLocality = michelinObject.locality;
                temp.rating = michelinObject.rating;
                temp.thoroughfare = michelinObject.thoroughfare;
                temp.postalCode = michelinObject.postalCode;
                starProperties.push(temp);
            });
            //end foreach
            console.log("loading all……");
        })
    });
}