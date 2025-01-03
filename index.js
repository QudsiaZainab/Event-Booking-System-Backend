import express from 'express';
import http from 'http';
// import { Server } from 'socket.io';
import cors from 'cors';
import { connectDB } from './config/db.js';
import 'dotenv/config';
import authRouter from './routes/authRoutes.js';
import eventRouter from './routes/eventRoutes.js';

const app = express();
const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "*",
//         methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
//     }
// });
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRouter);
app.use('/api/events', eventRouter);

// // WebSocket Logic
// io.on('connection', (socket) => {
//     console.log('A user connected');

//     socket.on('seatBooked', (data) => {
//         io.emit('updateSeats', data);  // Emit update to all connected clients
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
// });

// // Export io for direct access in other files
// export { io };

app.get("/", (req, res) => {
    res.send("API Working with WebSockets");
});

server.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});
