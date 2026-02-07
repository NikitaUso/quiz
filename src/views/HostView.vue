<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router' // <-- NYTT: Importera router
import { socket } from '../socket'

const router = useRouter() // <-- NYTT: Starta routern
const lobbyCode = ref("Laddar...")
const players = ref([])

function startGame() {
  // 1. Skicka signal till servern med rätt rumskod
  socket.emit("start_game", lobbyCode.value)
  
  // 2. Flytta Hosten till spelsidan
  router.push('/host-game')
}

onMounted(() => {
  // Skapa spel och lyssna efter kod
  socket.emit("create_game")

  socket.on("game_created", (code) => {
    lobbyCode.value = code
  })

  // Lyssna efter spelare
  socket.on("player_joined", (playerName) => {
    players.value.push(playerName)
  })
})
</script>

<template>
  <div class="host-container">
    <h1>Lobby</h1>
    <div class="code-box">
      <p>SPELKOD:</p>
      <h2>{{ lobbyCode }}</h2>
    </div>

    <div class="players-list">
      <h3>Anslutna Lag:</h3>
      <ul>
        <li v-for="player in players" :key="player">{{ player }}</li>
      </ul>
      <p v-if="players.length === 0">Väntar på att spelare ska ansluta...</p>
    </div>

    <button class="start-btn" @click="startGame">Starta Spelet</button>
  </div>
</template>

<style scoped>
.host-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.code-box {
  background: #333;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #FFCCFD;
  min-width: 200px;
}

h2 {
  font-size: 3rem;
  margin: 0;
  color: #FFCCFD;
  letter-spacing: 5px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  font-size: 1.5rem;
  margin: 5px 0;
}

.start-btn {
  margin-top: 30px;
  background-color: #FFCCFD;
  padding: 15px 40px;
  font-size: 1.5rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #333;
}
</style>