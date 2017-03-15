/**
 * Created by TerryTan on 8/3/2017.
 */
var path = require('path');
var tasks = require(path.resolve('./Apis/Tasks.js')).api;
var users = require(path.resolve('./Apis/User.js')).api;
var waterfall =require('async-waterfall');
var moment = require('moment');
var dateFormat = require('dateformat');
/* Variable 'tasksWebAPIController' is a function that is being exported when
 another file is attempting to imported it. Refer to the last line to
 have the evidence that the variable 'projectsWebAPIController' is being exported.
 */

var tasksWebAPIController = function (app) {
    app.get('/api/getTasks',function (req,res) {
        var taskList = [];
        Promise.resolve(tasks.getPriority()).then(function (result) {
            console.log(result);
          Promise.resolve(tasks.getAllTasks(result)).then(function (snapshot) {
              res.json(snapshot);
          });
        });
    });


    app.post('/api/addTask',function (req,res) {
        //Post request
        //...
        try{
            /* Initializing an instance of a task with the respective JSON
             data. Take note of the statement 'req.body', it reads the request
             body to enable extraction of respective data.
             */

            var oneTask = {
                ['taskName']:req.body.taskName,
                ['created_date_time']:dateFormat(new Date(),'dd/mm/yyyy h:MM:ss TT'),
                ['priorityId']:req.body.priorityId,
            }
            /* Performing postTask function from projects API.
             Expect a callback from the function where it returns
             a key from the newly-created project in firebase.
             Concept can be seen from url: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
             */
            console.log(oneTask);
            tasks.addOneTask(oneTask).then(function (key) {
                res.json({ message: 'Task Item data created in Firebase' });
            });

        }catch (err){
            res.send(err.message);
        }
    });

    app.post('/api/addPriority',function (req,res) {
        try{
            /* Initializing an instance of a task with the respective JSON
             data. Take note of the statement 'req.body', it reads the request
             body to enable extraction of respective data.
             */

            var onePriority = {
                ['priorityName']:req.body.priorityName,
            }
            console.log(onePriority);
            tasks.addPriority(onePriority).then(function (key) {
                res.send('Response '+'"'+String(req.protocol+'://'+req.get('host')+req.originalUrl)+'   Project Record Key: '+key);
            });

        }catch (err){
            res.send(err.message);
        }
    });
    
    app.get('/api/getPriority',function (req,res) {
        var priorityList = [];
        Promise.resolve(tasks.getPriorityForControl()).then(function (result) {
            console.log(result);
            return new Promise(function (resolve, reject) {
                resolve(result);
            });
        }).then(function (data) {
            res.json(data);
        });
    });

    app.post('/api/signIn',function (req,res) {
        Promise.resolve(users.signIn(req.body.email,req.body.pass)).then(function (result) {
            res.json(result);
        });
    });

    app.get('/api/signOut',function (req,res) {
        Promise.resolve(users.signOut()).then(function (result) {
            res.json(result);
        });
    });

    app.get('/api/getLoginStatus',function (req,res) {
        Promise.resolve(users.loggedIn()).then(function (result) {
            if(result != ''){
                res.json('logged in');
            }else{
                res.json('not logged in');
            }
        });
    });

    app.get('/api/signOut',function (req,res) {
        Promise.resolve(users.signOut()).then(function (result) {
            res.json(result);
        });
    });

    app.post('/api/updateTask/:id',function (req,res) {

        var oneTask = {
            ['taskName']:req.body.taskName,
            ['created_date_time']:dateFormat(new Date(),'dd/mm/yyyy h:MM:ss TT'),
            ['priorityId']:req.body.priorityId,
        };

        var taskKey = req.params.id;
        tasks.updateOneTask(oneTask,taskKey)
            .then(function (result) {
                res.json({message:'successfully updated '+taskKey+' in firebase'});
            });

    });

    app.delete('/api/deleteTask/:id',function (req,res) {
        var taskKey = req.params.id;
        tasks.deleteOneTask(taskKey)
            .then(function (result) {
                res.json({message:result});
            });
    });
}
// Exporting variable 'taskController' when external file is importing ProjectsWebAPIController.js
module.exports = tasksWebAPIController;