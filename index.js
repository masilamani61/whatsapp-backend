const express=require('express')
const cors=require('cors')
const socket=require('./socketio')
const app=express()
const frndinvitationRoute=require('./Routes/freindsinvitationroute')
const mongoose=require('mongoose')
const http=require('http')
const authRoute=require('./Routes/authRoute')
require('dotenv').config() 
const port=process.env.port
const MONGOURL=process.env.mongourl
app.use(express.json())
app.use(cors({'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization','Access-Control-Allow-Methods':'GET,POST,PUT,DELETE'}))
app.use('/api/auth',authRoute)
app.use('/api/friendinvitation',frndinvitationRoute)
console.log(MONGOURL,port)
mongoose.connect(MONGOURL).then(()=>{
    console.log('connected')
}) 

const server=http.createServer(app)
socket.Registersocket(server)
server.listen(port,()=>{
    console.log('server listening '+port)
})

