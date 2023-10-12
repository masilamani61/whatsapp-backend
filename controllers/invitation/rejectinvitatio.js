const { getonlinereciever } = require("../../handlers/connctsockethandlers")
const friendinvitationmodel = require("../../models/friendinvitationmodel")

const rejectinvitation=async(req,res)=>{
    const {id}=req.body
    try{
        const invitation=await friendinvitationmodel.findByIdAndDelete(id)
        console.log(invitation)
        if (!invitation){
            throw new Error('something went wrong')
        }
        getonlinereciever(invitation.recieverid.toString())
        res.send('rejected')
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
    }
    
}

module.exports=rejectinvitation