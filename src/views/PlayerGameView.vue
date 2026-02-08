<script setup>
import { ref, onMounted } from 'vue'
import { socket, state } from '../socket' 

const songs = ref(['', '', '', ''])
const artists = ref(['', '', '', ''])
const category = ref('')
const sent = ref(false)

function submitAnswers() {
  socket.emit('submit_answers', {
    room: state.roomCode,
    player: state.playerName,
    songs: songs.value,
    artists: artists.value,
    category: category.value
  })
  sent.value = true
}

onMounted(() => {
  socket.on('new_round', () => {
    songs.value = ['', '', '', '']
    artists.value = ['', '', '', '']
    category.value = ''
    sent.value = false
  })

  socket.on('game_over', (finalScores) => {
    state.finalScores = finalScores
    // Vi använder router.push här om vi hade importerat router, 
    // men den ligger redan i lyssnaren i JoinView/App-nivå ofta. 
    // För säkerhets skull kan vi lägga till importen om det behövs, 
    // men oftast räcker det med att lyssnaren finns.
    // (För enkelhetens skull låter vi denna vara som den är)
    import('../router').then(module => module.default.push('/result'))
  })
})
</script>

<template>
  <div class="game-container">
    <div v-if="!sent">
      <h1>Fyll i dina gissningar!</h1>

      <div class="pairs-grid">
        <div v-for="(n, index) in 4" :key="index" class="pair-card">
          <div class="card-header">
            <span class="number">#{{ n }}</span>
          </div>
          
          <div class="inputs-wrapper">
            <div class="input-box">
              <label>Låt</label>
              <input v-model="songs[index]" placeholder="Vad heter låten?" />
            </div>

            <div class="input-box">
              <label>Artist</label>
              <input v-model="artists[index]" placeholder="Vem sjunger?" />
            </div>
          </div>
        </div>
      </div>

      <div class="category-section">
        <h3>Kategori</h3>
        <input v-model="category" placeholder="Vilken är den röda tråden?" class="category-input" />
      </div>

      <div class="button-area">
        <button @click="submitAnswers">SKICKA SVAR</button>
      </div>
    </div>

    <div v-else class="waiting">
      <h2>Svar inskickade!</h2>
      <p>Håll tummarna...</p>
      <div class="loader"></div>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 50px;
}

h1 {
  font-weight: 800;
  margin-bottom: 20px;
  font-size: 2rem;
  text-align: center;
}

/* Rutnätet för korten */
.pairs-grid {
  display: grid;
  grid-template-columns: 1fr; /* Mobil: 1 kolumn */
  gap: 20px;
  margin-bottom: 30px;
}

/* Dator: 2 kolumner (2x2 rutnät) */
@media (min-width: 700px) {
  .pairs-grid {
    grid-template-columns: 1fr 1fr; 
  }
}

/* Designen på varje kort */
.pair-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 15px;
  position: relative;
  transition: transform 0.2s;
}

.pair-card:focus-within {
  border-color: rgba(255, 204, 253, 0.5);
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.card-header {
  margin-bottom: 10px;
  text-align: left;
}

.number {
  font-size: 1.2rem;
  font-weight: 800;
  color: #FFCCFD;
  background: rgba(255, 204, 253, 0.1);
  padding: 5px 10px;
  border-radius: 8px;
}

.inputs-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-box {
  display: flex;
  flex-direction: column;
  text-align: left;
}

label {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
  margin-bottom: 5px;
  margin-left: 5px;
  font-weight: 600;
}

input {
  background: rgba(0, 0, 0, 0.2);
  color: white;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid transparent;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

input:focus {
  outline: none;
  border-color: #FFCCFD;
  background: rgba(0, 0, 0, 0.4);
}

/* Kategori-sektionen */
.category-section {
  margin-top: 20px;
  background: rgba(255, 204, 253, 0.05); /* Svagt rosa bakgrund */
  padding: 20px;
  border-radius: 15px;
  border: 1px solid rgba(255, 204, 253, 0.2);
}

.category-section h3 {
  margin-top: 0;
  color: #FFCCFD;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.category-input {
  border: 2px solid rgba(255, 204, 253, 0.3);
  text-align: center;
  font-size: 1.2rem;
}

.button-area {
  margin-top: 30px;
  text-align: center;
}

button {
  background-color: #FFCCFD;
  border: none;
  padding: 18px 50px;
  font-size: 1.2rem;
  font-weight: 800;
  border-radius: 50px;
  color: #1a1a1a;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

button:active {
  transform: scale(0.98);
}

/* Väntskärmen */
.waiting {
  text-align: center;
  margin-top: 50px;
}

.loader {
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #FFCCFD;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 30px auto;
}

@keyframes spin { 
  0% { transform: rotate(0deg); } 
  100% { transform: rotate(360deg); } 
}
</style>