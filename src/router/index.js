import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HostView from '../views/HostView.vue'
import JoinView from '../views/JoinView.vue'
// NYA IMPORTER:
import PlayerGameView from '../views/PlayerGameView.vue'
import HostGameView from '../views/HostGameView.vue'
import ResultView from '../views/ResultView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/host', name: 'host', component: HostView },
    { path: '/join', name: 'join', component: JoinView },
    // NYA ROUTES:
    { path: '/play', name: 'play', component: PlayerGameView },
    { path: '/host-game', name: 'host-game', component: HostGameView },
    {
      path: '/result',
      name: 'result',
      component: ResultView
    }
  ]
})

export default router