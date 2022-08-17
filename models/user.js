var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type: String, require: true, maxLength: 40, required: true },
  email: { type: String, require: true, maxLength: 50, required: true },
  password: { type: String, require: true, maxLength: 100, required: true },
  membershipStatus: {
    type: String,
    required: true,
    enum: ['Normal', 'Admin'],
    default: 'Normal',
  },
  karmaComments: { type: Number, default: 0 },
  karmaPosts: { type: Number, default: 0 },
});

//Virtual for user's karma
UserSchema.virtual('karma').get(function () {
  return this.karmaPosts * 10 + this.karmaComments;
});

//Virtual for user's URL
UserSchema.virtual('url').get(function () {
  return '/user/' + this._id;
});

//Export model
module.exports = mongoose.model('User', UserSchema);
