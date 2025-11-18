<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="width: 500px; max-width: 80vw;">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ isEditing ? 'Editar Veículo' : 'Novo Veículo' }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="validateAndSave" ref="formRef">
          <q-input 
            v-model="veiculoData.placa" 
            label="Placa" 
            outlined 
            dense 
            class="q-mb-md" 
            :rules="[val => !!val || 'Placa é obrigatória']"
          />
          <q-input 
            v-model="veiculoData.marca" 
            label="Marca" 
            outlined 
            dense 
            class="q-mb-md"
          />
          <q-input 
            v-model="veiculoData.modelo" 
            label="Modelo" 
            outlined 
            dense 
            class="q-mb-md"
          />

          <q-select
            v-model="veiculoData.categoria"
            :options="categoriaOptions"
            label="Categoria"
            outlined
            dense
            class="q-mb-md"
            :rules="[val => !!val || 'Categoria é obrigatória']"
          />

          <q-input 
            v-model.number="veiculoData.quilometragem" 
            label="Quilometragem (KM)" 
            outlined 
            dense 
            type="number" 
            class="q-mb-md"
          />

          <q-select
            v-model="veiculoData.disponibilidade"
            :options="['Disponível', 'Indisponível', 'Em Movimento', 'Em Manutenção']"
            label="Disponibilidade"
            outlined
            dense
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
import { ref, watch, computed, onMounted } from 'vue';
import { Notify } from 'quasar';
import { useCategoriasVeiculosStore } from 'src/stores/categoriasVeiculos';
import veiculoService from 'src/services/veiculoService'; // Importa o Service Layer

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  veiculo: { 
    type: Object,
    default: () => ({ id: null, placa: '', marca: '', modelo: '', categoria: null, quilometragem: 0, disponibilidade: 'Disponível' }) 
  }
});

const emit = defineEmits(['update:modelValue', 'veiculoSaved']);
const categoriasStore = useCategoriasVeiculosStore();

const loading = ref(false);
const veiculoData = ref({});
const formRef = ref(null);

const isEditing = computed(() => !!veiculoData.value.id);

const categoriaOptions = computed(() => 
  categoriasStore.categorias.map(c => c.nome)
);

watch(() => props.veiculo, (newVeiculo) => {
  veiculoData.value = JSON.parse(JSON.stringify(newVeiculo));
}, { immediate: true });

onMounted(() => {
    if (categoriasStore.categorias.length === 0) {
        categoriasStore.fetchCategorias();
    }
});

async function validateAndSave() {
  const isValid = await formRef.value.validate();
  if (isValid) {
    saveVeiculo();
  } else {
    Notify.create({ type: 'warning', message: 'Preencha os campos obrigatórios.' });
  }
}

async function saveVeiculo() {
  loading.value = true;
  try {
    const payload = {
      placa: veiculoData.value.placa,
      marca: veiculoData.value.marca,
      modelo: veiculoData.value.modelo,
      categoria: veiculoData.value.categoria,
      quilometragem: veiculoData.value.quilometragem,
      disponibilidade: veiculoData.value.disponibilidade,
    };
    
    if (isEditing.value) {
      // Chama o SERVICE para UPDATE
      await veiculoService.update(veiculoData.value.id, payload);
    } else {
      // Chama o SERVICE para CREATE
      await veiculoService.create(payload);
    }

    Notify.create({ 
      type: 'positive',
      message: `Veículo ${isEditing.value ? 'editado' : 'adicionado'} com sucesso!`,
      timeout: 1500
    });
    
    emit('update:modelValue', false); 
    emit('veiculoSaved');
  } catch (error) {
    console.error('Erro ao salvar veículo (Service Layer):', error);
    Notify.create({ type: 'negative', message: `Erro ao salvar veículo.` });
  } finally {
    loading.value = false;
  }
}
</script>