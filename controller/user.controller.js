const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const userService = require('../services/user.service')
const userservice = new userService();

class userController {
    async signup(req, res) {
        try {
            const user = await userservice.getByEmail(req.body.email)
            if (user) {
                return res.status(409).json({
                    error: "Email already exists"
                })
            } else {
                req.body.password = await bcrypt.hashSync(req.body.password, 10)
                const user = await userservice.create(req.body)
                res.json({ message: "user created successfully", userId: user._id, Email: user.email })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({
                error: "Server error"
            })
        }
    }
    async signin(req, res) {
        try {
            const user = await userservice.getByEmail(req.body.email)
            if (!user) {
                return res.status(400).json({
                    error: "Incorrect mail"
                })
            }

            const passwordValidation = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordValidation) {
                return res.status(400).json({
                    error: "Incorrect password"
                })
            }

            const token = await jwt.sign({ _id: user._id, email: user.email, loginType: user.loginType }, process.env.SECRET, { /*expiresIn: '1h' */ })
            const updateToken = await userservice.updateUserToken({ _id: user._id, token: token })
            res.json({ token, userId: user._id, email: user.email, loginType: user.loginType })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                error: "Server error"
            })
        }
    }
    async changepassword(req, res) {
        req.body._id = req.auth._id;
        try {
            if (req.body.password != req.body.confirmPassword) {
                return res.status(400).json({
                    error: "Password not matched"
                })
            } else {
                req.body.password = await bcrypt.hashSync(req.body.password, 10)
            }

            const newpassword = await userservice.updatePassword(req.body)
            if (!newpassword) {
                return res.status(400).json({
                    error: "User doesn't exist"
                })
            }
            res.json({
                message: "Password updated successfully"
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                error: "Server error"
            })
        }
    }
    async logout(req, res) {
        try {
            const userLogout = await userservice.logout(req.auth._id)
            if (!userLogout) {
                return res.status(400).json({
                    error: "User doesn't exist"
                })
            }
            res.json({
                message: "Logout successfully"
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                error: "Server error"
            })
        }
    }
}

module.exports = userController;