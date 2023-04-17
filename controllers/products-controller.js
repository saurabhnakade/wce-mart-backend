const { default: mongoose } = require("mongoose");
const Product = require("../models/Product");
const User = require("../models/User");

const getAllProducts = async (req, res, next) => {
    let products;
    try {
        products = await Product.find({});
    } catch (err) {
        next(new Error("Mongoose Error"));
    }

    res.json(products.map((p) => p.toObject({ getters: true })));
};

const getProductById = async (req, res, next) => {
    const id = req.params.id;
    let product;
    try {
        product = await Product.findById(id);
    } catch (err) {
        return next(new Error("Mongoose error not able to find product"));
    }
    if (!product) {
        return next(new Error("Not able to find product with given id"));
    }

    res.json(product);
};

const getMyProducts = async (req, res, next) => {
    const id = req.params.id;

    let user;
    try {
        user = await User.findById(id).populate("products");
    } catch (err) {
        return next(new Error("Not able to find user mongoose error"));
    }
    if (!user) {
        return next(new Error("Not able to find user of that id"));
    }

    if (id != req.user.id) {
        return next(new Error("You are not allowed to view personal products"));
    }

    res.json({
        products: user.products.map((p) => p.toObject({ getters: true })),
    });
};

const createProduct = async (req, res, next) => {
    const { name, description, image, price, status, sellersId } = req.body;

    if (sellersId != req.user.id) {
        return next(new Error("You are not allowed to create a place"));
    }

    const newProduct = new Product({
        name,
        description,
        image,
        price,
        status,
        sellersId,
    });

    let user;
    try {
        user = await User.findById(sellersId);
    } catch (err) {
        return next(new Error("Not able to find user mongoose error"));
    }
    if (!user) {
        return next(new Error("Not able to find user of that id"));
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await newProduct.save({ session: sess });
        user.products.push(newProduct);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        return next(new Error("Not able to create product"));
    }

    res.status(201).json(newProduct);
};

const deleteProduct = async (req, res, next) => {
    const id = req.params.id;

    let product;
    try {
        product = await Product.findById(id).populate("sellersId");
    } catch (err) {
        return next(new Error("Mongoose error not able to find product"));
    }
    if (!product) {
        return next(new Error("Not able to find product with given id"));
    }

    if (product.sellersId.id != req.user.id) {
        return next(new Error("You are not allowed to delete this product"));
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await product.deleteOne({ session: sess });
        product.sellersId.products.pull(product);
        await product.sellersId.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        return next(new Error("Not able to delete product"));
    }

    res.status(200).json({ message: `User Deleted with id ${id}` });
};

exports.getAllProducts = getAllProducts;
exports.getProductById = getProductById;
exports.getMyProducts = getMyProducts;
exports.createProduct = createProduct;
exports.deleteProduct = deleteProduct;
