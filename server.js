import express from "express";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from 'url';
import http from "http";
import indexRoutes from './routes/index.js';
import { formatMessage } from './utils/messages.js';
import { userJoin, getCurrentUser, userLeave, getRoomUsers } from './utils/users.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const botName = 'ChatBoard Bot';

// set static folder
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// run when client connects
io.on('connection', (socket)=>{
    socket.on('joinRoom', ({username, room})=>{
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        // welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord'));
        // broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage(botName,`${username} has joined the chat`));
        // send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });
    // listen for chatMessage
    socket.on('chatMessage', (msg)=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
    // runs when client disconnects
    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id);
        console.log("user", user);
        if(user){
            io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`));
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

app.use('/firstrepo', express.static(path.join(__dirname, '/public')));
// view engine
app.set('view engine', 'ejs');

app.use(indexRoutes);

const port = 5000;

server.listen(port, console.log(`server was running on port ${port}`));