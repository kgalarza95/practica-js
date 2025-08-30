const express = require('express');
const path = require('path');
const chokidar = require('chokidar');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    console.log('cliente conextado por hot reload');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});


const watcher = chokidar.watch('./public', {
    ignored: /node_modules/,
    persistent: true,
    ignoreInitial: true
});

watcher.on('change', (filePath) => {
    console.log([`File ${filePath} has been changed`]);
    io.emit('reload');
});

watcher.on('ad', (filePath) => {
    console.log([`File ${filePath} has been added`]);
    io.emit('reload');
});


watcher.on('unlink', (filePath) => {
    console.log([`File ${filePath} has been unlinked`]);
    io.emit('reload');
});


server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});

