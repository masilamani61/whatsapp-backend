const { showfreindlist, getonlinereciever } = require("../../handlers/connctsockethandlers")
const friendinvitationmodel = require("../../models/friendinvitationmodel")
const usermodel = require("../../models/usermodel")

const acceptinvitation=async(req,res)=>{
    const {id}=req.body
    console.log(id)
    try{
    const invitation=await friendinvitationmodel.findById(id)
    console.log(invitation)
    if (!invitation){
        throw new Error('something went wrong')
    }
    const {senderid,recieverid}=invitation
    await friendinvitationmodel.findByIdAndDelete(id)
    const sender=await usermodel.findById(senderid)
    console.log(sender,recieverid)
    sender.friends.push(recieverid)
    const reciever=await usermodel.findById(recieverid)

    reciever.friends.push(senderid)
    await sender.save()
    await reciever.save()
    console.log(senderid,recieverid)
   

    showfreindlist(recieverid.toString())
    
    getonlinereciever(recieverid.toString())
    
    res.send('invitationsuces')
}
    catch(err){
        console.log(err)
        res.send(err)
    }
    
}

module.exports=acceptinvitation
