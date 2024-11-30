const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  _id: {
    type: String, // The session ID (usually a randomly generated string)
    required: true
  },
  session: {
    type: Object, // The session data stored as a serialized object
    required: true
  },
  expires: {
    type: Date, // Expiration date for the session
    required: true
  }
});

// Create a Mongoose model
const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;
