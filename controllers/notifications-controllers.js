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

const deleteNotification = async (req, res, next) => {
    const index = req.params.index;
    const { id } = req.body;

    if (id != req.user.id) {
        return next(new Error("You are not allowed to view notifications"));
    }

    console.log(index);

    let user;
    try {
        user = await User.findById(id);
    } catch (err) {
        return next(new Error("Mongoose error not able to find user"));
    }

    if (!user) {
        return next(new Error("Not able to find user with that id"));
    }

    user.notifications.splice(index, 1);
    await user.save();

    res.send({ msg: "Deleted" });
};

const addNotification = async (req, res, next) => {
    const { id, title, price,sellersId } = req.body;

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

    let seller;
    try {
        seller = await User.findById(sellersId);
    } catch (err) {
        return next(new Error("Mongoose error not able to find user"));
    }

    if (!seller) {
        return next(new Error("Not able to find user with that id"));
    }

    const date = new Date();
    let dateIST = new Date(date);
    dateIST.setHours(dateIST.getHours() + 5);
    dateIST.setMinutes(dateIST.getMinutes() + 30);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    let time = dateIST.getHours() + ":" + dateIST.getMinutes();

    const not = `Contacts for product ${title} of price ${price} : ${seller.name} → ${seller.mobile} on ${currentDate} at ${time}`;
    user.notifications.unshift(not);
    await user.save();

    res.status(201).json({ notification: not });
};

exports.addNotification = addNotification;
exports.getNotificationsById = getNotificationsById;
exports.deleteNotification = deleteNotification;
