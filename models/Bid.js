const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bidSchema=new Schema({
    biddersId:{
        type: mongoose.Types.ObjectId,
        required:true,
        ref:'User'
    },
    amount:{
        type:Number,
        required:true,
    },
});

module.exports=mongoose.model('Bid',bidSchema)