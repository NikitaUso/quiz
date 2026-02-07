import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Importera routern
import './socket' // Startar anslutningen

const app = createApp(App)

app.use(router) // Säg åt appen att använda routern

app.mount('#app')