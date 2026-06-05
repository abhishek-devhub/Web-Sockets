const {WebSocketServer} = require('ws')
const wss = new WebSocketServer({port: 8080})

wss.on('connection' , (ws)=>{
    console.log('Client connected' , wss.clients.size)

    wss.on('message' , (message)=>{
        const data = message.toString()
        console.log('Received The message : ' + data)

        wss.clients.forEach((client)=>{
            if (client.readyState === WebSocket.OPEN){  // 1 or WebSocket.OPEN
                client.send(data)
            }
        })
    })
    wss.on('close' , () =>{
        console.log('Client Disconnected' , wss.clients.size)
    })
})

console.log('WebSocket Server is running on ws://localhost:8080')
