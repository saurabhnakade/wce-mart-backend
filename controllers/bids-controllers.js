const { default: mongoose } = require("mongoose");
const Bid = require("../models/Bid");
const Product = require("../models/Product");
const User = require("../models/User");

const addBid = async (req, res, next) => {
    const { productsId, biddersId, amount } = req.body;

    if (biddersId != req.user.id) {
        return next(new Error("You are not allowed to bid"));
    }

    const newBid = new Bid({
        biddersId,
        productsId,
        amount,
    });

    let product;
    try {
        product = await Product.findById(productsId);
    } catch (err) {
        return next(new Error("Not able to find user mongoose error"));
    }
    if (!product) {
        return next(new Error("Not able to find Product"));
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await newBid.save({ session: sess });
        product.bids.push(newBid);
        await product.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        return next(new Error("Not able to bid"));
    }

    res.status(201).json(newBid.toObject({ getters: true }));
};

const deleteBid = async (req, res, next) => {
    const id = req.params.id;

    let bid;
    try {
        bid = await Bid.findById(id).populate("productsId");
    } catch (err) {
        return next(new Error("Mongoose error in deleting bid"));
    }

    if (!bid) {
        return next(new Bid("Not able to delete the bid"));
    }

    if (bid.productsId.sellersId != req.user.id) {
        return next(new Error("You are not allowed to delete this product"));
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await bid.deleteOne({ session: sess });
        bid.productsId.bids.pull(bid);
        await bid.productsId.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        return next(new Error("Not able to delete product"));
    }

    res.status(200).json({ message: `Bid Deleted with id ${id}` });
};

exports.addBid = addBid;
exports.deleteBid = deleteBid;
