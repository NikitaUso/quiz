<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { socket, state } from '../socket' // Vi importerar state för att spara slutresultatet

const router = useRouter()
const submissions = ref([]) 

// Funktion för att avsluta rundan och dela ut poäng
function finishRound() {
  const roundScores = {}

  // Gå igenom alla inlämnade svar och räkna poäng
  submissions.value.forEach(sub => {
    let points = 0
    
    // 1 poäng för varje ikryssad låt
    sub.marks.songs.forEach(checked => { if(checked) points += 1 })
    
    // 1 poäng för varje ikryssad artist
    sub.marks.artists.forEach(checked => { if(checked) points += 1 })
    
    // 10 poäng för kategori
    if (sub.marks.category) points += 10

    roundScores[sub.player] = points
  })

  // Skicka poängen till servern
  socket.emit('finish_round', roundScores)
  
  // Rensa listan inför nästa runda
  submissions.value = []
}

// Funktion för att helt AVSLUTA spelet
function endGame() {
  if(confirm("Är du säker på att du vill avsluta spelet och visa vinnaren?")) {
    socket.emit('end_game')
  }
}

onMounted(() => {
  // Lyssna efter svar från servern
  socket.on('receive_submission', (data) => {
    // När ett svar kommer, lägger vi till "kryssrutor" (false från början)
    submissions.value.push({
      ...data,
      marks: {
        songs: [false, false, false, false],
        artists: [false, false, false, false],
        category: false
      }
    })
  })

  // Lyssna på om spelet tar slut (så även hosten byter sida)
  socket.on('game_over', (finalScores) => {
    state.finalScores = finalScores // Spara resultatet i minnet
    router.push('/result')          // Gå till resultatsidan
  })
})
</script>

<template>
  <div class="host-game">
    <button @click="endGame" class="end-btn">Avsluta Spel</button>

    <h1>Rätta Svaren</h1>
    <p>Kryssa i de som är rätt. Datorn räknar poängen.</p>
    
    <div class="submissions-grid">
      <div v-for="sub in submissions" :key="sub.player" class="team-card">
        <h2>{{ sub.player }}</h2>
        
        <div class="answers-block">
          <strong>Låtar (1p):</strong>
          <div v-for="(song, i) in sub.songs" :key="'s'+i" class="check-row">
            <input type="checkbox" v-model="sub.marks.songs[i]" class="big-checkbox" />
            <span>{{ i+1 }}. {{ song }}</span>
          </div>
        </div>

        <div class="answers-block">
          <strong>Artister (1p):</strong>
          <div v-for="(artist, i) in sub.artists" :key="'a'+i" class="check-row">
            <input type="checkbox" v-model="sub.marks.artists[i]" class="big-checkbox" />
            <span>{{ i+1 }}. {{ artist }}</span>
          </div>
        </div>

        <div class="answers-block category-block">
           <strong>Kategori (10p):</strong>
           <div class="check-row">
             <input type="checkbox" v-model="sub.marks.category" class="big-checkbox" />
             <span class="category-text">{{ sub.category }}</span>
           </div>
        </div>
      </div>
    </div>

    <div v-if="submissions.length > 0" class="action-area">
      <button @click="finishRound" class="next-btn">Ge poäng & Nästa Runda</button>
    </div>

    <div v-else class="waiting">
      <p>Väntar på svar...</p>
      <div class="loader"></div>
    </div>
  </div>
</template>

<style scoped>
.host-game {
  width: 100%;
  max-width: 1200px;
  padding-bottom: 100px;
}

/* Grid för lagkorten */
.submissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Responsiv grid */
  gap: 25px;
  margin-top: 40px;
}

/* Lagkortet */
.team-card {
  background: #252525;
  border-top: 4px solid #FFCCFD; /* Bara en rosa linje i toppen */
  border-radius: 12px;
  padding: 20px;
  text-align: left;
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
  transition: transform 0.2s;
}

.team-card:hover {
  transform: translateY(-5px); /* Lyfter lite när man hovrar */
}

.team-card h2 {
  color: white;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 10px;
}

.answers-block {
  margin-bottom: 20px;
}

.answers-block strong {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 8px;
}

/* Checkbox-raden */
.check-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  background: rgba(0,0,0,0.2);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.check-row:hover {
  background: rgba(255, 204, 253, 0.05);
}

/* Gör checkboxen snyggare */
.big-checkbox {
  appearance: none; /* Ta bort standardutseendet */
  width: 24px;
  height: 24px;
  border: 2px solid #555;
  border-radius: 6px;
  background: #333;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.big-checkbox:checked {
  background-color: #FFCCFD;
  border-color: #FFCCFD;
}

/* Skapa en "bock" med CSS när den är ikryssad */
.big-checkbox:checked::after {
  content: '✔';
  color: #1a1a1a;
  font-size: 16px;
  font-weight: bold;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
}

.category-text {
  font-weight: bold;
  color: #FFCCFD;
  font-size: 1.1rem;
}

/* Knappar */
.next-btn {
  background-color: #FFCCFD;
  padding: 15px 40px;
  font-size: 1.2rem;
  font-weight: 800;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 5px 20px rgba(0,0,0,0.4);
  color: #1a1a1a;
  z-index: 100;
}

.end-btn {
  background-color: rgba(255, 68, 68, 0.1); /* Genomskinlig röd */
  color: #ff4444;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 2px solid #ff4444;
  border-radius: 8px;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
}

.end-btn:hover {
  background-color: #ff4444;
  color: white;
}

.loader {
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #FFCCFD;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 50px auto;
}

@keyframes spin { 
  0% { transform: rotate(0deg); } 
  100% { transform: rotate(360deg); } 
}
</style>