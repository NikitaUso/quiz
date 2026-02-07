import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  playerName: "",
  roomCode: "",
  finalScores: {}
});

// HÄR ÄR DET VIKTIGA FÖR ATT DET SKA FUNKA PÅ NÄTET:
// När vi laddar upp till Vercel (PROD) använder den din Render-länk.
// Hemma (DEV) använder den localhost.
const URL = import.meta.env.PROD 
  ? "HÄR_SKA_DIN_RENDER_LÄNK_IN_SENARE" // <-- Vi byter ut denna när Render är klart!
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