<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="width: 500px; max-width: 80vw;">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ isEditing ? 'Editar Cliente' : 'Novo Cliente' }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="validateAndSave" ref="formRef">
          <q-input 
            v-model="clienteData.nome" 
            label="Nome" 
            outlined 
            dense 
            class="q-mb-md" 
            :rules="[val => !!val || 'Nome é obrigatório']"
          />
          <q-input 
            v-model="clienteData.cpf" 
            label="CPF" 
            outlined 
            dense 
            class="q-mb-md"
          />
          <q-input 
            v-model="clienteData.telefone" 
            label="Telefone" 
            outlined 
            dense 
            class="q-mb-md"
          />
          <q-input 
            v-model="clienteData.email" 
            label="E-mail" 
            outlined 
            dense 
            type="email" 
            class="q-mb-md" 
            :rules="[val => !!val || 'Email é obrigatório']"
          />

          <q-card-actions align="right" class="q-mt-md">
            <q-btn label="Cancelar" color="grey" flat @click="$emit('update:modelValue', false)" />
            <q-btn label="Salvar" color="primary" type="submit" :loading="loading" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar'; // Importado

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  cliente: {
    type: Object,
    default: () => ({ id: null, nome: '', cpf: '', telefone: '', email: '' })
  }
});

const emit = defineEmits(['update:modelValue', 'clienteSaved']);

// CORRIGIDO: Chamada do useQuasar() para usar $q.notify
const $q = useQuasar(); 

const loading = ref(false);
const clienteData = ref({});
const formRef = ref(null);

const isEditing = computed(() => !!clienteData.value.id);

watch(() => props.cliente, (newCliente) => {
  clienteData.value = JSON.parse(JSON.stringify(newCliente));
}, { immediate: true });

async function validateAndSave() {
  // Valida o formulário antes de tentar salvar
  const isValid = await formRef.value.validate();
  if (isValid) {
    saveCliente();
  } else {
    $q.notify({
        type: 'warning',
        message: 'Por favor, preencha todos os campos obrigatórios.'
    });
  }
}

async function saveCliente() {
  loading.value = true;
  try {
    let response;
    
    // Payload com os dados limpos para evitar enviar propriedades desnecessárias
    const payload = {
      nome: clienteData.value.nome,
      cpf: clienteData.value.cpf,
      telefone: clienteData.value.telefone,
      email: clienteData.value.email,
    };
    
    if (isEditing.value) {
      // MODO EDIÇÃO (PUT)
      response = await api.put(`clientes/${clienteData.value.id}`, payload);
    } else {
      // MODO CRIAÇÃO (POST)
      response = await api.post('clientes', payload);
    }

    $q.notify({
      type: 'positive',
      message: `Cliente ${isEditing.value ? 'editado' : 'adicionado'} com sucesso!`,
      timeout: 1500
    });
    
    emit('update:modelValue', false);
    emit('clienteSaved', response.data);

  } catch (error) {
    console.error('Erro ao salvar cliente:', error);
    // Notificação de erro mais robusta
    $q.notify({
      type: 'negative',
      message: `Erro ao salvar cliente. Verifique o JSON Server ou a conexão. Detalhes: ${error.message}`
    });
  } finally {
    loading.value = false;
  }
}
</script>