const { Server } = require('socket.io');
const { createServer } = require('http');

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

let onlineUsers = [];

io.on('connection', (socket) => {
    console.log('A user Connected:', socket.id);

    socket.on('user-join', (username) => {
        socket.username = username;
        onlineUsers.push(username);
        console.log(`${username} joined the chat`);
        
        io.emit('user-joined', {
            username,
            onlineUsers
        });
    });

    socket.on('send-message', (data) => {
        console.log(`Received message from ${data.username}: ${data.text}`);
        
        io.emit('receive-message', {
            id: Date.now().toString(),
            username: data.username,
            text: data.text,
            time: new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })
        });
    });

    socket.on('typing', (username) => {
        socket.broadcast.emit('user-typing', username);
    });

    socket.on('stop-typing', () => {
        socket.broadcast.emit('user-stop-typing');
    });

    socket.on('disconnect', () => {
        console.log('A user Disconnected:', socket.username);
        if (socket.username) {
            onlineUsers = onlineUsers.filter(u => u !== socket.username);
            io.emit('user-left', {
                username: socket.username,
                onlineUsers
            });
        }
    });
});

httpServer.listen(3001, () => {
    console.log('Socket.IO Server is running on http://localhost:3001');
}); 
