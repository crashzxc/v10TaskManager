/**
 * Created by TerryTan on 8/3/2017.
 */
var index = function(app) {
    var express = require('express');
    var router = express.Router();
    /* Variable 'index' is a function that import the Tasks API Controller module
     If there are any other controllers(s) that should be imported, it should
     be placed ***HERE***
     */
    //http://bigspaceship.github.io/blog/2014/05/14/how-to-create-a-rest-api-with-node-dot-js/
    require("../controllers/TasksWebAPIController.js")(app);

    /* GET home page. */
    app.get('/', function(req, res, next) {
        res.render('index', { title: 'Express' });
    });
}
module.exports = index;