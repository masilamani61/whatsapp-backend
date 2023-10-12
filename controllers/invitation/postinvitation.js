const { getonlinereciever } = require("../../handlers/connctsockethandlers")
const friendinvitationmodel = require("../../models/friendinvitationmodel")
const usermodel = require("../../models/usermodel")

const postivitation=async(req,res)=>{
    const mail=req.body.mail
    console.log(mail)
    const {email,userid}=req.user
    try{

    if (mail.toLowerCase()==email.toLowerCase()){
        throw new Error('you cannot send to youself')
    }
    const targetuser=await usermodel.findOne({email:mail.toLowerCase()})
    
    if (!targetuser){
        throw new Error('email is not found or not valid email')
    }
    console.log(targetuser.id)
    const alreadyfriend=targetuser.friends.find(f=>f.toString()==userid)
    if (alreadyfriend){
        throw new Error('alerady friend')
    }
    const aleradysent=await friendinvitationmodel.findOne({senderid:userid,recieverid:targetuser._id})
    if (aleradysent){
        throw new Error('inviattion already sent')
    }
    //redy to add into the database
    const newinvitation=await friendinvitationmodel.create({
        senderid:userid,
        recieverid:targetuser._id
    })
    getonlinereciever(targetuser.id)
    
   res.send('invited')
}
   catch(err){
    res.send({err:err.message})
   }
}

module.exports=postivitation