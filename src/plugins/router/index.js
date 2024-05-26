import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import Cookies from 'js-cookie'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
router.beforeEach(async (to, from, next) => {
  const loggedIn = Cookies.get('wataservices_token')
  if (to.matched.some((record) => record.meta.requiresAuth) && !loggedIn) {


    if (to.query.response) {
      next()

    } else {
      next('/signin')
    }
  } else {
    
    next()
  }
})
export default function (app) {
  app.use(router)
}
export { router }
