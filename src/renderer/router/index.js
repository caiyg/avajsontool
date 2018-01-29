import Vue from 'vue'
import Router from 'vue-router'
const index = () => import('@/pages/index/index.vue')
const bigData = () => import('@/pages/bigData/bigData.vue')
const zdkt = () => import('@/pages/zdkt/zdkt.vue')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/bigData',
      name: 'bigData',
      component: bigData
    },
    {
      path: '/zdkt',
      name: 'zdkt',
      component: zdkt
    }
    // {
    //   path: '*',
    //   redirect: '/'
    // }
  ]
})
