var mongoose = require('mongoose');

var droneControlSchema = new mongoose.Schema({
  name: {
    type: String
  },
  Entry_Date: {
    type: Date,
    default: Date.now
  },
  up: {
    type: Boolean
  },
  right: {
    type: Boolean
  },
  left: {
    type: Boolean
  },
  forward: {
    type: Boolean
  },
  grab: {
    type: Boolean
  }

});

droneControlSchema.index({name: 'text'});

var Drone_Control = mongoose.model('Drone_Control', droneControlSchema);
module.exports = Drone_Control;