const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema=new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    mobile: {
        type: String,
        required: true,
    },
    products: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "Product",
        },
    ],
})

module.exports=mongoose.model('User',userSchema)