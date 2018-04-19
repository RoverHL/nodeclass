"use strict";
/*
   Author: Miné Spears

   Users Model
 */
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/myapp");
var db = mongoose.connection;

var usersModel = {
    initialize: function() {
      var userSchema = mongoose.Schema({
          username: {type: String, required:true},
          city: {type: String, required:true},
      });
      this.User =  mongoose.model('User', userSchema);
    },

    _saveToMongo: function(userObject) {
      // Creates a new object from the User schema
      var c = new this.User(userObject);
      c.save((err, c)=> {
        if (err) {
          console.log('Error:',err);
          console.log("Error saving user");
        }
        console.log('saved user: ', userObject);
      });
    },

    addUser: function(username, city) {
      // See if we have a user name:
      if (username != "") {
        // Creating it right here
        var userObject = {
          username,
          city
        };
        // Saving to database
        this._saveToMongo(userObject);
      }
    },

    update: function(id, username, city) {
        // first find the user
        // this will return a promise: this.getById(id)
        return this.getById(id).then(function(usr){   // return is returning a promise
            usr.username = username;
            usr.city = city;
            return usr.save();
        });
    },

    _loadFromMongo: function(query) {
      var query = query || {};
      console.log('query is ',query);
      return this.User.find( query );
    },

    doQuery: function(username, city) {
      var query = {};
      if (username != '') query['username'] = username;
      if (city != '') query['city'] = city;
      console.log('doing query ',query);
      return this._loadFromMongo(query);
    },

    // this is like a primary key in sql; unique key for each record
    getById: function(id) {
        return this.User.findOne({"_id":id});
    },

    // By convention the model is singular thus "User"
    getAll: function() {
        // What gets returned is a promise and when the promise resolves
        // it'll execute your "then"
        return this.User.find({});
    },

    deleteById: function(id) {
        return this.User.remove({"_id":id});
    },

    _buildQueryObject: function(username, city) {
      var query = {};
      if (username != '') query['username'] = username;
      if (city != '') query['city'] = city;
      return query;
    },

    delete: function(username, city) {
      var query = this._buildQueryObject(username, city);
      console.log("Doing remove with ",query);
      return this.User.remove(query);
    },

    _deleteFromMongo: function() {
      this.User.remove({}, function(err) {
        if (err) {
          console.log("Delete Failed!",err);
        }
      });
    },

    deleteAll: function() {
      this._deleteFromMongo();
    },


};

db.on('open', function() {
  usersModel.initialize();
});

module.exports = usersModel;
