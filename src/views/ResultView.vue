<script setup>
import { computed } from 'vue'
import { state } from '../socket'

const leaderboard = computed(() => {
  const entries = Object.entries(state.finalScores || {})
  return entries.sort((a, b) => b[1] - a[1])
})
</script>

<template>
  <div class="result-wrapper">
    <div class="result-container">
      <h1>🏆 Resultat 🏆</h1>
      
      <div class="leaderboard">
        <div 
          v-for="(entry, index) in leaderboard" 
          :key="entry[0]" 
          class="score-card"
          :class="{ winner: index === 0 }"
        >
          <div class="left-side">
            <span class="rank">#{{ index + 1 }}</span>
            <span class="name">{{ entry[0] }}</span>
          </div>
          <span class="points">{{ entry[1] }} p</span>
        </div>
      </div>

      <p v-if="leaderboard.length === 0">Inga poäng registrerade...</p>
      
      <a href="/" class="home-link">Tillbaka till start</a>
    </div>
  </div>
</template>

<style scoped>
.result-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.result-container {
  text-align: center;
  width: 95%; /* Nästan hela bredden på mobil */
  max-width: 500px; /* Maxbredd på dator */
  margin-top: 20px;
}

h1 {
  font-size: 2.5rem;
  color: #FFCCFD;
  margin-bottom: 30px;
  text-shadow: 0 0 20px rgba(255, 204, 253, 0.4);
}

.leaderboard {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.score-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 15px;
  display: flex;
  justify-content: space-between; /* Skickar namn till vänster, poäng till höger */
  align-items: center;
  font-size: 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.left-side {
  display: flex;
  align-items: center;
  gap: 15px;
  overflow: hidden; /* För långa lagnamn */
}

/* Vinnaren */
.winner {
  border: 2px solid #FFD700;
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.2) 100%);
  transform: scale(1.05);
  margin-bottom: 10px;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
}

.rank {
  font-weight: 800;
  color: rgba(255, 255, 255, 0.5);
  width: 30px;
  text-align: left;
}

.winner .rank {
  color: #FFD700;
}

.name {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px; /* Klipp namnet om det är för långt på mobil */
}

.points {
  font-weight: 800;
  color: #FFCCFD;
  white-space: nowrap;
}

.home-link {
  display: inline-block;
  margin-top: 40px;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.9rem;
  border-bottom: 1px solid transparent;
  padding-bottom: 5px;
}

.home-link:hover {
  color: white;
  border-color: white;
}
</style>