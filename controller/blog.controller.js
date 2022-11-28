const blogService = require("../services/blog.service");
const blogservice = new blogService();
const { v4: uuidv4 } = require("uuid")
const Blog = require("../models/blog.model")
const User = require("../models/user.model")
const userService = require('../services/user.service')
const userservice = new userService();
const sharp = require('sharp');
var cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const fs = require("fs");
const { db } = require("../models/user.model");

class blogController {
    async createBlog(req, res) {
        console.log("aa", req.file)
        req.body.createdBy = req.auth._id;

        if (req.file) {
            // console.log("req",req.fileName)
            // if(req.fileName){
            //     req.body.imageUrl = `${process.env.HOST}:${process.env.PORT}/images/${req.originalname}`;
            // }
            // let uuid = uuidv4()
            // req.body.imageUrl = `${process.env.HOST}:${process.env.PORT}/images/${uuid}-${req.file.originalname}`
            // let filenamee = `${uuid}-${req.file.originalname}`
            // await sharp(req.file.path)
            //     .toFormat('png')
            //     .jpeg({ quality: 40 })
            //     .toFile(`public/images/${filenamee}`)
            let result = await cloudinary.uploader.upload(req.file.path)
            console.log(result)
            req.body.imageUrl = result.secure_url
        }
        try {
            console.log('rr', req.body)
            const createdBlog = await blogservice.createBlog(req.body)
            if (!createdBlog) {
                return res.status(400).json({
                    message: "unable to save the blog"
                })
            }
            if (req.file) {
                fs.unlinkSync(`public/images/${req.file.filename}`);
            }
            res.status(200).json({
                message: "Blog created successfully",
                createdBlog
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                error: "Server error"
            })
        }
    }

    async likeBlog(req, res) {
        try {
            const blog = await blogservice.viewBlog(req.params.blogId)

            if (blog.likedBy.includes(req.auth._id)) {
                return res.status(400).json({
                    message: "You have already liked this blog"
                })
            }

            const liked = await blogservice.likeBlog({ blogId: req.params.blogId, userId: req.auth._id })
            if (!liked) {
                return res.status(400).json({
                    message: "Unable to like the blog"
                })
            }

            res.status(200).json({
                message: "Liked successfully",
                likesCount: liked.likes
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                error: "Server error"
            })
        }
    }

    async unlikeBlog(req, res) {
        try {
            const blog = await blogservice.viewBlog(req.params.blogId)
            console.log(blog.likedBy)
            if (blog.likedBy.includes(req.auth._id)) {
                const liked = await blogservice.unlikeBlog({ blogId: req.params.blogId, userId: req.auth._id })
                res.status(200).json({
                    message: "unLiked successfully",
                    likesCount: liked.likes
                })
            } else {
                return res.status(400).json({
                    message: "You have already unliked this blog"
                })
            }


        } catch (err) {
            console.log(err)
            res.status(500).json({
                error: "Server error"
            })
        }
    }
    async viewBlog(req, res) {
        try {
            const blog = await blogservice.viewBlog(req.params.blogId)

            if (!blog) {
                return res.status(400).json({
                    message: "blog doesn't exist"
                })
            }

            res.status(200).json(blog)
        } catch (err) {
            console.log(err)
            res.status(500).json({
                error: "Server error"
            })
        }
    }

    async getAllBlogs(req, res) {
        try {
            const allBlogs = await blogservice.getAllBlogs()

            if (!allBlogs) {
                return res.status(400).json({
                    message: "Error fetching blogs"
                })
            }

            res.status(200).json(allBlogs)
        } catch (err) {
            console.log(err)
            res.status(500).json({
                error: "Server error"
            })
        }
    }

