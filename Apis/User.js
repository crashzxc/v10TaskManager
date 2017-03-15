/**
 * Created by TerryTan on 14/3/2017.
 */
var fbFnc = module.exports = {};
var path = require('path');
var credentials = require(path.resolve('./config.js')).credentials;
var firebase = require('firebase');


//initialize firebase database instance
var db = firebase.database();
//Server logging purpose
var dbAppRef = db.ref('app/');

fbFnc.api = {

    signIn:function (email,pass) {
        const auth = firebase.auth();
        return new Promise((resolve,reject)=>{
            auth.signInWithEmailAndPassword(email,pass)
                .then(function (user) {
                    resolve(user.uid);
                })
                .catch(function (err) {
                    resolve('');
                });
        });
    },

    signUp: function (email,pass) {
        firebase.auth().createUserWithEmailAndPassword(email,pass);
    },

    signOut: function () {
        return new Promise((resolve, reject)=>{
            firebase.auth().signOut();
            resolve('signed out');
        });
    },

    loggedIn: function () {
        return new Promise((resolve,reject)=>{
            firebase.auth().onAuthStateChanged(firebaseUser => {
                if(firebaseUser){
                    resolve(firebaseUser);
                    console.log('logged in');
                }else{
                    resolve('');
                    console.log('not logged in');
                }
            });
        });
    }

}
