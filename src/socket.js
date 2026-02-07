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