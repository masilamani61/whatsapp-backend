const mongoose=require('mongoose')

const messageschema=new mongoose.Schema({
    author:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user'
    },
    content:{
        type:String,
    },
    date:{
        type:Date,
    }, 
})

const messagemodel=mongoose.model('messages',messageschema)
module.exports =messagemodel