<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function startAsHost() {
  router.push('/host')
}

function joinLobby() {
  router.push('/join')
}
</script>

<template>
  <div class="start-wrapper">
    <div class="start-container">
      <h1>Musikquiz Lobby</h1>
      <p>Välj din roll för att börja</p>

      <div class="button-group">
        <button @click="startAsHost">Starta som Host</button>
        <button @click="joinLobby">Gå med som Lag</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.start-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  width: 100%;
}

.start-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 90%;
  max-width: 400px;
}

h1 {
  font-size: 2.5rem; /* Något mindre på mobil */
  margin-bottom: 0px;
  line-height: 1.2;
}

p {
  color: rgba(255,255,255,0.7);
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

button {
  background-color: #FFCCFD;
  border: none;
  padding: 25px; /* Rejäla knappar */
  font-size: 1.3rem;
  font-weight: 800;
  cursor: pointer;
  border-radius: 15px;
  color: #1a1a1a;
  width: 100%;
  transition: transform 0.2s;
}

button:active {
  transform: scale(0.96);
}

@media (min-width: 600px) {
  h1 { font-size: 3.5rem; } /* Större på dator */
}
</style>