<template>
  <q-page class="q-pa-lg">
    <div class="row q-col-gutter-lg">
      
      <div class="col-12">
        <div class="row q-col-gutter-lg">
          
          <div class="col-lg-7 col-md-12 col-sm-12">
            <q-card flat bordered class="q-pa-md">
              <div class="text-h6 q-mb-md">Receita Mensal</div>
              
              <div style="height: 300px; width: 100%;">
                <LinhaChart v-if="dashboardStore.receita.data.length > 0" :chartData="dashboardStore.receita" style="width: 100%; height: 100%;" />
                <q-skeleton type="rect" height="300px" v-else-if="dashboardStore.loading" />
              </div>
              
            </q-card>
          </div>

          <div class="col-lg-5 col-md-12 col-sm-12">
            <q-card flat bordered class="q-pa-md">
              <div class="text-subtitle1 text-orange-8 q-mb-md row items-center">
                <q-icon name="warning" class="q-mr-sm" /> Alertas de Manutenção
              </div>
              <q-table
                :rows="dashboardStore.veiculosAlertas"
                :columns="alertaColumns"
                row-key="placa"
                :loading="dashboardStore.loading"
                hide-bottom
                flat
                dense
              >
                <template v-slot:body-cell-alerta="props">
                  <q-td :props="props">
                    <q-btn 
                      :label="props.row.alerta === 'OK' ? 'OK' : props.row.alerta"
                      :color="props.row.alertaColor"
                      size="sm"
                      unelevated
                    />
                  </q-td>
                </template>
              </q-table>
            </q-card>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="row q-col-gutter-lg">
          
          <div class="col-lg-5 col-md-12 col-sm-12">
            <q-card 
              flat 
              bordered 
              class="q-pa-md" 
              style="height: 400px;"
            >
              <div class="text-subtitle1 q-mb-md">Status Veículos (Total: {{ dashboardStore.statusVeiculos.total }})</div>
              
              <div v-if="dashboardStore.statusVeiculos.data.length > 0" class="row items-center q-mt-xl">
                <div class="col-7 flex flex-center" style="height: 200px;">
                    <PizzaChart :chartData="dashboardStore.statusVeiculos" style="width: 100%; height: 100%;" />
                </div>
                <div class="col-5">
                  <div v-for="item in dashboardStore.statusVeiculos.data" :key="item.label" class="q-mb-sm">
                    <q-badge :color="item.color" rounded class="q-mr-sm" />
                    <span class="text-weight-bold">{{ item.value }}%</span> {{ item.label }}
                  </div>
                </div>
              </div>
            </q-card>
          </div>

          <div class="col-lg-7 col-md-12 col-sm-12">
            <q-card flat bordered class="q-pa-md">
              <div class="text-subtitle1 q-mb-md">Performance de Reserva por Categoria</div>
              
              <div v-if="dashboardStore.performanceReservas.length > 0" style="height: 300px; padding-top: 10px;">
                <BarChart :chartData="dashboardStore.performanceReservas" style="width: 100%; height: 100%;" />
              </div>
              
            </q-card>
          </div>

        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue';
import { useDashboardStore } from 'stores/dashboard';
import LinhaChart from 'components/LinhaChart.vue'; 
import PizzaChart from 'components/PizzaChart.vue'; 
import BarChart from 'components/BarChart.vue'; 

const dashboardStore = useDashboardStore();

const alertaColumns = [
  { name: 'veiculo', label: 'Veículo', align: 'left', field: 'veiculo' },
  { name: 'placa', label: 'Placa', align: 'left', field: 'placa' },
  { name: 'quilometragem', label: 'Quilometragem', align: 'left', field: 'quilometragem' },
  { name: 'alerta', label: 'Alerta', align: 'center', field: 'alerta' },
];

onMounted(() => {
  dashboardStore.fetchDashboardData();
});
</script>

<style lang="scss" scoped>
</style>