const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const Token = require("../models/Token");
const sendEmail = require("../middleware/send-email");

const register = async (req, res, next) => {
    const { username, name, mobile, password } = req.body;

    let hasUser;
    try {
        hasUser = await User.findOne({ username: username });
    } catch (err) {
        return next(err);
    }
    if (hasUser) {
        return next(new Error("User Already Exists"));
    }

    let hashedPass;
    try {
        hashedPass = await bcrypt.hash(password, 12);
    } catch (err) {
        return next(new Error("Not able to hash password"));
    }

    const newUser = new User({
        username,
        name,
        password: hashedPass,
        mobile,
        products: [],
        notifications: [],
    });

    try {
        await newUser.save();
    } catch (err) {
        return next(new Error("Not able to save user"));
    }

    let token;
    try {
        token = jwt.sign(
            { id: newUser.id, username: newUser.username },
            process.env.JWT_KEY
        );
    } catch (err) {
        return next(new Error("Not able to generate token"));
    }

    const newToken = new Token({
        userId: newUser._id,
        token: token,
    });
    await newToken.save();

    const url = `${process.env.BASE_URL}/api/user/verify/${newUser._id}/${token}`;
    await sendEmail(newUser.username, "Verify Email", url);

    res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        token: token,
    });
};

const login = async (req, res, next) => {
    const { username, password } = req.body;

    let hasUser;
    try {
        hasUser = await User.findOne({ username: username });
    } catch (err) {
        return next(new Error("Not able to search database"));
    }
    if (!hasUser) {
        return next(new Error("User Doesnot exist"));
    }

    let isValidPass = false;
    try {
        isValidPass = await bcrypt.compare(password, hasUser.password);
    } catch (err) {
        return next(new Error("Not able to comapre with hash"));
    }
    if (!isValidPass) {
        return next(new Error("Invalid Password"));
    }
    if(hasUser.verified===false){
        const emailToken=await Token.findOne({userId:hasUser._id})
        const url = `${process.env.BASE_URL}/api/user/verify/${hasUser._id}/${emailToken.token}`;
        await sendEmail(hasUser.username, "Verify Email", url);

        return next(new Error("Not Verified Email"));
    }

    let token;
    try {
        token = jwt.sign(
            { id: hasUser.id, username: hasUser.username },
            process.env.JWT_KEY
        );
    } catch (err) {
        return next(new Error("Not able to generate token"));
    }

    res.status(202).json({
        id: hasUser.id,
        username: hasUser.username,
        name: hasUser.name,
        token: token,
    });
};

const getUser = async (req, res, next) => {
    const id = req.params.id;

    let hasUser;
    try {
        hasUser = await User.findById(id);
    } catch (err) {
        return next(new Error("Not able to find user"));
    }

    if (!hasUser) {
        return next(new Error("User doesnot exist"));
    }

    res.status(200).json({
        username: hasUser.username,
        name: hasUser.name,
        mobile: hasUser.mobile,
    });
};

const verifyEmail = async (req, res, next) => {
    const { id, token } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(400).send({ message: "Invalid link" });

        const foundToken = await Token.findOne({
            userId: user._id,
            token: token,
        });
        if (!foundToken)
            return res.status(400).send({ message: "Invalid link" });

        user.verified = true;
        await user.save();

        await foundToken.deleteOne();

        res.status(200).send({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
};

exports.verifyEmail = verifyEmail;
exports.register = register;
exports.login = login;
exports.getUser = getUser;
