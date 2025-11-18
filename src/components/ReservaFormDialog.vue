<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="width: 500px; max-width: 80vw;">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ isEditing ? 'Editar Reserva' : 'Nova Reserva' }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="validateAndSave" ref="formRef">
          
          <q-select
            v-model="reservaData.cliente"
            :options="clienteOptions"
            label="Cliente"
            outlined
            dense
            class="q-mb-md"
            :rules="[val => !!val || 'Cliente é obrigatório']"
          />

          <q-select
            v-model="reservaData.veiculo"
            :options="veiculoOptions"
            label="Veículo (Placa)"
            outlined
            dense
            class="q-mb-md"
            :rules="[val => !!val || 'Veículo é obrigatório']"
          />
          
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6">
              <q-input 
                v-model="reservaData.dataInicio" 
                label="Data Início" 
                outlined 
                dense 
                type="date"
                :rules="[val => !!val || 'Data é obrigatória']"
              />
            </div>
            
            <div class="col-6">
              <q-input 
                v-model="reservaData.dataFim" 
                label="Data Fim" 
                outlined 
                dense 
                type="date"
                :rules="[val => !!val || 'Data é obrigatória']"
              />
            </div>
          </div>

          <q-select
            v-model="reservaData.status"
            :options="['Ativa', 'Concluída', 'Cancelada']"
            label="Status"
            outlined
            dense
            class="q-mb-md"
            :readonly="!isEditing"
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
import reservaService from 'src/services/reservaService';
import { useClientesStore } from 'src/stores/clientes'; 
import { useVeiculosStore } from 'src/stores/veiculos'; // Importa Store de Veículos

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  reserva: { 
    type: Object,
    default: () => ({ id: null, cliente: null, veiculo: null, dataInicio: '', dataFim: '', status: 'Ativa' }) 
  }
});

const emit = defineEmits(['update:modelValue', 'reservaSaved']);

const clientesStore = useClientesStore(); // Instância da Store de Clientes
const veiculosStore = useVeiculosStore(); // Instância da Store de Veículos

const loading = ref(false);
const reservaData = ref({});
const formRef = ref(null);
const originalStatus = ref('Ativa'); // Para controle de mudança de status

const isEditing = computed(() => !!reservaData.value.id);

const clienteOptions = computed(() => 
  clientesStore.clientes.map(c => c.nome)
);

// Mapeia veículos disponíveis na criação. Na edição, inclui o veículo atual.
const veiculoOptions = computed(() => {
    // 1. Filtra apenas veículos 'Disponível'
    let options = veiculosStore.veiculos.filter(v => v.disponibilidade === 'Disponível');
    
    // 2. Se estiver editando, garante que o veículo atualmente reservado apareça no seletor
    if (isEditing.value && reservaData.value.veiculo) {
        const currentVeiculo = veiculosStore.veiculos.find(
            v => `${v.modelo} (${v.placa})` === reservaData.value.veiculo
        );
        // Adiciona o veículo atual no início da lista se ele não estiver "Disponível"
        if (currentVeiculo && currentVeiculo.disponibilidade !== 'Disponível' && !options.some(v => v.id === currentVeiculo.id)) {
             options.unshift(currentVeiculo);
        }
    }

    // 3. Mapeia para o formato de string
    return options.map(v => `${v.modelo} (${v.placa})`);
});

watch(() => props.reserva, (newReserva) => {
  reservaData.value = JSON.parse(JSON.stringify(newReserva));
  originalStatus.value = newReserva.status; // Captura o status original ao abrir
}, { immediate: true });

onMounted(() => {
    if (clientesStore.clientes.length === 0) clientesStore.fetchClientes();
    if (veiculosStore.veiculos.length === 0) veiculosStore.fetchVeiculos();
});

// Helper para encontrar o ID do veículo a partir do nome formatado (Modelo (Placa))
function getVeiculoIdFromDisplay(displayString) {
    if (!displayString) return null;
    
    // Extrai a placa (texto dentro dos últimos parênteses)
    const match = displayString.match(/\(([^)]+)\)$/); 
    const placa = match ? match[1] : null;
    
    if (placa) {
        const veiculo = veiculosStore.veiculos.find(v => v.placa === placa);
        return veiculo ? veiculo.id : null;
    }
    return null;
}

async function validateAndSave() {
  // Força o status 'Ativa' na criação
  if (!isEditing.value) {
    reservaData.value.status = 'Ativa';
  }
    
  const isValid = await formRef.value.validate();
  if (isValid) {
    saveReserva();
  } else {
    Notify.create({ type: 'warning', message: 'Preencha os campos obrigatórios.' });
  }
}

async function saveReserva() {
  loading.value = true;
  let veiculoId = null;
  let newStatus = reservaData.value.status;

  try {
    // 1. Encontrar o ID do Veículo
    veiculoId = getVeiculoIdFromDisplay(reservaData.value.veiculo);
    if (!veiculoId) {
        throw new Error("Não foi possível identificar o veículo. Selecione-o novamente.");
    }
    
    // 2. Montar payload e salvar a Reserva
    const payload = {
      cliente: reservaData.value.cliente,
      veiculo: reservaData.value.veiculo,
      dataInicio: reservaData.value.dataInicio,
      dataFim: reservaData.value.dataFim,
      status: newStatus,
    };
    
    if (isEditing.value) {
      await reservaService.update(reservaData.value.id, payload);
    } else {
      await reservaService.create(payload);
    }

    // 3. Lógica de Atualização do Status do Veículo
    if (veiculoId) {
        // A) CRIAÇÃO: Reserva nova -> Veículo INDISPONÍVEL
        if (!isEditing.value) {
            await veiculosStore.updateVeiculoStatus(veiculoId, 'Indisponível');
        }
        
        // B) EDIÇÃO: Lógica de Devolução/Cancelamento:
        else {
            // Se o status mudou para 'Concluída' ou 'Cancelada' a partir de 'Ativa', muda para DISPONÍVEL
            const mustBecomeAvailable = (originalStatus.value === 'Ativa') && 
                                       (newStatus === 'Concluída' || newStatus === 'Cancelada');
            
            // Se o status mudou para 'Ativa' a partir de outro status, muda para INDISPONÍVEL
            const mustBecomeUnavailable = (originalStatus.value !== 'Ativa') && 
                                          (newStatus === 'Ativa');

            if (mustBecomeAvailable) {
                await veiculosStore.updateVeiculoStatus(veiculoId, 'Disponível');
            } else if (mustBecomeUnavailable) {
                await veiculosStore.updateVeiculoStatus(veiculoId, 'Indisponível');
            }
        }
    }
    
    Notify.create({ 
      type: 'positive',
      message: `Reserva ${isEditing.value ? 'editada' : 'adicionada'} com sucesso!`,
      timeout: 1500
    });
    
    emit('update:modelValue', false); 
    emit('reservaSaved');
    
  } catch (error) {
    console.error('Erro ao salvar reserva:', error);
    Notify.create({ type: 'negative', message: `Erro ao salvar reserva: ${error.message}` });
  } finally {
    loading.value = false;
  }
}
</script>