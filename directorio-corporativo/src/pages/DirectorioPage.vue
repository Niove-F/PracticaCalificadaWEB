<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h2 class="text-h4 q-my-none text-weight-bold text-indigo-9">Directorio Corporativo</h2>
        <p class="text-subtitle2 text-grey-7 q-mb-none">Gestiona, busca y filtra la información de los colaboradores en tiempo real.</p>
      </div>
    </div>

    <q-card class="q-mb-md q-pa-md bg-grey-1" flat bordered>
      <div class="text-subtitle2 q-mb-md font-weight-bold text-grey-8">Filtros y Búsqueda</div>
      
      <div class="row q-col-gutter-sm">
        <div class="col-12 col-md-3">
          <q-input
            v-model="searchQuery"
            placeholder="Buscar por nombre o apellido..."
            dense
            outlined
            bg-color="white"
            clearable
          >
            <template v-slot:append>
              <q-icon name="search" color="indigo-9" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-sm-6 col-md-2">
          <q-select 
            v-model="filters.gender" 
            :options="genderOptions" 
            label="Género" 
            dense 
            outlined 
            clearable 
            emit-value 
            map-options 
            bg-color="white"
          />
        </div>
        
        <div class="col-12 col-sm-6 col-md-2">
          <q-select 
            v-model="filters.company" 
            :options="displayCompanies" 
            label="Empresa" 
            dense 
            outlined 
            clearable 
            use-input 
            input-debounce="0"
            bg-color="white"
            @filter="filterCompanyFn"
          />
        </div>
        
        <div class="col-12 col-sm-6 col-md-2">
          <q-select 
            v-model="filters.city" 
            :options="displayCities" 
            label="Ciudad" 
            dense 
            outlined 
            clearable 
            use-input 
            input-debounce="0"
            bg-color="white"
            @filter="filterCityFn"
          />
        </div>
        
        <div class="col-12 col-sm-6 col-md-3">
          <q-select 
            v-model="filters.country" 
            :options="displayCountries" 
            label="País" 
            dense 
            outlined 
            clearable 
            use-input 
            input-debounce="0"
            bg-color="white"
            @filter="filterCountryFn"
          />
        </div>

        <div class="col-12 q-mt-sm">
          <div class="text-caption text-grey-10 text-weight-medium">Rango de Edad: {{ filters.ageRange.min }} - {{ filters.ageRange.max }} años</div>
          <q-range v-model="filters.ageRange" :min="15" :max="90" label color="indigo-9" class="q-mt-xs" />
        </div>
      </div>

      <div class="row justify-start q-mt-md">
        <q-btn label="Limpiar Filtros" color="negative" flat dense @click="resetFilters" icon="restart_alt" />
      </div>
    </q-card>

    <q-table
      title="Colaboradores Registrados"
      :rows="filteredUsers"
      :columns="columns"
      row-key="id"
      :pagination="{ rowsPerPage: 10 }"
      :loading="loading"
      dense
      flat
      bordered
      class="bg-white shadow-1 rounded-borders"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="indigo-9">
          <q-spinner-dots size="50px" color="indigo-9" />
        </q-inner-loading>
      </template>

      <template v-slot:no-data>
        <div class="full-width row flex-center text-grey-7 q-gutter-sm q-pa-lg">
          <q-icon size="2em" name="sentiment_dissatisfied" />
          <span class="text-subtitle1 text-weight-medium">
            No se encontraron colaboradores que coincidan con los criterios establecidos.
          </span>
        </div>
      </template>

      <template v-slot:body-cell-avatar="props">
        <q-td :props="props" class="text-center">
          <q-avatar size="40px" class="bg-grey-2 shadow-1">
            <img :src="props.value" alt="Foto" />
          </q-avatar>
        </q-td>
      </template>

      <template v-slot:body-cell-gender="props">
        <q-td :props="props">
          <q-chip
            :color="props.value === 'male' ? 'blue-1' : 'pink-1'"
            :text-color="props.value === 'male' ? 'blue-9' : 'pink-9'"
            dense
            class="text-weight-medium text-capitalize"
          >
            {{ props.value === 'male' ? 'Masculino' : 'Femenino' }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props" class="text-center">
          <q-btn
            icon="visibility"
            color="indigo-9"
            flat
            round
            dense
            @click="verDetalleUsuario(props.row)"
          >
            <q-tooltip class="bg-indigo-9">Visualizar perfil completo</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])
