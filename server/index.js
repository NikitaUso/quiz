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
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// HÄR ÄR NYCKELN: Vi måste spara alla rum i en variabel!
const rooms = {}; 

io.on('connection', (socket) => {
  console.log(`En användare anslöt! ID: ${socket.id}`);

  // 1. Skapa spel
  socket.on('create_game', () => {
    const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    // SPARA RUMMET I MINNET
    rooms[roomCode] = {
      players: [],        // Lista på alla spelare
      gameState: 'lobby', // Vart är vi? lobby, playing, game_over
      scores: {}          // Poängställning
    };

    socket.join(roomCode);
    socket.emit('game_created', roomCode);
    console.log(`Spel skapat med kod: ${roomCode}`);
  });

  // 2. Gå med
  socket.on('join_game', ({ room, name }) => {
    const currentRoom = rooms[room];

    if (currentRoom) {
      socket.join(room);
      
      // SPARA SPELAREN I MINNET
      // Vi kollar först om spelaren redan finns (för att undvika dubbletter)
      const existingPlayer = currentRoom.players.find(p => p.name === name);
      if (!existingPlayer) {
        currentRoom.players.push({ id: socket.id, name: name, score: 0 });
      } else {
        // Om spelaren fanns, uppdatera deras ID (om de rejoinar "manuellt")
        existingPlayer.id = socket.id;
      }

      io.to(room).emit('player_joined', name);
      console.log(`${name} gick med i rum ${room}`);
    } else {
      socket.emit('error', 'Rummet hittades inte!');
    }
  });

  // 3. Starta spelet
  socket.on('start_game', (room) => {
    if (rooms[room]) {
      rooms[room].gameState = 'playing'; // Uppdatera status
      io.to(room).emit('game_started');
    }
  });

  // 4. Ta emot svar
  socket.on('submit_answers', (data) => {
    // Skicka vidare svaret till alla i rummet (eller bara hosten)
    io.to(data.room).emit('receive_submission', data);
  });

  // --- HÄR ÄR FIXEN FÖR ATT KUNNA LADDA OM SIDAN ---
  socket.on("rejoin", ({ room, name }) => {
    const currentRoom = rooms[room];

    // Kolla om rummet finns i minnet
    if (currentRoom) {
      // Kolla om spelaren finns i listan
      const player = currentRoom.players.find(p => p.name === name);

      if (player) {
        console.log(`Spelare ${name} återansluter till rum ${room}`);

        // VIKTIGT: Uppdatera socket-ID eftersom det byts vid refresh
        player.id = socket.id;
        socket.join(room);

        // Skicka tillbaka spelaren till spelet
        socket.emit("rejoin_success", {
          gameState: currentRoom.gameState, 
          roomCode: room
        });
        
        // Om spelet redan är igång, skicka dem till 'play'-vyn direkt
        if (currentRoom.gameState === 'playing') {
             socket.emit('game_started'); 
        }

      } else {
        console.log("Spelaren fanns inte i rummet.");
      }
    } else {
      console.log("Rummet finns inte längre (servern kanske startades om).");
    }
  });
  // ------------------------------------------------

  // 5. Avsluta runda (Uppdatera poäng)
  socket.on('finish_round', (roundScores) => {
    // roundScores ser ut typ: { "Laget": 5, "Team2": 3 }
    // Du behöver veta vilket rum det gäller. 
    // Om du skickar med roomCode från frontend vore det bäst, 
    // men vi kan gissa om vi hade sparat socket.room.
    
    // För enkelhetens skull, skicka vidare:
    io.emit('new_round'); 
  });

  // 6. Avsluta spel
  socket.on('end_game', (room) => {
    if (rooms[room]) {
      io.to(room).emit('game_over', rooms[room].scores);
      // Rensa rummet eller spara historik om du vill
      // delete rooms[room]; 
    }
  });

  socket.on('disconnect', () => {
    console.log('En användare lämnade.');
    // Här kan man ta bort spelare ur rummet om man vill,
    // men vi låter dem vara kvar så de kan återansluta!
  });
});

server.listen(PORT, () => {
  console.log(`SERVERN KÖRS PÅ PORT ${PORT}`);
});