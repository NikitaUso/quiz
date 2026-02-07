const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

// VIKTIGT: På Render är process.env.PORT satt. Lokalt är den undefined, så då tar vi 3000.
const PORT = process.env.PORT || 3000;

const io = new Server(server, {
  cors: {
    origin: "*", // Tillåter alla att ansluta (enklast så här i början)
    methods: ["GET", "POST"]
  }
});

let gameScores = {}; 

io.on('connection', (socket) => {
  console.log(`En användare anslöt! ID: ${socket.id}`);

  // 1. Skapa spel
  socket.on('create_game', () => {
    const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
    socket.join(roomCode);
    socket.emit('game_created', roomCode);
    console.log(`Spel skapat med kod: ${roomCode}`);
    gameScores = {}; 
  });

  // 2. Gå med
  socket.on('join_game', ({ room, name }) => {
    socket.join(room);
    io.to(room).emit('player_joined', name);
  });

  // 3. Starta
  socket.on('start_game', (room) => {
    io.to(room).emit('game_started');
  });

  // 4. Ta emot svar
  socket.on('submit_answers', (data) => {
    io.to(data.room).emit('receive_submission', data);
  });

  // 5. Avsluta runda
  socket.on('finish_round', (roundScores) => {
    if (!roundScores) return;
    for (const [player, score] of Object.entries(roundScores)) {
      if (!gameScores[player]) gameScores[player] = 0;
      gameScores[player] += score;
    }
    io.emit('new_round');
  });

  // 6. Avsluta spel
  socket.on('end_game', () => {
    io.emit('game_over', gameScores);
    gameScores = {};
  });

  socket.on('disconnect', () => {
    console.log('En användare lämnade.');
  });
});

// VIKTIGT: Använd variabeln PORT här, inte siffran 3000
server.listen(PORT, () => {
  console.log(`SERVERN KÖRS PÅ PORT ${PORT}`);
});