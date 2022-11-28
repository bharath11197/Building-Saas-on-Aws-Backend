const User = require('../models/user.model')

class userService {
    create(userinfo){
        const user = new User(userinfo);
        return user.save();
    }
    getByEmail(email){
        return User.findOne({"email": email})
    }
    getById(id){
        return User.findOne({"_id":id})
    }
    updatePassword(data){
        return User.findByIdAndUpdate(data._id, { $set: { password: data.password } }, { new: true, useFindAndModify:false})
    }
    updateUserToken(data){
        return User.findByIdAndUpdate(data._id, { $set: { token: data.token } }, { new: true, useFindAndModify:false})
    }
    logout(id){
        return User.findByIdAndUpdate(id, { $set: { token: "" } }, { new: true, useFindAndModify:false})
    }
}

module.exports = userService