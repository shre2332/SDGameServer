var mongoose = require('mongoose');

var transformSchema = new mongoose.Schema({
  name: {
    type: String
  },
  Entry_Date: {
    type: Date,
    default: Date.now
  },
  x: {
    type: Number
  },
  y: {
    type: Number
  },
  z: {
    type: Number
  }

});

transformSchema.index({name: 'text'});

var Transform = mongoose.model('Transform', transformSchema);
module.exports = Transform;