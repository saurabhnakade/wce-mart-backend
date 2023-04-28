const { default: mongoose } = require("mongoose");
const User = require("../models/User");

const getNotificationsById = async (req, res, next) => {
    const id = req.params.id;

    if (id != req.user.id) {
        return next(new Error("You are not allowed to view notifications"));
    }

    let user;
    try {
        user = await User.findById(id);
    } catch (err) {
        return next(new Error("Mongoose error not able to find user"));
    }

    if (!user) {
        return next(new Error("Not able to find user with that id"));
    }

    res.json({ notifications: user.notifications });
};

exports.getNotificationsById = getNotificationsById;
