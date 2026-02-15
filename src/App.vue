<script setup>
import { onMounted } from 'vue';
import { useRouter, RouterView } from 'vue-router';
import { state, socket, saveSession, getSession } from "./socket";

const router = useRouter(); 

onMounted(() => {
  const session = getSession();
  
  // 1. Lyssna på svaret från servern INNAN vi byter sida
  socket.on("rejoin_success", (data) => {
    console.log("Servern svarade på rejoin:", data);
    
    // Uppdatera all data så att sidan ser exakt likadan ut
    state.currentScreen = data.gameState;
    
    // Om servern skickade med en fråga eller poäng, spara det
    if (data.currentQuestion) state.currentQuestion = data.currentQuestion;
    // if (data.scores) state.scores = data.scores; (Om du använder detta)

    // NU bestämmer vi vilken sida vi ska visa
    if (data.gameState === 'playing' || data.gameState === 'question' || data.gameState === 'leaderboard') {
      // Om spelet är igång -> Gå direkt till spelet
      router.push('/play');
    } else {
      // Annars -> Gå till lobbyn/väntrummet
      router.push('/join');
    }
  });

  // 2. Om vi har en sparad session i minnet
  if (session.room && session.name) {
    console.log("Hittade session, försöker återansluta...", session);
    
    // Återställ datan lokalt först
    state.playerName = session.name;
    state.roomCode = session.room;

    // Säg till servern att vi är tillbaka
    socket.emit("rejoin", { 
      room: session.room, 
      name: session.name 
    });
  } else {
    // Ingen session? Då ska vi nog till startsidan
    if (router.currentRoute.value.path !== '/') {
      router.push('/');
    }
  }
});
</script>

<template>
  <main>
    <RouterView />
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;800&display=swap');

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

button {
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  cursor: pointer;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.3);
  filter: brightness(1.1);
}

button:active {
  transform: translateY(0);
}

h1, h2, h3 {
  color: #FFCCFD;
  text-shadow: 0 0 10px rgba(255, 204, 253, 0.3);
}
</style>