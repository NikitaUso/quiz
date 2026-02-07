<script setup>
import { RouterView } from 'vue-router'
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
  /* En mörk gradient ser lyxigare ut än platt färg */
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif; /* Vårt nya typsnitt */
  -webkit-font-smoothing: antialiased;
}

#app {
  width: 100%;
  max-width: 900px; /* Lite bredare för att få plats med allt */
  text-align: center;
  padding: 20px;
  box-sizing: border-box;
}

/* Global knapp-design (så alla knappar ser likadana ut) */
button {
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s ease; /* Mjuk animation vid klick/hovring */
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
}

button:hover {
  transform: translateY(-2px); /* Lyfter lite när man pekar */
  box-shadow: 0 6px 12px rgba(0,0,0,0.3);
  filter: brightness(1.1);
}

button:active {
  transform: translateY(0);
}

/* Rubriker */
h1, h2, h3 {
  color: #FFCCFD;
  text-shadow: 0 0 10px rgba(255, 204, 253, 0.3); /* Lite neon-glow */
}
</style>