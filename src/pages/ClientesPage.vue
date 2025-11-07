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
        :rows="clientes"
        :columns="columns"
        row-key="id"
        :loading="loading"
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
              @click="deleteCliente(props.row.id)" 
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
import { api } from 'boot/axios'; 
import { useQuasar } from 'quasar';
import ClienteFormDialog from 'components/ClienteFormDialog.vue';

const $q = useQuasar();
const clientes = ref([]);
const loading = ref(true);

const showModal = ref(false); 
const clienteToEdit = ref({}); 

const columns = [
  { name: 'nome', required: true, label: 'Nome', align: 'left', field: 'nome', sortable: true },
  { name: 'cpf', label: 'CPF', align: 'left', field: 'cpf' },
  { name: 'telefone', label: 'Telefone', align: 'left', field: 'telefone' },
  { name: 'email', label: 'E-mail', align: 'left', field: 'email' },
  { name: 'acoes', label: 'Ações', align: 'center', field: 'acoes' }
];

// READ: Busca e Atualização dos dados
async function fetchClientes() {
  try {
    loading.value = true;
    const response = await api.get('clientes'); 
    clientes.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    $q.notify({
        type: 'negative',
        message: 'Erro ao carregar dados. Verifique se o JSON Server está rodando.'
    });
  } finally {
    loading.value = false;
  }
}

// DELETE: Excluir um cliente
function deleteCliente(id) {
  $q.dialog({
    title: 'Confirmação',
    message: 'Tem certeza que deseja excluir este cliente?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`clientes/${id}`);
      
      //  Remove o cliente da lista local
      clientes.value = clientes.value.filter(c => c.id !== id);
      
      $q.notify({
        type: 'positive',
        message: 'Cliente excluído com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      $q.notify({
        type: 'negative',
        message: 'Erro ao excluir cliente. Tente novamente.'
      });
    }
  });
}

// CREATE: Abre o modal para adicionar novo cliente
function openAddModal() {
  clienteToEdit.value = { id: null, nome: '', cpf: '', telefone: '', email: '' }; 
  showModal.value = true;
}

// UPDATE: Abre o modal para editar cliente existente
function openEditModal(cliente) {
  clienteToEdit.value = cliente; 
  showModal.value = true;
}

// FUNÇÃO CHAVE: Chamada quando o modal emite 'cliente-saved' para recarregar a lista
function handleClienteSaved() {
  fetchClientes(); 
}

// Hook de inicialização
onMounted(() => {
  fetchClientes();
});
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