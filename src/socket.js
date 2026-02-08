import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  playerName: "",
  roomCode: "",
  finalScores: {}
});

// Här klistrar vi in din Render-länk!
const URL = import.meta.env.PROD 
  ? "https://quiz-backend-buhy.onrender.com" 
  : "http://localhost:3000";

export const socket = io(URL, {
    autoConnect: true
});

socket.on("connect", () => {
  state.connected = true;
  console.log("Ansluten till servern!");
});

socket.on("disconnect", () => {
  state.connected = false;
  console.log("Tappade kontakten...");
});

socket.on("rejoin_success", (data) => {
  console.log("Återansluten!", data);
  // Återställ all data i appen
  state.currentScreen = data.gameState; 
  
  // Om du har variabler för frågor/poäng i state, uppdatera dem här:
  // state.currentQuestion = data.currentQuestion;
  // state.players = data.scores;
});

// Spara sessionen
export function saveSession(room, name) {
  sessionStorage.setItem("quiz_room", room);
  sessionStorage.setItem("quiz_name", name);
}

// Hämta sessionen
export function getSession() {
  return {
    room: sessionStorage.getItem("quiz_room"),
    name: sessionStorage.getItem("quiz_name")
  };
}