<template>
  <q-page class="q-pa-none">
    <div class="header-section text-white q-pa-md q-px-lg row items-center">
      <div class="text-h5">Categorias de Veículos</div>
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
        :rows="categoriasStore.categorias" 
        :columns="columns"
        row-key="id"
        :loading="categoriasStore.loading" 
        flat
        no-data-label="Nenhuma categoria encontrada."
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

        <template v-slot:body-cell-valorDiariaFormatado="props">
          <q-td :props="props">
            {{ props.row.valorDiariaFormatado }}
          </q-td>
        </template>
      </q-table>
    </div>
    
    <CategoriaFormDialog 
      v-model="showModal" 
      :categoria="categoriaToEdit" 
      @categoria-saved="handleCategoriaSaved"
    />

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useCategoriasVeiculosStore } from 'stores/categoriasVeiculos'; 
import CategoriaFormDialog from 'components/CategoriaFormDialog.vue';

const $q = useQuasar();
const categoriasStore = useCategoriasVeiculosStore(); 

const showModal = ref(false); 
const categoriaToEdit = ref({}); 

const columns = [
  { name: 'nome', required: true, label: 'Categoria', align: 'left', field: 'nome', sortable: true },
  { name: 'descricao', label: 'Veículo', align: 'left', field: 'descricao' },
  { name: 'valorDiariaFormatado', label: 'Valor Diária', align: 'left', field: 'valorDiariaFormatado' }, 
  { name: 'disponiveis', label: 'Veículos Disponíveis', align: 'center', field: 'disponiveis' },
  { name: 'acoes', label: 'Ações', align: 'center', field: 'acoes' }
];

// READ: Busca os dados ao montar o componente
onMounted(() => {
  categoriasStore.fetchCategorias();
});

// CREATE & UPDATE: Abre o modal
function openAddModal() {
  categoriaToEdit.value = { id: null, nome: '', descricao: '', valorDiaria: 0, disponiveis: 0 }; 
  showModal.value = true;
}

function openEditModal(categoria) {
  categoriaToEdit.value = categoria; 
  showModal.value = true;
}

// FUNÇÃO CHAVE: Chamada quando o modal emite 'categoria-saved'
function handleCategoriaSaved() {
  categoriasStore.fetchCategorias(); 
}

// DELETE: Confirmação e chamada da ação de exclusão no Pinia
function confirmDelete(id) {
  $q.dialog({
    title: 'Confirmação',
    message: 'Tem certeza que deseja excluir esta categoria?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    categoriasStore.deleteCategoria(id); 
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