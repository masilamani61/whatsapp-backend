
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const user=require('../../models/usermodel')
const register=async(req,res)=>{
    console.log('comed')
    try{
    const {username,email,password}=req.body
    console.log(username,email)
    const userexist=await user.exists({email:email})
    console.log(userexist)

    if (userexist){
        throw new Error('email already present')
    }

    const encryptpass=await bcrypt.hash(password,10)
    const newuser=await user.create(
        {
        username,
        email:email.toLowerCase(),
        password:encryptpass

    })
    
    const token=jwt.sign({
        userid:newuser._id,
        email
    },process.env.jwtkey,{expiresIn:'5d'})
    res.send({username,email,token,id:newuser._id})
    

}
catch(err){
    res.send({err:err.message})
}
}
module.exports=register
