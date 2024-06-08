const WebSocket = require('ws');
const fs = require('fs');

const server = new WebSocket.Server({ port: 8080 });

let clients = [];

server.on('connection', socket => {
    clients.push(socket);
    console.log('New client connected');

    socket.on('message', message => {
        console.log('Received:', message);

        // Write the received message to a file (optional)
        fs.writeFile('received_data.json', message, err => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('Data written to file');
            }
        });

        // Broadcast the message to all clients except the sender
        clients.forEach(client => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    socket.on('close', () => {
        clients = clients.filter(client => client !== socket);
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');