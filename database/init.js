const mongoose = require('mongoose')

module.exports = ()=>{
    mongoose.connect("")
    .then(()=>{
        console.log("connected to db")
    })
    .catch(()=>{
        console.log("error")
    })
}
