/*import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: 'https://api.example.com' })

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
*/

import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Cria uma instância do Axios com a URL base do seu JSON Server
const api = axios.create({ baseURL: 'http://localhost:3000/' })

export default boot(({ app }) => {
  // Injeta o axios (a biblioteca padrão) no contexto global do Vue
  app.config.globalProperties.$axios = axios

  // Injeta a nossa instância 'api' configurada (para usar this.$api no Options API)
  // Esta é a instância que aponta para o JSON Server
  app.config.globalProperties.$api = api
})

// Exporta a instância 'api' para uso no Composition API (como você fez no ClientesPage.vue)
export { api }