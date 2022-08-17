var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  text: { type: String, required: true, maxLength: 100 },
  timestamp: { type: Date, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fatherPost: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  upvotes: { type: Number, default: 1 },
  downvotes: { type: Number, default: 0 },
});

//Virtual for comment's karma
CommentSchema.virtual('karma').get(function () {
  return this.upvotes - this.downvotes;
});

//Virtual for comment's URL
CommentSchema.virtual('url').get(function () {
  return '/comment/' + this._id;
});

//Export model
module.exports = mongoose.model('Comment', CommentSchema);
