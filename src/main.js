import { createApp } from 'vue'
import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


// Styles
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
// Create vue app
const app = createApp(App)


// Register plugins
registerPlugins(app)
app.use(pinia)
// Mount vue app
app.mount('#app')