    async addToFavourite(req, res) {
        try {
            const user = await userservice.getById(req.auth._id)
            console.log("user", user)
            if (user.myFavourites.includes(req.params.blogId)) {
                return res.status(400).json({
                    message: "You have already add this blog to favourites"
                })
            }

            const favouriteBlog = await blogservice.addToFavourite({ blogId: req.params.blogId, userId: req.auth._id })

            if (!favouriteBlog) {
                return res.status(400).json({
                    message: "Unable to add favourite blog"
                })
            }

            res.status(200).json(favouriteBlog)
        } catch (err) {
            console.log(err)
            res.status(500).json({
                error: "Server error"
            })
        }
    }
    async removeFromFavourite(req, res) {
        try {
            const user = await userservice.getById(req.auth._id)
            console.log("user", user)
            if (user.myFavourites.includes(req.params.blogId)) {
                const favouriteBlog = await blogservice.removeFromFavourites({ blogId: req.params.blogId, userId: req.auth._id })
                res.status(200).json({
                    message: "Blog Removed from favourites"
                })

            } else {
                return res.status(400).json({
                    message: "Blog not found in user favourites"
                })
            }


            // if (!favouriteBlog) {
            //     return res.status(400).json({
            //         message: "Unable to add favourite blog"
            //     })
            // }

        } catch (err) {
            console.log(err)
            res.status(500).json({
                error: "Server error"
            })
        }
    }
    async getFavouriteBlogs(req, res) {
        try {
            const user = await blogservice.getFavouriteBlogs(req.auth._id)


            if (!user || user.myFavourites.length === 0) {
                return res.status(200).json([])
            }

            res.status(200).json(user.myFavourites)
        } catch (err) {
            console.log(err)
            res.status(500).json({
                error: "Server error"
            })
        }
    }

    async myBlogs(req, res) {
        try {
            const userBlogs = await blogservice.myBlogs(req.auth._id)

            if (!userBlogs) {
                return res.status(400).json({
                    message: "You don't have any blogs"
                })
            }

            res.status(200).json(userBlogs)
        } catch (err) {
            console.log(err)
            res.status(500).json({
                error: "Server error"
            })
        }
    }

    async removeBlog(req, res) {
        try {
            const blog = await blogservice.viewBlog(req.params.blogId)

            if (req.auth.loginType == 'admin' || req.auth._id == blog.createdBy._id) {

                const removedBlog = await blogservice.removeBlog(req.params.blogId)

                if (!removedBlog) {
                    return res.status(400).json({
                        message: "Error removing the blog"
                    })
                }

                res.status(200).json({
                    message: removedBlog.deletedCount > 0 ? "Blog removed successfully" : "Blog doesn't exists"
                })
            } else {
                return res.status(400).json({
                    message: "Unauthorized access"
                })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({
                error: "Server error"
            })
        }
    }

    async editBlog(req, res) {
        try {
            const blog = await blogservice.viewBlog(req.params.blogId)
            // console.log(req)
            if (req.auth._id != blog.createdBy._id) {
                return res.status(400).json({
                    message: "Unauthorized access"
                })
            }

            if (req.fileName) {
                req.body.imageUrl = `images/${req.fileName}`;
                fs.unlink(blog.imageUrl, function (err) {
                    if (err) console.log("file not removed")
                });
            }
            if (req.file) {

                let uuid = uuidv4()
                req.body.imageUrl = `${process.env.HOST}:${process.env.PORT}/images/${uuid}-${req.file.originalname}`
                let filenamee = `${uuid}-${req.file.originalname}`
                await sharp(req.file.path)
                    .toFormat('png')
                    .jpeg({ quality: 40 })
                    .toFile(`public/images/${filenamee}`)
                fs.unlinkSync(`public/images/${req.file.filename}`);

            }
            const updatedBlog = await blogservice.editBlog(req.params.blogId, {
                title: req.body.title,
                blogDescription: req.body.blogDescription,
                imageUrl: req.body.imageUrl
            });

            if (!updatedBlog) {
                return res.status(400).json({
                    message: "Error! Unable to edit the blog"
                })
            }

            res.status(200).json(updatedBlog)

        } catch (err) {
            console.log(err)
            res.status(500).json({
                error: "Server error"
            })
        }
    }

}

module.exports = blogController