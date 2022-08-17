var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  title: { type: String, require: false, maxLength: 15 },
  timestamp: { type: String, require: true },
  text: { type: String, require: true, maxLength: 140 },
  made_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

//Export model
module.exports = mongoose.model('Message', MessageSchema);
