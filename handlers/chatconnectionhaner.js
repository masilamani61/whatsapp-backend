const conversationmodel = require("../models/participants")
const messagemodel=require('../models/message')
const { chatsendingtoreceriver } = require("./connctsockethandlers")
const chatsetdatbase=async(socket,data)=>{
    const {sendto,content}=data
    const {userid}=socket.user
    try{
    const message=await messagemodel.create({
        content:content,
        date:new Date(),
        author:userid
    })
    const participants=await conversationmodel.findOne({
        participants:{$all: [sendto,userid]}
    })

    if (participants){
        participants.messages.push(message)
        await participants.save()
        chatsendingtoreceriver(participants._id)
    }
    else{
        const newparticipants=await conversationmodel.create({
            participants:[userid,sendto],
            messages:message
        })
    
    chatsendingtoreceriver(newparticipants._id)}
    console.log('saved in database')
    }
    catch(err){
        console.log(err)
    }
}

module.exports=chatsetdatbase