const loading = ref(true)
const usuarioSeleccionado = ref(null)

const searchQuery = ref('')
const searchCompany = ref('')
const searchCity = ref('')
const searchCountry = ref('')

const filters = reactive({
  gender: null,
  company: null,
  city: null,
  country: null,
  ageRange: { min: 15, max: 90 }
})

const columns = [
  { name: 'avatar', label: 'Fotografía', field: 'image', align: 'center' },
  { name: 'fullName', label: 'Nombre Completo', field: row => `${row.firstName} ${row.lastName}`, align: 'left', sortable: true },
  { name: 'age', label: 'Edad', field: 'age', align: 'center', sortable: true },
  { name: 'gender', label: 'Género', field: 'gender', align: 'center', sortable: true },
  { name: 'email', label: 'Correo Electrónico', field: 'email', align: 'left', sortable: true },
  { name: 'company', label: 'Empresa', field: row => row.company?.name || 'N/A', align: 'left', sortable: true },
  { name: 'title', label: 'Cargo', field: row => row.company?.title || 'N/A', align: 'left', sortable: true },
  { name: 'city', label: 'Ciudad', field: row => row.address?.city || 'N/A', align: 'left' },
  { name: 'country', label: 'País', field: row => row.address?.country || 'N/A', align: 'left' },
  { name: 'action', label: 'Acción', field: 'action', align: 'center' }
]

const genderOptions = [
  { label: 'Masculino', value: 'male' },
  { label: 'Femenino', value: 'female' }
]

onMounted(async () => {
  try {
    loading.value = true
    const response = await axios.get('https://dummyjson.com/users?limit=0')
    users.value = response.data.users
  } catch (error) {
    console.error('Error al obtener el universo de usuarios:', error)
  } finally {
    loading.value = false
  }
})

const companyOptions = computed(() => {
  const companies = users.value.map(u => u.company?.name).filter(Boolean)
  return [...new Set(companies)].sort()
})

const cityOptions = computed(() => {
  const cities = users.value.map(u => u.address?.city).filter(Boolean)
  return [...new Set(cities)].sort()
})

const countryOptions = computed(() => {
  const countries = users.value.map(u => u.address?.country).filter(Boolean)
  return [...new Set(countries)].sort()
})

function filterCompanyFn (val, update) {
  update(() => { searchCompany.value = val.toLowerCase() })
}
function filterCityFn (val, update) {
  update(() => { searchCity.value = val.toLowerCase() })
}
function filterCountryFn (val, update) {
  update(() => { searchCountry.value = val.toLowerCase() })
}

const displayCompanies = computed(() => {
  return companyOptions.value.filter(v => v.toLowerCase().includes(searchCompany.value))
})
const displayCities = computed(() => {
  return cityOptions.value.filter(v => v.toLowerCase().includes(searchCity.value))
})
const displayCountries = computed(() => {
  return countryOptions.value.filter(v => v.toLowerCase().includes(searchCountry.value))
})

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    if (searchQuery.value && searchQuery.value.trim() !== '') {
      const query = searchQuery.value.toLowerCase()
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
      if (!fullName.includes(query)) return false
    }

    if (filters.gender && user.gender !== filters.gender) return false
    if (user.age < filters.ageRange.min || user.age > filters.ageRange.max) return false
    if (filters.company && user.company?.name !== filters.company) return false
    if (filters.city && user.address?.city !== filters.city) return false
    if (filters.country && user.address?.country !== filters.country) return false

    return true
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  filters.gender = null
  filters.company = null
  filters.city = null
  filters.country = null
  filters.ageRange = { min: 15, max: 90 }
}

const verDetalleUsuario = (user) => {
  usuarioSeleccionado.value = user
  alert(`Visualizando a: ${user.firstName} ${user.lastName}`)
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}
</style>