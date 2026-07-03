<template>
  <q-page class="q-pa-md">
    <q-card class="q-mb-md q-pa-md bg-grey-1">
      <div class="text-subtitle1 q-mb-sm font-weight-bold">Filtros Avanzados</div>
      <div class="row q-col-gutter-sm fila-filtro">
        <div class="col-12 col-sm-6 col-md-2 genero-filtro">
          <q-select
            v-model="filters.gender"
            :options="genderOptions"
            label="Género"
            dense
            outlined
            clearable
            emit-value
            map-options
          />
        </div>

        <div class="col-12 col-sm-6 col-md-3 empresa-filtro">
          <q-select
            v-model="filters.company"
            :options="companyOptions"
            label="Empresa"
            dense
            outlined
            clearable
            use-input
            input-debounce="0"
          />
        </div>

        <div class="col-12 col-sm-6 col-md-2 ciudad-filtro">
          <q-select
            v-model="filters.city"
            :options="cityOptions"
            label="Ciudad"
            dense
            outlined
            clearable
            use-input
            input-debounce="0"
          />
        </div>

        <div class="col-12 col-sm-6 col-md-2 pais-filtro">
          <q-select
            v-model="filters.country"
            :options="countryOptions"
            label="País"
            dense
            outlined
            clearable
            use-input
            input-debounce="0"
          />
        </div>

        <div class="col-12 col-sm-6 col-md-3 edad-rango-filtro">
          <div class="text-caption text-grey-10">
            Edad: {{ filters.ageRange.min }} - {{ filters.ageRange.max }} años
          </div>
          <q-range v-model="filters.ageRange" :min="15" :max="90" label color="primary" />
        </div>
      </div>

      <div class="row justify-start q-mt-sm">
        <q-btn label="Limpiar Filtros" color="negative" flat dense @click="resetFilters" />
      </div>
    </q-card>

    <div v-if="loading" class="row justify-center q-my-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <q-table
      v-else
      title="Usuarios Registrados"
      :rows="filteredUsers"
      :columns="columns"
      row-key="id"
      :pagination="{ rowsPerPage: 10 }"
      dense
    />
  </q-page>
</template>

<style>
.fila-filtro {
  display: flex;
  flex-direction: row;
  gap: 16px;
}
.genero-filtro,
.empresa-filtro,
.ciudad-filtro,
.pais-filtro,
.edad-rango-filtro {
  flex: 1;
}
.edad-rango-filtro {
  width: 150px;
}
</style>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])
const loading = ref(true)

const filters = reactive({
  gender: null,
  company: null,
  city: null,
  country: null,
  ageRange: { min: 15, max: 90 },
})

const columns = [
  {
    name: 'name',
    label: 'Nombre',
    field: (row) => `${row.firstName} ${row.lastName}`,
    align: 'left',
    sortable: true,
  },
  { name: 'gender', label: 'Género', field: 'gender', align: 'center' },
  { name: 'age', label: 'Edad', field: 'age', align: 'center', sortable: true },
  {
    name: 'company',
    label: 'Empresa',
    field: (row) => row.company?.name || 'N/A',
    align: 'left',
    sortable: true,
  },
  { name: 'city', label: 'Ciudad', field: (row) => row.address?.city || 'N/A', align: 'left' },
  { name: 'country', label: 'País', field: (row) => row.address?.country || 'N/A', align: 'left' },
]

const genderOptions = [
  { label: 'Masculino', value: 'male' },
  { label: 'Femenino', value: 'female' },
]

onMounted(async () => {
  try {
    // Lista de usuarios completo
    const response = await axios.get('https://dummyjson.com/users?limit=0')
    users.value = response.data.users
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
  } finally {
    loading.value = false
  }
})

// DROPDOWNS
const companyOptions = computed(() => {
  const companies = users.value.map((u) => u.company?.name).filter(Boolean)
  return [...new Set(companies)].sort()
})

const cityOptions = computed(() => {
  const cities = users.value.map((u) => u.address?.city).filter(Boolean)
  return [...new Set(cities)].sort()
})

const countryOptions = computed(() => {
  const countries = users.value.map((u) => u.address?.country).filter(Boolean)
  return [...new Set(countries)].sort()
})

// FILTRADO
const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    // Genero
    if (filters.gender && user.gender !== filters.gender) return false

    // Edad
    if (user.age < filters.ageRange.min || user.age > filters.ageRange.max) return false

    // Empresa
    if (filters.company && user.company?.name !== filters.company) return false

    // Ciudad
    if (filters.city && user.address?.city !== filters.city) return false

    // Pais
    if (filters.country && user.address?.country !== filters.country) return false

    return true
  })
})

// Reset
const resetFilters = () => {
  filters.gender = null
  filters.company = null
  filters.city = null
  filters.country = null
  filters.ageRange = { min: 15, max: 90 }
}
</script>
