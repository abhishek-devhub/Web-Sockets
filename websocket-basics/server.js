const {WebSocketServer} = require('ws')

const wss = new WebSocketServer({port: 8080})

wss.on('connection' , (ws) =>{
    console.log('Client connected')

    ws.on('message' , (message) =>{
        console.log('Received The message')
    
    ws.send(`Server says : You sent : ${message}`)
    })

    ws.on('close' , () =>{
        console.log('Client Disconnected')
    })

    ws.send('Welcome to the WebSocket Server')
})

console.log('WebSocket Server is running on ws://localhost:8080')

