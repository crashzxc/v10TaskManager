/**
 * Created by TerryTan on 8/3/2017.
 */
var fbFnc = module.exports = {};
var path = require('path');
var credentials = require(path.resolve('./config.js')).credentials;
var firebase = require('firebase');
var hashMap = require('hashmap');

//Initialize the app with a service account, granting admin privileges
console.log(credentials);
firebase.initializeApp(
    credentials
);

//initialize firebase database instance
var db = firebase.database();
//Server logging purpose
var dbAppRef = db.ref('app/');

fbFnc.api = {
    getAllTasks: function (hmap) {
        return new Promise((resolve, reject) => {
            var tasksRef = db.ref('tasks');
            var result = [];
            tasksRef.orderByValue().on('value', function (snapshot) {
                snapshot.forEach(function (data) {
                    var taskName = data.val().taskName;
                    var createdDateTime = data.val().created_date_time;
                    var taskKey = data.key;
                    var priorityName = hmap.get(data.val().priorityId);
                    var TasksData = new tasksData(taskName,taskKey,createdDateTime,priorityName);

                    result.push(TasksData);
                });
            });
            resolve(result);
        });
    },

    addOneTask: function (inTask) {
        return new Promise((resolve,reject)=>{
            var taskRef = db.ref('tasks').push(inTask);
            if(taskRef){
                resolve(taskRef.key);
            }else{
                reject('Unable to save task record');
            }
        });
    },

    addPriority: function (inPriority) {
        return new Promise((resolve, reject)=>{
            var priorityRef = db.ref('priority').push(inPriority);
            if(priorityRef){
                resolve(priorityRef.key);
            }else{
                reject('Unable to save priority record');
            }
        });
    },

    getPriorityForControl: function () {
        return new Promise((resolve, reject) => {
            var prioritiesRef = db.ref('priority');
            var result = [];
            prioritiesRef.orderByValue().on('value', function (snapshot) {
                snapshot.forEach(function (data) {
                    var priorityName = data.val().priorityName;
                    var priorityId = data.key;
                    var PriorityData = new priorityData(priorityName,priorityId);

                    result.push(PriorityData);
                });
            });
            resolve(result);
        });
    },

    getPriority: function () {

        return new Promise((resolve,reject)=>{
            var prioritiesRef = db.ref('priority');
            var hmap = new hashMap();
            prioritiesRef.orderByValue().on('value',function (snapshot) {
                snapshot.forEach(function (data) {
                    hmap.set(data.key,data.val().priorityName);
                });
            });
            resolve(hmap);
        });
    }
}
function priorityData(inPriorityName,inPriorityKey) {
    this.priorityName = inPriorityName;
    this.priorityId = inPriorityKey;
}

function tasksData(inTaskName,inTaskId,inCreateDateTime,inPriorityName) {
    this.taskName = inTaskName;
    this.taskId = inTaskId;
    this.created_date_time = inCreateDateTime;
    this.priorityName = inPriorityName;
}