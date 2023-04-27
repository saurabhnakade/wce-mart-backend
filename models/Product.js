const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema=new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    status:{
        type:String,
        required:true
    },
    sellersId:{
        type: mongoose.Types.ObjectId,
        required:true,
        ref:'User'
    },
    yearPurchased:{
        type:Number,
        required:true,
    },
    intermediateUsers:{
        type:Number,
        required:true,
    },
    negotiable:{
        type:Boolean,
        required:true,
    },
    bids:[
        {
            type:mongoose.Types.ObjectId,
            required:true,
            ref:'Bid'
        }
    ]
});

module.exports=mongoose.model('Product',productSchema)