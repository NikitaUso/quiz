<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { socket, state } from '../socket'

const router = useRouter()
const teamName = ref("")
const gameCode = ref("")
const hasJoined = ref(false)

function joinGame() {
  if (!teamName.value || !gameCode.value) {
    alert("Du måste fylla i både namn och kod!")
    return
  }

  state.playerName = teamName.value
  state.roomCode = gameCode.value

  socket.emit("join_game", { 
    room: gameCode.value, 
    name: teamName.value 
  })

  hasJoined.value = true
}

onMounted(() => {
  socket.on('game_started', () => {
    router.push('/play')
  })
})
</script>

<template>
  <div class="join-wrapper">
    <div class="join-container">
      <div v-if="!hasJoined" class="form-content">
        <h1>Gå med i spel</h1>
        
        <div class="input-group">
          <label>Lagnamn</label>
          <input v-model="teamName" type="text" placeholder="T.ex. Laget" />
        </div>

        <div class="input-group">
          <label>Rumskod</label>
          <input v-model="gameCode" type="tel" placeholder="1234" maxlength="4" />
        </div>

        <button @click="joinGame">GÅ MED</button>
      </div>

      <div v-else class="waiting-screen">
        <h2>Välkommen {{ teamName }}!</h2>
        <p>Väntar på att hosten ska starta spelet...</p>
        <div class="loader"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Centrera allt på sidan */
.join-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 60vh; /* Se till att den hamnar mitt i ögonhöjd */
}

.join-container {
  width: 90%; /* Tar upp 90% av mobilskärmen */
  max-width: 400px; /* Men blir inte bredare än 400px på dator */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.form-content {
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
  width: 100%;
}

label {
  font-weight: 600;
  margin-bottom: 10px;
  color: #FFCCFD;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

input {
  padding: 20px;
  font-size: 1.5rem; /* Stor text för mobilen */
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: white;
  text-align: center; /* Centrerad text i rutan */
  width: 100%;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
  outline: none;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #FFCCFD;
  box-shadow: 0 0 15px rgba(255, 204, 253, 0.3);
}

button {
  background-color: #FFCCFD;
  border: none;
  padding: 20px;
  font-size: 1.5rem;
  font-weight: 800;
  cursor: pointer;
  border-radius: 50px;
  width: 100%; /* Knappen fyller hela bredden */
  margin-top: 10px;
  color: #1a1a1a;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

button:active {
  transform: scale(0.98);
}

.waiting-screen {
  text-align: center;
}

.loader {
  border: 5px solid rgba(255,255,255,0.1);
  border-top: 5px solid #FFCCFD;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 30px auto;
}

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>