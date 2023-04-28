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

const addNotification = async (req, res, next) => {
    const { id, title, price } = req.body;

    if (id != req.user.id) {
        return next(new Error("You are not allowed to view notifications"));
    }

    console.log("YOOO2");

    let user;
    try {
        user = await User.findById(id);
    } catch (err) {
        return next(new Error("Mongoose error not able to find user"));
    }

    if (!user) {
        return next(new Error("Not able to find user with that id"));
    }

    const not = `Contacts for product ${title} of price ${price} : ${user.name} → ${user.mobile}`;
    user.notifications.unshift(not);
    await user.save();
    
    res.status(201).json({ notification: not });
};

exports.addNotification = addNotification;
exports.getNotificationsById = getNotificationsById;
