const mongoose=require('mongoose')

const invitationschema=new mongoose.Schema({
    senderid:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user'
    },

    recieverid:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user'
    }
})

module.exports=mongoose.model('invitation',invitationschema)