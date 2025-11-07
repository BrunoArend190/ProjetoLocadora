const routes = [
  {
    path: '/',
    redirect: '/login' // Redireciona para a tela de login ao iniciar o app
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue')
  },
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // Rota principal (Dashboard)
      { path: '', name: 'Dashboard', component: () => import('pages/IndexPage.vue') },

      // Rotas de Gestão
      { path: 'clientes', name: 'Clientes', component: () => import('pages/ClientesPage.vue') },
      { path: 'veiculos', name: 'Veiculos', component: () => import('pages/VeiculosPage.vue') },
      { path: 'reservas', name: 'Reservas', component: () => import('pages/ReservasPage.vue') },
      { path: 'categorias', name: 'Categorias', component: () => import('pages/CategoriasPage.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
