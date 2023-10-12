const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    email:{type:String,unique:true,require:true},
    username:{type:String},
    password:{type:String},
    friends:[{type:mongoose.SchemaTypes.ObjectId,ref:'user'}]
})
const usermodel=mongoose.model('user',userSchema)
module.exports=usermodel