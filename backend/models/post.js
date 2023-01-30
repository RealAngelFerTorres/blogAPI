var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Necessary to use virtuals in the frontend.
const opts = { toJSON: { virtuals: true } };

var PostSchema = new Schema(
  {
    title: { type: String, maxLength: 120, required: true },
    text: { type: String, maxLength: 5000, required: true },
    createTime: { type: Date },
    editTime: { type: Date, default: 'Jan 1, 1970' }, // This date should be considered null.
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    published: { type: Boolean, default: true, required: true },
    upvotes: { type: Number, default: 1 },
    downvotes: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  opts
);

// Virtual for post's karma.
PostSchema.virtual('karma').get(function () {
  return this.upvotes - this.downvotes;
});

// Virtual for post's URL.
PostSchema.virtual('url').get(function () {
  return '/post/' + this._id;
});

// Export model.
module.exports = mongoose.model('Post', PostSchema);
