<template>
  <div class="login-page row no-wrap">
    <!-- Lado esquerdo -->
    <div class="col-6 flex flex-center bg-primary text-white column">
      <img
        src="src/assets/logo.png"
        alt="Logo"
        class="logo"
      />
      <div class="text-h6 q-mt-md">Arend Locadora</div>
    </div>

    <!-- Lado direito -->
    <div class="col-6 flex flex-center bg-white">
      <q-card class="q-pa-xl shadow-2" style="width: 360px; border-radius: 12px">
        <div class="text-h5 text-center q-mb-lg text-dark">Login</div>

        <q-input
          v-model="email"
          label="Email"
          outlined
          dense
          class="q-mb-md"
        />
        <q-input
          v-model="password"
          label="Password"
          type="password"
          outlined
          dense
          class="q-mb-sm"
        />

        <div class="row items-center q-mb-md">
          <q-checkbox v-model="rememberMe" label="Remember me" dense />
        </div>

        <q-btn
          label="Entrar"
          color="primary"
          class="full-width q-mb-sm"
          @click="login"
        />

        <div class="text-center">
          <a href="#" class="text-grey-7 text-caption">Esqueceu sua Senha?</a>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const router = useRouter()

function login() {
  if (!email.value || !password.value) {
    alert('Preencha todos os campos!')
    return
  }

  // Simulação de login bem-sucedido
  router.push('/dashboard')
}
</script>

<style lang="scss" scoped>
.login-page {
  height: 100vh;

  .bg-primary {
    background-color: #2f3651; // azul escuro
  }

  .logo {
    width: 180px;
  }

  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
