var mongoose = require('mongoose');

var transformSchema = new mongoose.Schema({
  name: {
    type: String
  },
  Entry_Date: {
    type: Date,
    default: Date.now
  },
  players: [{
  	id: 
  	{
  		type: Number
  	}
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
    }
  }]
});

transformSchema.index({name: 'text'});

var Transform = mongoose.model('Transform', transformSchema);
module.exports = Transform;