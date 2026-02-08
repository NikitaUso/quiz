<script setup>
import { onMounted } from 'vue'; // <--- VIKTIG: Denna saknades!
import { RouterView } from 'vue-router';
import { state, socket, saveSession, getSession } from "./socket";

// Här är "motorn" som kollar om vi ska återansluta när sidan laddas
onMounted(() => {
  const session = getSession();
  
  // Om vi hittar sparade uppgifter i webbläsaren
  if (session.room && session.name) {
    console.log("Hittade session, försöker återansluta...", session);
    
    // 1. Återställ vår egen data direkt
    state.playerName = session.name;
    state.roomCode = session.room;

    // 2. Säg till servern: "Jag är tillbaka!"
    socket.emit("rejoin", { 
      room: session.room, 
      name: session.name 
    });
  }
});
</script>

<template>
  <main>
    <RouterView />
  </main>
</template>

<style>
/* 1. Hämta typsnitt */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;800&display=swap');

/* 2. Globala inställningar */
body {
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
}

#app {
  width: 100%;
  max-width: 900px;
  text-align: center;
  padding: 20px;
  box-sizing: border-box;
}

/* Global knapp-design */
button {
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  cursor: pointer; /* Bra att ha så man ser att det går att klicka */
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.3);
  filter: brightness(1.1);
}

button:active {
  transform: translateY(0);
}

/* Rubriker */
h1, h2, h3 {
  color: #FFCCFD;
  text-shadow: 0 0 10px rgba(255, 204, 253, 0.3);
}
</style>