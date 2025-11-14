<template>
  <q-page class="q-pa-none">
    <div class="header-section text-white q-pa-md q-px-lg row items-center">
      <div class="text-h5">Gestão de Clientes</div>
      <q-space />
      <q-btn 
        label="+ Novo Cliente" 
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
        :rows="clientesStore.clientes" 
        :columns="columns"
        row-key="id"
        :loading="clientesStore.loading" 
        flat
        no-data-label="Nenhum cliente encontrado."
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
      </q-table>
    </div>
    
    <ClienteFormDialog 
      v-model="showModal" 
      :cliente="clienteToEdit" 
      @cliente-saved="handleClienteSaved"
    />

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar'; // CORRIGIDO: useQuasar deve ser importado
import { useClientesStore } from 'stores/clientes'; // Import da Store Pinia
import ClienteFormDialog from 'components/ClienteFormDialog.vue';

// Injeção correta do Quasar
const $q = useQuasar(); 
// Inicialização e uso da Store Pinia
const clientesStore = useClientesStore(); 

const showModal = ref(false); 
const clienteToEdit = ref({}); 

const columns = [
  { name: 'nome', required: true, label: 'Nome', align: 'left', field: 'nome', sortable: true },
  { name: 'cpf', label: 'CPF', align: 'left', field: 'cpf' },
  { name: 'telefone', label: 'Telefone', align: 'left', field: 'telefone' },
  { name: 'email', label: 'E-mail', align: 'left', field: 'email' },
  { name: 'acoes', label: 'Ações', align: 'center', field: 'acoes' }
];

// READ: Busca os dados ao montar o componente
onMounted(() => {
  clientesStore.fetchClientes();
});

// CREATE & UPDATE: Abre o modal para adicionar ou editar
function openAddModal() {
  clienteToEdit.value = { id: null, nome: '', cpf: '', telefone: '', email: '' }; 
  showModal.value = true;
}

function openEditModal(cliente) {
  clienteToEdit.value = cliente; 
  showModal.value = true;
}

// FUNÇÃO CHAVE: Chamada quando o modal emite 'cliente-saved'
function handleClienteSaved() {
  // Chama a ação do Pinia para recarregar a lista
  clientesStore.fetchClientes(); 
}

// DELETE: Confirmação e chamada da ação de exclusão no Pinia
function confirmDelete(id) {
  $q.dialog({
    title: 'Confirmação',
    message: 'Tem certeza que deseja excluir este cliente?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    // Chama a ação de exclusão da Store Pinia
    clientesStore.deleteCliente(id); 
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