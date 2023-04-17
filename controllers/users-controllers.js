const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
            "my-key"
        );
    } catch (err) {
        return next(new Error("Not able to generate token"));
    }

    res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        token: token,
    });
};

const login = async (req, res,next) => {
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

    let token;
    try {
        token = jwt.sign(
            { id: hasUser.id, username: hasUser.username },
            "my-key"
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

const getUser = async (req, res,next) => {
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

exports.register = register;
exports.login = login;
exports.getUser = getUser;
