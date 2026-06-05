const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer , {
    cors : {
        origin :'*' 
    }
});

io.on('connection' , (socket)=>{
    console.log(`User connected : ${socket.id}`)

    socket.on('chat-message' , (data) =>{
        console.log(`Received message from ${data.username} at ${Date.now()} : ${data.message}`)
    
        io.emit('chat-message' , {
            username : data.username,
            message : data.message,
            timestamp : Date.now().toString()
        })
    })
        socket.on('typing' , (username) =>{
            socket.broadcast.emit('typing' , username)
        })
        
        socket.on('disconnect' ,()=>{
            console.log(`User disconnected : ${socket.id}`)
        })

})

httpServer.listen(3000 , ()=>{
    console.log('Socket.IO Server is running on http://localhost:3000')
})




