const Blog = require("../models/blog.model")
const User = require("../models/user.model")

class blogService {
    createBlog(bloginfo) {
        const blog = new Blog(bloginfo);
        return blog.save();
    }
    likeBlog(data) {
        return Blog.findByIdAndUpdate(data.blogId, { $push: { likedBy: data.userId }, $inc: { likes: 1 } }, { new: true, useFindAndModify: false }).exec()
    }
    unlikeBlog(data) {
        return Blog.findByIdAndUpdate(data.blogId, { $pull: { likedBy: { $in: [data.userId] } }, $inc: { likes: -1 } }, { new: true, useFindAndModify: false }).exec()
    }
    viewBlog(blogId) {
        return Blog.findOne({ "_id": blogId }).populate({ path: 'createdBy', select: ['email', 'userName'] }).exec()
    }
    getAllBlogs() {
        return Blog.find().populate({ path: 'createdBy', select: ['email', 'userName'] }).exec()
    }
    addToFavourite(data) {
        return User.findByIdAndUpdate(data.userId, { $push: { myFavourites: data.blogId } }, { new: true, useFindAndModify: false }).exec()
    }
    removeFromFavourites(data) {
        return User.findByIdAndUpdate(data.userId, { $pull: { myFavourites: { $in: [data.blogId] } } }).exec()
    }
    getFavouriteBlogs(userId) {
        return User.findOne({ "_id": userId }).populate('myFavourites').exec()
    }
    myBlogs(userId) {
        return Blog.find({ "createdBy": userId }).populate({ path: 'createdBy', select: ['email', 'userName'] }).exec()
    }
    removeBlog(blogId) {
        return Blog.deleteOne({ "_id": blogId }).exec()
    }
    editBlog(blogId, data) {
        return Blog.findByIdAndUpdate(blogId, { $set: data }, { new: true, useFindAndModify: false })
    }
}

module.exports = blogService;