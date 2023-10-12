const verify=require('./middleware/socketmiddleware')
const connectedhandler=require('./handlers/connctsockethandlers')
const chatsetdatbase = require('./handlers/chatconnectionhaner')
let io
const Registersocket=(server)=>{
    const io=require('socket.io')(server,{
        cors:{
            origin:'*',
            Method:['GET',"POST"]
        },
        
        
    })
    connectedhandler.setsocketserverinstance(io)
    
    const emitonlineuser=()=>{
        const onlinusers=connectedhandler.getonlineusers()
        
        io.emit('online-users',{onlinusers})
    }
    io.use((socket,next)=>{
        verify.verifytoken(socket,next)
    })
    io.on('connection',(socket)=>{
       
        connectedhandler.handlerconnection(socket)
        emitonlineuser()
        socket.on('private-message',(data)=>{
            console.log(data)
            chatsetdatbase(socket,data)
        })
        socket.on('room-create',()=>{
            connectedhandler.roomcreate(socket)
        })
        socket.on('join-room',(data)=>{
            connectedhandler.joinroom(socket,data)
        })
        socket.on('leave-room',(data)=>{
            connectedhandler.leaveroom(socket,data)
        })
        socket.on('conn-init',(data)=>{
            connectedhandler.initiationpeerconnection(socket,data)
        })
        socket.on('signal-conn',(data)=>{
            console.log('signal-conn')
            connectedhandler.signalpeerdata(socket,data)
        })
        socket.on('initial-chat',(data)=>{
            connectedhandler.initialchathistory(socket,data)
        })
        socket.on('disconnect',()=>{
            connectedhandler.removeconnection(socket)
        })

    })
   setInterval(() => {
    emitonlineuser()
   }, 9000);
    
}
module.exports={Registersocket}