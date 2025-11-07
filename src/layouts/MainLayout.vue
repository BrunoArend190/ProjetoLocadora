<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer
      show-if-above
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      :width="200"
      :breakpoint="500"
      class="bg-dark-blue"
    >
      <q-scroll-area class="fit">
        <div class="q-py-md text-white text-center">
          <div class="text-h6">ArendLocadora</div>
          <q-separator dark class="q-my-sm" />
        </div>

        <q-list padding dark>
          <EssentialLink
            v-for="link in essentialLinks"
            :key="link.title"
            v-bind="link"
            :to="link.link"
          />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';

// Definição dos links de navegação para o menu lateral
const essentialLinks = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    link: '/dashboard',
  },
  {
    title: 'Clientes',
    icon: 'people',
    link: '/dashboard/clientes',
  },
  {
    title: 'Veículos',
    icon: 'directions_car',
    link: '/dashboard/veiculos',
  },
  {
    title: 'Reservas',
    icon: 'event_available',
    link: '/dashboard/reservas',
  },
  {
    title: 'Categorias',
    icon: 'category',
    link: '/dashboard/categorias',
  },
];

const miniState = ref(true); // Começa "mini" e expande no hover
</script>

<style lang="scss">
.bg-dark-blue {
  background: #2f3651 !important; // Cor de fundo do menu lateral
  color: white;
}
.q-drawer {
    .q-item {
        color: rgba(255, 255, 255, 0.7);
        border-left: 5px solid transparent;

        &.q-router-link--active {
            color: #fff;
            background: rgba(255, 255, 255, 0.1);
            border-left-color: #5887ff; // Cor de destaque do item ativo
        }
    }
}
</style>