const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bidSchema=new Schema({
    biddersId:{
        type: mongoose.Types.ObjectId,
        required:true,
        ref:'User'
    },
    productsId:{
        type: mongoose.Types.ObjectId,
        required:true,
        ref:'Product'
    },
    amount:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
});

module.exports=mongoose.model('Bid',bidSchema)