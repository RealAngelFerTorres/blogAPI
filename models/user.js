var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type: String, maxLength: 40, required: true },
  email: { type: String, maxLength: 50, required: true },
  password: { type: String, maxLength: 100, required: true },
  createTime: { type: Date },
  membershipStatus: {
    type: String,
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
