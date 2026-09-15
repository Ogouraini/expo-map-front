import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import '../public/assets/main.css'

async function enableMocking() {
  if (!import.meta.env.DEV) return

  const { worker } = await import('./mocks/browser')

  await worker.start({
    serviceWorker: { 
      url: '/mockServiceWorker.js' 
    },
    // Mode 'bypass' global : MSW intercepte uniquement ce qui est défini dans handlers.js
    // Tout le reste (assets, Vite, HMR, HTML) passe directement au serveur.
    onUnhandledRequest: 'bypass',
  })
}

enableMocking().then(() => {
  const app = createApp(App)
  app.use(createPinia())
  app.mount('#app')
})