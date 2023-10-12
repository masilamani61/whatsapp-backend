const mongoose=require('mongoose')

const conversationschema=new mongoose.Schema({
    participants:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user'

    }],
    messages:[
        {
            type:mongoose.SchemaTypes.ObjectId,
            ref:'messages'
        }
    ]
})
const conversationmodel=mongoose.model('conversation',conversationschema)
module.exports=conversationmodel