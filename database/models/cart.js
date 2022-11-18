const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
    uId:String,
    name:String,
    price: Number,
    image:String,
    description : String
})

const cartModel = mongoose.model("cart",cartSchema )


module.exports = cartModel