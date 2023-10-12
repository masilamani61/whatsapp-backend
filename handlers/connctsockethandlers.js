const friendinvitationmodel = require("../models/friendinvitationmodel")
const conversationmodel = require("../models/participants")
const usermodel = require("../models/usermodel")
const {v4:uuidv4}=require('uuid')
let io
const usersconncted=new Map()

const setsocketserverinstance=(instance)=>{
    io=instance

}
const getsocketio=(a)=>{
    console.log(io)
    return io
}



const handlerconnection=(socket)=>{
    const userid=socket.user?.userid
   usersconncted.set(socket.id,{userid})
   getonlinereciever(userid)
   showfreindlist(userid)
   updateroom(socket.id)
}
const getonlineusers=()=>{
    const list=[]
    usersconncted.forEach((value,key)=>{
        list.push(value.userid)
    })
    return list
}

const activeconnection=(receiverid)=>{
    const onlinesocket=[]
    usersconncted.forEach((value,key)=>{
        console.log(value.userid,receiverid)
        if (value.userid==receiverid){
            onlinesocket.push(key)
        }

    })

    return onlinesocket
}
const removeconnection=(socket)=>{
    usersconncted.delete(socket.id)
    const rooms=getactiverooms()
    rooms.forEach(room=>{
        let p1=room.participants.find(p=>p?.socketid==socket?.id)
        if (p1){
            leaveroom(socket,room?.roomid)
        }
    })
    console.log('disconnected succesfully')
 
}
const showfreindlist=async(userid)=>{
    onlinesocketid=[]
    usersconncted.forEach((value,key)=>{
      if (value.userid==userid){
        onlinesocketid.push(key)
      }
    })  
    try{
    const user=await usermodel.findById(userid,{_id:1,friends:1}).populate('friends','_id username email')
    if (user){
        const friends=user.friends.map(f=>{
            return {
            email:f.email,username:f.username,id:f._id,online:false
        }
        })
   
    onlinesocketid.forEach(socketid=>io.to(socketid).emit('friends-list',{friends}))
    console.log(onlinesocketid,friends)}
    }
    catch(err){
        console.log(err)
    }
}
const getonlinereciever=async(userid)=>{
    onlinesocketid=[]
    usersconncted.forEach((value,key)=>{
        if (value.userid===userid){
            onlinesocketid.push(key)
        } 
    })
    try{
    const pendinginvitations=await friendinvitationmodel.find({recieverid:userid}).populate('senderid','_id username email')
    
    onlinesocketid.forEach(socketid=>io.to(socketid).emit('friend-invitations',{pendinginvitations}))
    console.log(onlinesocketid,'from pending')
}
    catch(err){

    }
}


///chat only

const chatsendingtoreceriver=async(id,socketid=null)=>{
 
    
    try{
    const participants=await conversationmodel.findById(id).populate({
        path:'messages',
        model:'messages',
        populate:{
            path:'author',
            model:'user',
            select:'username _id'
        }
        
    })
    if (participants){
        if (socketid){
            io.to(socketid).emit('chat-history',{
                messages:participants.messages,
                participants:participants.participants
            })
        }
        participants.participants.forEach(userid=>{
            const sockets=activeconnection(userid.toString())
            console.log(sockets)
            sockets.forEach(socket=>{
                io.to(socket).emit('chat-history',{
                    messages:participants.messages,
                    participants:participants.participants
                })
            })
        })
    }
    console.log('emitted')
    }
    catch(err){
        console.log(err)
}    
}

const initialchathistory=async(socket,data)=>{
    const {recieverid}=data
    
    const {userid}=socket.user
    try{
        const conversation=await conversationmodel.findOne({
            participants:{$all:[userid,recieverid]}

        })
        if (conversation){
            chatsendingtoreceriver(conversation._id,socket.id)
        }
        else{
            if (socket.id){
                io.to(socket.id).emit('chat-history',{
                    messages:null,
                    participants:[],
                })
            }
        }
    }
    catch(err){

    }
 

}

//room creations
let activerooms=[]
const romcreatordetails=(socketid,userid)=>{
    const newroom={
        roomcreator:{
            userid,
            socketid
        },
        participants:[
            {userid,socketid}
        ],
        roomid:uuidv4()

    }
    activerooms.push(newroom)
    return newroom



}
const roomcreate=(socket)=>{
    const userid=socket.user.userid
    const socketid=socket.id

    const roomdetails=romcreatordetails(socketid,userid)

    socket.emit('room-create',{roomdetails})
    updateroom()
}

const getactiverooms=(id=null)=>{
    if (id){
        console.log(activerooms,id)
        const room=activerooms.find(r=>r.roomid==id)
        
        return room
    }
    return activerooms
}

const updateroom=(socketid=null)=>{
    
    const activerooms=getactiverooms()
    if (socketid){
        io.to(socketid).emit('active-room',activerooms)
    }
    else{
        io.emit('active-room',activerooms)
    }

}
const joinroom=(socket,roomid)=>{
    let room=getactiverooms(roomid)
    if (room){
        activerooms=activerooms.filter(r=>r.roomid!==roomid)
        const newobj={
            userid:socket?.user?.userid,
            socketid:socket.id 
        }
        room.participants.push(newobj)
        activerooms.push(room)
        console.log('joined succesfully',room)
        //send informatinon to the users are connected
        room.participants.forEach(p=>{
            if (p.socketid!=newobj.socketid){
                socket.to(p.socketid).emit('conn-join',{
                    connecteduserSocketid:newobj.socketid
                })
            }
        })
        updateroom()
    }
}

const leaveroom=(socket,id)=>{
    let room=getactiverooms(id)
    if (room){
        
        activerooms=activerooms.filter(room=>{
            if (room.roomid==id){
                console.log(room)
                return room
            }
        })
        
        console.log(activerooms.length)
        
        let partici=room?.participants?.filter(r=>r.userid!=socket?.user?.userid) || room[0]?.participants?.filter(r=>r.userid!=socket?.user?.userid)
        if (partici?.length>0){
            room.participants=partici
            activerooms.push(room)
        }
        console.log(partici,'partcipants')
        partici.forEach(p=>{
            console.log(p.socketid,socket.id)
            socket.to(p.socketid).emit('participant-left',{
                leavesocketid:socket.id
            })
        })
        
        updateroom()
    }
}
const initiationpeerconnection=(socket,data)=>{
    const socketid=data.connecteduserSocketid
    socket.to(socketid).emit('conn-init',{connecteduserSocketid:socket.id})
}
const signalpeerdata=(socket,data)=>{
    const newobj={connectedSocketId:socket.id,signal:data.signal}
    console.log(newobj,'masila',data)
    socket.to(data.connectedSocketId).emit('conn-signal',newobj)
}
module.exports={handlerconnection,signalpeerdata,initiationpeerconnection,joinroom,leaveroom,getsocketio,getactiverooms,removeconnection,getonlinereciever,initialchathistory,setsocketserverinstance,showfreindlist,getonlineusers,chatsendingtoreceriver,roomcreate}
