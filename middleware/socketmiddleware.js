const jwt=require('jsonwebtoken')

const verifytoken=(socket,next)=>{
    const token=socket.handshake.auth?.token
    try{
        const decoded=jwt.verify(token,process.env.jwtkey)
        
        socket.user=decoded
    }
    catch(err){
        const socketerr=new Error('invalid')
        next(socketerr)   
    }
    next()


}
module.exports={verifytoken}