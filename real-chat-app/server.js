const Server = require('socket.io');
const {createServer} = require('http')

const httpServer = createServer();
const io = new Server(httpServer , {
    cors:{
        origin:'*'
    }
})

io.on('connection' , ()=>{
    console.log('A user Connected')

    socket.on('chat-message' , (data) =>{
        console.log(`Received message from ${data.username} at ${Date.now()} : ${data.message}`)
    
        io.emit('chat-message' , {
            username : data.username,
            message : data.message,
            timestamp : Date.now().toString()
        })
    })
    socket.on('disconnect' ,()=>{
        console.log('A user Disconnected')
    })
})

httpServer.listen(3000 , ()=>{
    console.log('Socket.IO Server is running on http://localhost:3000')
}) 
