const express = require("express")
const Router = express.Router()
const { v4: uuidv4 } = require("uuid")
const multer = require("multer")
const { isAuthenticated } = require('../middlewares/auth.middleware')
const sharp = require('sharp');

const blogController = require('../controller/blog.controller')
const blogcontroller = new blogController();

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'public/images/')
//     },
//     filename: function (req, file, cb) {

//       req.fileName = `${uuidv4()}.jpeg`
//       cb(null, req.fileName)
//     }
//   })
const upload = multer({ dest: './public/images/' })


Router.post("/createBlog", isAuthenticated, upload.single("blogImage"), blogcontroller.createBlog)
Router.put("/likeBlog/:blogId", isAuthenticated, blogcontroller.likeBlog)
Router.put("/unlikeBlog/:blogId", isAuthenticated, blogcontroller.unlikeBlog)
Router.get("/viewBlog/:blogId", isAuthenticated, blogcontroller.viewBlog)
Router.get("/allBLogs", isAuthenticated, blogcontroller.getAllBlogs)
Router.put("/addToFavourite/:blogId", isAuthenticated, blogcontroller.addToFavourite)
Router.put("/remove/favourites/:blogId", isAuthenticated, blogcontroller.removeFromFavourite)

Router.get("/getFavouriteBlogs", isAuthenticated, blogcontroller.getFavouriteBlogs)
Router.get("/myBlogs", isAuthenticated, blogcontroller.myBlogs)
Router.delete("/removeBlog/:blogId", isAuthenticated, blogcontroller.removeBlog)
Router.put("/editBlog/:blogId", isAuthenticated, upload.single("blogImage"), blogcontroller.editBlog)

module.exports = Router