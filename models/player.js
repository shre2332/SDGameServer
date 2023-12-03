var mongoose = require('mongoose');

var playerSchema = new mongoose.Schema({
  name: {
    type: String
  },
  Entry_Date: {
    type: Date,
    default: Date.now
  },
  id: 
  {
    type: Number
  },
  active: {
    type: Boolean
  },
  last_active: {
    type: Number
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
  message:{
    type: String
  }
});

playerSchema.index({name: 'text'});

var Player = mongoose.model('Player', playerSchema);
module.exports = Player;