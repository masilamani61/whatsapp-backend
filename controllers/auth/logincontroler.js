const usermodel = require("../../models/usermodel")
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const login=async(req,res)=>{
    try{
        const {email,password}=req.body
        const userexist=await usermodel.findOne({email:email.toLowerCase()})
        if (userexist &&( await bcrypt.compare(password,userexist.password))){
            
        const token=jwt.sign({
            userid:userexist._id,
            email
        },process.env.jwtkey,{expiresIn:'5d'})
            return res.send({userdetails:{
                username:userexist.username,
                id:userexist._id,
                token,
                email:userexist.email
            }})

        }
        throw new Error('credentials invalid')
    }
    catch(err){
        return res.send({err:err.message})

    }
}
module.exports=login