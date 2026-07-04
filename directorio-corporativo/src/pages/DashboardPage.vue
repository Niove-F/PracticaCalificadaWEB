<template>
  <q-page class="q-pa-md">
    <h2 class="text-h4 q-mb-md text-weight-bold">Dashboard Corporativo</h2>

    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else class="row q-col-gutter-md">
      <div class="col-12 col-sm-4">
        <q-card class="bg-primary text-white q-pa-sm">
          <q-card-section>
            <div class="text-subtitle2 text-uppercase">Total de Usuarios</div>
            <div class="text-h3 text-weight-bolder">{{ metrics.totalUsers }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card class="bg-teal text-white q-pa-sm">
          <q-card-section>
            <div class="text-subtitle2 text-uppercase">Cantidad de Hombres</div>
            <div class="text-h3 text-weight-bolder">{{ metrics.maleCount }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card class="bg-purple text-white q-pa-sm">
          <q-card-section>
            <div class="text-subtitle2 text-uppercase">Cantidad de Mujeres</div>
            <div class="text-h3 text-weight-bolder">{{ metrics.femaleCount }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card class="bg-orange-8 text-white q-pa-sm">
          <q-card-section>
            <div class="text-subtitle2 text-uppercase">Promedio de Edad</div>
            <div class="text-h3 text-weight-bolder">{{ metrics.avgAge }} años</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card class="bg-indigo text-white q-pa-sm">
          <q-card-section>
            <div class="text-subtitle2 text-uppercase">Empresas Distintas</div>
            <div class="text-h3 text-weight-bolder">{{ metrics.uniqueCompanies }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card class="bg-blue-grey-7 text-white q-pa-sm">
          <q-card-section>
            <div class="text-subtitle2 text-uppercase">Ciudades Distintas</div>
            <div class="text-h3 text-weight-bolder">{{ metrics.uniqueCities }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { userService } from 'src/services/api' // Importa el servicio que creaste

const loading = ref(true)
const metrics = reactive({
  totalUsers: 0,
  maleCount: 0,
  femaleCount: 0,
  avgAge: 0,
  uniqueCompanies: 0,
  uniqueCities: 0,
})

const calculateMetrics = (users) => {
  metrics.totalUsers = users.length

  let totalAge = 0
  const companiesSet = new Set()
  const citiesSet = new Set()

  users.forEach((user) => {
    // Conteo por género
    if (user.gender === 'male') metrics.maleCount++
    if (user.gender === 'female') metrics.femaleCount++

    // Promedio de edad
    totalAge += user.age

    // Estructuras Set para asegurar valores únicos
    if (user.company && user.company.name) {
      companiesSet.add(user.company.name)
    }
    if (user.address && user.address.city) {
      citiesSet.add(user.address.city)
    }
  })

  // Cálculos finales
  metrics.avgAge = metrics.totalUsers > 0 ? (totalAge / metrics.totalUsers).toFixed(1) : 0
  metrics.uniqueCompanies = companiesSet.size
  metrics.uniqueCities = citiesSet.size
}

onMounted(async () => {
  try {
    loading.value = true
    // Consumimos el endpoint general de usuarios sin paginar limit=0 para jalar todos
    const response = await userService.getDashboardUsers()
    const allUsers = response.data.users

    calculateMetrics(allUsers)
  } catch (error) {
    console.error('Error al calcular los indicadores del Dashboard:', error)
  } finally {
    loading.value = false
  }
})
</script>
