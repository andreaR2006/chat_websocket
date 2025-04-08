const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  dateTime: {
    type: Date,
    default: Date.now
  },

});

const Message = mongoose.model('Message', messageSchema);


module.exports = Message;
