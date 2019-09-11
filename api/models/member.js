const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Member = new Schema({
  nickname: {
    type: String
  },
  socketID : {
    type: String
  },

},{
  collection: 'business'
});

module.exports = mongoose.model('Member', Member);
