const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

// VIKTIGT: På nätet bestämmer Railway porten via process.env.PORT
const PORT = process.env.PORT || 3000; 

const io = new Server(server, {
  cors: {
    // "*" betyder att vi tillåter trafik från ALLA adresser. 
    // Det är enklast nu i början för att slippa krångel.
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// --- HÄR SPARAS TOTALA POÄNGEN (Globalt) ---
let gameScores = {}; 

io.on('connection', (socket) => {
  console.log(`En användare anslöt! ID: ${socket.id}`);

  // 1. Skapa spel (Host)
  socket.on('create_game', () => {
    const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
    socket.join(roomCode);
    socket.emit('game_created', roomCode);
    console.log(`Spel skapat med kod: ${roomCode}`);
    
    // Nollställ poängen när ett nytt spel skapas
    gameScores = {}; 
  });

  // 2. Gå med i spel (Lag)
  socket.on('join_game', ({ room, name }) => {
    console.log(`${name} försöker gå med i rum ${room}`);
    socket.join(room);
    io.to(room).emit('player_joined', name);
  });

  // 3. Starta spelet
  socket.on('start_game', (room) => {
    console.log(`Startar spelet i rum ${room}`);
    io.to(room).emit('game_started');
  });

  // 4. Ta emot svar
  socket.on('submit_answers', (data) => {
    console.log(`Svar mottagna från ${data.player}`);
    io.to(data.room).emit('receive_submission', data);
  });

  // 5. Avsluta runda och räkna poäng
  socket.on('finish_round', (roundScores) => {
    console.log("Rundan avslutad. Poäng:", roundScores);

    // Säkerhetskoll så vi inte kraschar om data saknas
    if (!roundScores) return;

    // Uppdatera totalen
    for (const [player, score] of Object.entries(roundScores)) {
      if (!gameScores[player]) {
        gameScores[player] = 0;
      }
      gameScores[player] += score;
    }
    
    console.log("Totalställning just nu:", gameScores);

    // Meddela alla att en ny runda startar
    io.emit('new_round');
  });

  // När hosten avslutar spelet
  socket.on('end_game', () => {
    console.log("Spelet avslutat! Skickar resultat.");
    // Skicka 'game_over' OCH poänglistan till alla
    io.emit('game_over', gameScores);
    
    // Nollställ för nästa gång
    gameScores = {};
  });

  socket.on('disconnect', () => {
    console.log('En användare lämnade.');
  });
});

server.listen(PORT, () => {
  console.log(`SERVERN KÖRS PÅ PORT ${PORT}`);
});