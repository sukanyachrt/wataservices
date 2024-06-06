import { createRouter, createWebHistory } from 'vue-router'
import { useAccountStore } from '@/plugins/store'
import { routes } from './routes'
import Cookies from 'js-cookie'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
router.beforeEach(async (to, from, next) => {
  const loggedIn = Cookies.get('wataservices_token')
  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    if (to.query.response) {
      next()
    } else {
      next('/signin')
    }
  } else {
    if (to.meta.roles && !checkUserRoles(to.meta.roles)) {
      next('/Notpermission?status=Not Found&msg=' + `ท่านไม่มีสิทธิ์ในการเข้าถึงหน้านี้ค่ะ`)
    } else {
      next()
    }
  }
})
export default function (app) {
  app.use(router)
}
export { router }
function checkUserRoles(requiredRoles) {
  const store = useAccountStore()
  let dataUser = store.decryptData(store.dataUser)
  const queustions_update = requiredRoles.filter(item => item === dataUser.userRole)
  if (queustions_update.length > 0) {
    return true
  } else {
    return false
  }
}
