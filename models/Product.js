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
    }
});

module.exports=mongoose.model('Product',productSchema)