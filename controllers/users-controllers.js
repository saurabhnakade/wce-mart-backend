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
        next(new Error("User Already Present"));
    }

    let hashedPass;
    try {
        hashedPass = await bcrypt.hash(password, 12);
    } catch (err) {
        console.log("not able to hash password");
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
        console.log(err.message + " Hello");
    }

    let token;
    try {
        token = jwt.sign(
            { id: newUser.id, username: newUser.username },
            "my-key"
        );
    } catch (err) {
        console.log(err.message);
    }

    res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        token: token,
    });
};

const login = async (req, res) => {
    const { username, password } = req.body;

    let hasUser;
    try {
        hasUser = await User.findOne({ username: username });
    } catch (err) {
        console.log("mongoose error in findOne");
    }
    if (!hasUser) {
        console.log("User doesnot exist");
        return;
    }

    let isValidPass = false;
    try {
        isValidPass = await bcrypt.compare(password, hasUser.password);
    } catch (err) {
        console.log("bcrypt error");
    }
    if (!isValidPass) console.log("not a valid password");

    let token;
    try {
        token = jwt.sign(
            { id: hasUser.id, username: hasUser.username },
            "my-key"
        );
    } catch (err) {
        console.log(err.message);
    }

    res.status(202).json({
        id: hasUser.id,
        username: hasUser.username,
        name: hasUser.name,
        token: token,
    });
};

const getUser = async (req, res) => {
    const id = req.params.id;

    let hasUser;
    try {
        hasUser = await User.findById(id);
    } catch (err) {
        console.log("mongoose error in findOne");
    }

    if (!hasUser) {
        console.log("User Not Present");
        return;
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
