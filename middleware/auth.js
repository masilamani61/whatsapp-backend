const jwt=require('jsonwebtoken')

const auth=(req,res,next)=>{
    console.log(req.body)
    const token=req.body.token || req.headers['authorization']
    console.log(token)
    if (!token){
        return res.send('token need to be pass')
    }
    try{
    console.log(token)
    const decode=jwt.verify(token,process.env.jwtkey)
   
    req.user=decode
    }
    catch(err){
        return res.send('invalid token')
    }
    return next()
}
module.exports=auth
