var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Necessary to use virtuals in the frontend.
const opts = { toJSON: { virtuals: true } };

var CommentSchema = new Schema(
  {
    text: { type: String, maxLength: 100, required: true },
    createTime: { type: Date },
    editTime: { type: Date, default: 'Jan 1, 1970' }, // Value equals this should be considered null in the frontend.
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    fatherPost: { type: Schema.Types.ObjectId, ref: 'Post' },
    fatherComment: { type: Schema.Types.ObjectId, ref: 'Comment' },
    upvotes: { type: Number, default: 1 },
    downvotes: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  opts
);

// Virtual for comment's karma.
CommentSchema.virtual('karma').get(function () {
  return this.upvotes - this.downvotes;
});

// Virtual for comment's URL.
CommentSchema.virtual('url').get(function () {
  return '/comment/' + this._id;
});

// Export model.
module.exports = mongoose.model('Comment', CommentSchema);
