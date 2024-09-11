import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '~/views/Home'
import About from '~/views/About'
import TodoApp from '~/views/TodoApp'

Vue.use(VueRouter)

const routes = [
  // config
  {
    name: 'index',
    path: '/', // site root page
    component: Home
  },
  {
    name: 'about',
    path: '/about',
    component: About
  },
  {
    name: 'todos',
    path: '/todos',
    redirect: '/todos/all',
    component: TodoApp,
    children: [{
      name: 'todos-filter',
      path: ':id' // 여기에다가 파라미터를 지정할 거다.
    }]
  }
]

export default new VueRouter({
  routes
})
