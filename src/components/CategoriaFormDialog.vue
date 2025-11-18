<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="width: 500px; max-width: 80vw;">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ isEditing ? 'Editar Categoria' : 'Nova Categoria' }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="validateAndSave" ref="formRef">
          <q-input 
            v-model="categoriaData.nome" 
            label="Nome da Categoria" 
            outlined 
            dense 
            class="q-mb-md" 
            :rules="[val => !!val || 'Nome é obrigatório']"
          />
          <q-input 
            v-model="categoriaData.descricao" 
            label="Descrição" 
            outlined 
            dense 
            type="textarea"
            rows="2"
            class="q-mb-md"
          />
          <q-input 
            v-model="categoriaData.valorDiaria" 
            label="Valor Diária (R$)" 
            outlined 
            dense 
            type="number" 
            step="0.01"
            class="q-mb-md" 
            :rules="[val => val > 0 || 'Valor deve ser maior que zero']"
          />
          <q-input 
            v-model="categoriaData.disponiveis" 
            label="Veículos Disponíveis" 
            outlined 
            dense 
            type="number" 
            class="q-mb-md"
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
import { Notify } from 'quasar';
import categoriaService from 'src/services/categoriaService'; // Importa o Service Layer

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  categoria: { 
    type: Object,
    default: () => ({ id: null, nome: '', descricao: '', valorDiaria: 0, disponiveis: 0 }) 
  }
});

const emit = defineEmits(['update:modelValue', 'categoriaSaved']);

const loading = ref(false);
const categoriaData = ref({});
const formRef = ref(null);

const isEditing = computed(() => !!categoriaData.value.id);

watch(() => props.categoria, (newCat) => {
  categoriaData.value = JSON.parse(JSON.stringify(newCat));
}, { immediate: true });

async function validateAndSave() {
  const isValid = await formRef.value.validate();
  if (isValid) {
    saveCategoria();
  } else {
    Notify.create({ type: 'warning', message: 'Preencha os campos obrigatórios.' });
  }
}

async function saveCategoria() {
  loading.value = true;
  try {
    const payload = {
      nome: categoriaData.value.nome,
      descricao: categoriaData.value.descricao,
      valorDiaria: parseFloat(categoriaData.value.valorDiaria),
      disponiveis: parseInt(categoriaData.value.disponiveis),
    };
    
    if (isEditing.value) {
      // Chama o SERVICE para UPDATE
      await categoriaService.update(categoriaData.value.id, payload);
    } else {
      // Chama o SERVICE para CREATE
      await categoriaService.create(payload);
    }

    Notify.create({ 
      type: 'positive',
      message: `Categoria ${isEditing.value ? 'editada' : 'adicionada'} com sucesso!`,
      timeout: 1500
    });
    
    emit('update:modelValue', false); 
    emit('categoriaSaved');
  } catch (error) {
    console.error('Erro ao salvar categoria (Service Layer):', error);
    Notify.create({ type: 'negative', message: `Erro ao salvar categoria.` });
  } finally {
    loading.value = false;
  }
}
</script>