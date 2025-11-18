<template>
  <q-page class="q-pa-none">
    <div class="header-section text-white q-pa-md q-px-lg row items-center">
      <div class="text-h5">Gestão de Reservas</div>
      <q-space />
      <q-btn 
        label="+ Nova Reserva" 
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
        :rows="reservasStore.reservas" 
        :columns="columns"
        row-key="id"
        :loading="reservasStore.loading" 
        flat
        no-data-label="Nenhuma reserva encontrada."
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

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="getStatusColor(props.row.status)">
              {{ props.row.status }}
            </q-badge>
          </q-td>
        </template>
      </q-table>
    </div>
    
    <ReservaFormDialog 
      v-model="showModal" 
      :reserva="reservaToEdit" 
      @reserva-saved="handleReservaSaved"
    />

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useReservasStore } from 'stores/reservas'; 
import ReservaFormDialog from 'components/ReservaFormDialog.vue';

const $q = useQuasar();
const reservasStore = useReservasStore(); 

const showModal = ref(false); 
const reservaToEdit = ref({}); 

const columns = [
  { name: 'cliente', required: true, label: 'Cliente', align: 'left', field: 'cliente', sortable: true },
  { name: 'veiculo', label: 'Veículo', align: 'left', field: 'veiculo' },
  { name: 'dataInicio', label: 'Data Início', align: 'left', field: 'dataInicio' }, 
  { name: 'dataFim', label: 'Data Fim', align: 'left', field: 'dataFim' },
  { name: 'status', label: 'Status', align: 'center', field: 'status' },
  { name: 'acoes', label: 'Ações', align: 'center', field: 'acoes' }
];

// Lógica de cores para o badge de Status
function getStatusColor(status) {
  switch (status) {
    case 'Ativa': return 'blue';
    case 'Concluída': return 'green';
    case 'Cancelada': return 'red';
    default: return 'grey';
  }
}

// READ: Busca os dados ao montar o componente
onMounted(() => {
  reservasStore.fetchReservas();
});

// CREATE & UPDATE: Abre o modal
function openAddModal() {
  reservaToEdit.value = { id: null, cliente: null, veiculo: null, dataInicio: '', dataFim: '', status: 'Ativa' }; 
  showModal.value = true;
}

function openEditModal(reserva) {
  reservaToEdit.value = reserva; 
  showModal.value = true;
}

// FUNÇÃO CHAVE: Chamada quando o modal emite 'reserva-saved'
function handleReservaSaved() {
  reservasStore.fetchReservas(); 
}

// DELETE: Confirmação e chamada da ação de exclusão no Pinia
function confirmDelete(id) {
  $q.dialog({
    title: 'Confirmação',
    message: 'Tem certeza que deseja excluir esta reserva?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    reservasStore.deleteReserva(id); 
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