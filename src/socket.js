import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  playerName: "",
  roomCode: "",
  finalScores: {} // <-- NYTT: Här sparar vi slutresultatet
});

const URL = import.meta.env.PROD 
  ? "HÄR_SKA_DIN_RAILWAY_ADRESS_IN_SENARE" 
  : "http://localhost:3000";

export const socket = io(URL, {
    autoConnect: true
});

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});