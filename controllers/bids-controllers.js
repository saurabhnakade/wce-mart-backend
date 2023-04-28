const { default: mongoose } = require("mongoose");
const Bid = require("../models/Bid");
const Product = require("../models/Product");
const User = require("../models/User");

const addBid = async (req, res, next) => {
    const { productsId, biddersId, amount, name } = req.body;

    if (biddersId != req.user.id) {
        return next(new Error("You are not allowed to bid"));
    }

    const newBid = new Bid({
        biddersId,
        productsId,
        amount,
        name,
    });

    let product;
    try {
        product = await Product.findById(productsId).populate("sellersId");
    } catch (err) {
        return next(new Error("Not able to find user mongoose error"));
    }
    if (!product) {
        return next(new Error("Not able to find Product"));
    }

    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    let time = date.getHours() + ":" + date.getMinutes();

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await newBid.save({ session: sess });
        product.bids.push(newBid);
        product.sellersId.notifications.unshift(
            `You have received new bid for ${product.name} on ${currentDate} at ${time}`
        );
        await product.sellersId.save({ session: sess });
        await product.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        return next(new Error("Not able to bid"));
    }

    res.status(201).json(newBid.toObject({ getters: true }));
};

const deleteBid = async (req, res, next) => {
    const id = req.params.id;
    const accept = req.query.accept;

    let bid;
    let productOwner;
    try {
        bid = await Bid.findById(id).populate("productsId");
        bidOwner = await User.findById(bid.biddersId);
        productOwner = await User.findById(bid.productsId.sellersId);
    } catch (err) {
        return next(new Error("Mongoose error in deleting bid"));
    }

    if (!bid) {
        return next(new Bid("Not able to delete the bid"));
    }

    if (bid.productsId.sellersId != req.user.id) {
        return next(new Error("You are not allowed to delete this product"));
    }

    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    let time = date.getHours() + ":" + date.getMinutes();

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await bid.deleteOne({ session: sess });
        if (accept === "true") {
            bidOwner.notifications.unshift(
                `Your Bid of ₹${bid.amount} for product ${bid.productsId.name} is accepted by ${productOwner.name} → ${productOwner.mobile}  on ${currentDate} at ${time}`
            );
        } else {
            bidOwner.notifications.unshift(
                `Your Bid of ₹${bid.amount} for product ${bid.productsId.name} is rejected  on ${currentDate}`
            );
        }
        bid.productsId.bids.pull(bid);
        await bidOwner.save({ session: sess });
        await bid.productsId.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        return next(new Error("Not able to delete bid"));
    }

    res.status(200).json({ message: `Bid Deleted with id ${id}` });
};

const getMyBids = async (req, res, next) => {
    const id = req.params.id;

    let product;
    try {
        product = await Product.findById(id).populate("bids");
    } catch (err) {
        return next(new Error("Not able to find user mongoose error"));
    }
    if (!product) {
        return next(new Error("Not able to find product of that id"));
    }

    if (product.sellersId != req.user.id) {
        return next(new Error("You are not allowed to view bids"));
    }

    res.json({
        bids: product.bids.map((p) => p.toObject({ getters: true })),
    });
};

exports.addBid = addBid;
exports.deleteBid = deleteBid;
exports.getMyBids = getMyBids;
