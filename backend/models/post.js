var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: { type: String, maxLength: 50, required: true },
  text: { type: String, maxLength: 300, required: true },
  createTime: { type: Date },
  editTime: { type: Date, default: 'Jan 1, 1970' }, // value equals this should be considered null
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  published: { type: Boolean, default: true, required: true },
  upvotes: { type: Number, default: 1 },
  downvotes: { type: Number, default: 0 },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
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
