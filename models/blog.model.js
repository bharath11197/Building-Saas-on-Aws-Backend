const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String
    },
    blogDescription: {
      type: String,
      trim: true,
      required: true,
    },
    createdBy: {
      type: 'ObjectId',
      ref: "user",
      autopopulate: true,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: Array,
      uniqueItems: true,
      default: []
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("blog", blogSchema)