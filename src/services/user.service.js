const User = require("../models/user.model")
const { ResponseCode } = require("../utils/constant")
const bcrypt = require("bcryptjs");
const login = async (data) => {
    const { email, password } = data;
    if (!email || !password) throw { code: ResponseCode.BAD_REQUEST, message: "Missing parameters" };
    const isPresent = await User.findOne({ email: email }).select("+password");
    if (!isPresent) throw { code: ResponseCode.UNAUTHORIZED, message: "Invailid Credintial" };
    const isCorrectPassword = await bcrypt.compare(password, isPresent.password);
    if (!isCorrectPassword) throw { code: ResponseCode.UNAUTHORIZED, message: "Invalid Credentials" };
    
    return {code:ResponseCode.OK,data:isPresent,message:"Login Successful"}

}

const signup = async (data) => {
    const { name, email, password } = data;
    const isPresent = await User.findOne({
        $or: [
            { email: email }
        ]
    });
    if (isPresent) throw {code:ResponseCode.ALREADY_EXIST,message:"user Already exist"}
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
        name: name,
        email: email,
        password: hashPassword
    });
      await newUser.save();
    if (newUser) {
        return {code:ResponseCode.CREATED,data:newUser,message:"user Created Successfully"}
    }

}

module.exports = { login, signup };