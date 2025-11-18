<template>
  <q-page class="q-pa-none">
    <div class="header-section text-white q-pa-md q-px-lg row items-center">
      <div class="text-h5">Gestão de Veículos</div>
      <q-space />
      <q-btn 
        label="+ Novo Veículo" 
        color="white" 
        text-color="blue-8" 
        icon="add" 
        unelevated 
        class="q-px-md"
        @click="openAddModal" 
      />
    </div>

    <div class="q-pa-lg">
      <q-table
        :rows="veiculosStore.veiculos" 
        :columns="columns"
        row-key="id"
        :loading="veiculosStore.loading" 
        flat
        no-data-label="Nenhum veículo encontrado."
        :rows-per-page-options="[15]" 
        :pagination="{ rowsPerPage: 15 }" 
      >
        <template v-slot:body-cell-acoes="props">
          <q-td :props="props">
            <q-btn 
              icon="edit" 
              size="sm" 
              flat 
              dense 
              color="grey-7" 
              class="q-mr-sm" 
              @click="openEditModal(props.row)"
            />
            
            <q-btn 
              icon="delete" 
              size="sm" 
              flat 
              dense 
              color="red" 
              @click="confirmDelete(props.row.id)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-disponibilidade="props">
          <q-td :props="props">
            <q-badge :color="getDisponibilidadeColor(props.row.disponibilidade)">
              {{ props.row.disponibilidade }}
            </q-badge>
          </q-td>
        </template>
      </q-table>
    </div>
    
    <VeiculoFormDialog 
      v-model="showModal" 
      :veiculo="veiculoToEdit" 
      @veiculo-saved="handleVeiculoSaved"
    />

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useVeiculosStore } from 'stores/veiculos'; 
import VeiculoFormDialog from 'components/VeiculoFormDialog.vue';

const $q = useQuasar();
const veiculosStore = useVeiculosStore(); 

const showModal = ref(false); 
const veiculoToEdit = ref({}); 

const columns = [
  { name: 'placa', required: true, label: 'Placa', align: 'left', field: 'placa', sortable: true },
  { name: 'marca', label: 'Marca', align: 'left', field: 'marca' },
  { name: 'modelo', label: 'Modelo', align: 'left', field: 'modelo' },
  { name: 'disponibilidade', label: 'Disponibilidade', align: 'center', field: 'disponibilidade' }, 
  { name: 'acoes', label: 'Ações', align: 'center', field: 'acoes' }
];

// Lógica de cores para o badge de Disponibilidade
function getDisponibilidadeColor(status) {
  switch (status) {
    case 'Disponível': return 'green';
    case 'Indisponível': return 'red';
    case 'Em Manutenção': return 'orange';
    case 'Em Movimento': return 'blue';
    default: return 'grey';
  }
}

// READ: Busca os dados ao montar o componente
onMounted(() => {
  veiculosStore.fetchVeiculos();
});

// CREATE & UPDATE: Abre o modal
function openAddModal() {
  veiculoToEdit.value = { id: null, placa: '', marca: '', modelo: '', categoria: null, quilometragem: 0, disponibilidade: 'Disponível' }; 
  showModal.value = true;
}

function openEditModal(veiculo) {
  veiculoToEdit.value = veiculo; 
  showModal.value = true;
}

// FUNÇÃO CHAVE: Chamada quando o modal emite 'veiculo-saved'
function handleVeiculoSaved() {
  veiculosStore.fetchVeiculos(); 
}

// DELETE: Confirmação e chamada da ação de exclusão no Pinia
function confirmDelete(id) {
  $q.dialog({
    title: 'Confirmação',
    message: 'Tem certeza que deseja excluir este veículo?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    veiculosStore.deleteVeiculo(id); 
  });
}
</script>

<style lang="scss" scoped>
.header-section {
  background-color: #7990ff; 
  min-height: 80px; 
  box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12);
}
.q-table {
  thead {
    th {
      font-weight: bold;
      font-size: 16px;
    }
  }
  tbody {
    tr {
      td {
        font-weight: 500;
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
  }
}
</style>