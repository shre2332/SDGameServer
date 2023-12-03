var mongoose = require('mongoose');

var transform2Schema = new mongoose.Schema({
  name: {
    type: String
  },
  Entry_Date: {
    type: Date,
    default: Date.now
  },
  position: {
    x: {
      type: Number
    },
    y: {
      type: Number
    },
    z: {
      type: Number
    }
  },
  rotation: {
    x: {
      type: Number
    },
    y: {
      type: Number
    },
    z: {
      type: Number
    }
  },
  scale: {
    x: {
      type: Number
    },
    y: {
      type: Number
    },
    z: {
      type: Number
    }
  }
});

transform2Schema.index({name: 'text'});

var Transform2 = mongoose.model('Transform2', transform2Schema);
module.exports = Transform2;