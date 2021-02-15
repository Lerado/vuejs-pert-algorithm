import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Tasks from './views/Tasks.vue'
import Final from './views/Final.vue'
import Dependancies from './views/Dependancies.vue'

Vue.use(Router)

export default new Router ({
    routes: [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/taches',
        name: 'tasks',
        component: Tasks
    },
    {
        path: '/taches/dependances',
        name: 'dependancies',
        component: Dependancies
    },
    {
        path: '/algorithme',
        name: 'algorithm',
        component: Final
    }]
})