import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

async function main() {
    const app = express();

    app.use(express.static('public'));

    const httpServer = createServer(app);
    const io = new Server(httpServer);

    io.on('connection', (socket) => {
        console.log('user connected', socket.id);

        socket.on('join', (name) => {
            socket.data.name = name;
            socket.broadcast.emit('message', { name: 'System', text: `${name} joined the chat`, ts: Date.now() });
        });

        socket.on('message', (msg) => {
            socket.broadcast.emit('message', msg);
        });

        socket.on('disconnect', () => {
            const name = socket.data.name || 'Someone';
            socket.broadcast.emit('message', { name: 'System', text: `${name} left the chat`, ts: Date.now() });
            console.log('user disconnected', socket.id);
        });
    });

    const port = process.env.PORT || 8000;
    httpServer.listen(port, () => {
        console.log(`Server running on ${port}`);
    });
}

main();
