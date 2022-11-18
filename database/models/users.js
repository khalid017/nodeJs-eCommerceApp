const mongoose = require("mongoose")
// var uniqueValidator = require('mongoose-unique-validator'); // for unique validator

const usersSchema = new mongoose.Schema({
    name:String,
    password:String,
    email: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    admin:Boolean
})
// usersSchema.plugin(uniqueValidator);

const usersModel = mongoose.model("usersModel",usersSchema)

// async function create()
// {
//  admin =  {name:"khalid",password:"123",email:"mohd.khalid@ssipmt.com",isVerified:true,admin:true}

//  await usersModel.create(admin)


// }

module.exports = usersModel 
// create()