var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: { type: String, maxLength: 50, required: true },
  text: { type: String, maxLength: 300, required: true },
  timestamp: { type: Date, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  published: { type: Boolean, required: true },
  upvotes: { type: Number, default: 1 },
  downvotes: { type: Number, default: 0 },
});

//Virtual for post's karma
PostSchema.virtual('karma').get(function () {
  return this.upvotes - this.downvotes;
});

//Virtual for post's URL
PostSchema.virtual('url').get(function () {
  return '/post/' + this._id;
});

//Export model
module.exports = mongoose.model('Post', PostSchema);
