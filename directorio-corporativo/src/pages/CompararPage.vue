<template>
  <q-page class="q-pa-md">
    <h2 class="text-h4 q-mb-md text-weight-bold">Comparador de Colaboradores</h2>
    <p class="text-subtitle2 text-grey-7">
      Seleccione dos colaboradores del directorio para contrastar sus perfiles.
    </p>

    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-sm-6">
        <q-select
          v-model="selectedUser1"
          :options="userOptions"
          label="Seleccionar Colaborador 1"
          outlined
          emit-value
          map-options
          option-value="id"
          option-label="fullName"
          :loading="loadingUsers"
          @update:model-value="fetchUserDetail(1, $event)"
        >
          <template v-slot:prepend>
            <q-icon name="person" color="primary" />
          </template>
        </q-select>
      </div>

      <div class="col-12 col-sm-6">
        <q-select
          v-model="selectedUser2"
          :options="userOptions"
          label="Seleccionar Colaborador 2"
          outlined
          emit-value
          map-options
          option-value="id"
          option-label="fullName"
          :loading="loadingUsers"
          @update:model-value="fetchUserDetail(2, $event)"
        >
          <template v-slot:prepend>
            <q-icon name="person" color="teal" />
          </template>
        </q-select>
      </div>
    </div>

    <div v-if="loadingDetails" class="flex flex-center q-pa-xl">
      <q-spinner-cube color="indigo" size="40px" />
    </div>

    <div
      v-else-if="userDetail1 && userDetail2"
      class="q-markup-table-container shadow-2 rounded-borders"
    >
      <q-markup-table flat bordered class="comparison-table">
        <thead>
          <tr class="bg-indigo-9 text-white">
            <th class="text-left text-weight-bold text-subtitle1 text-uppercase">Característica</th>
            <th class="text-center text-weight-bold text-subtitle1">
              {{ userDetail1.firstName }} {{ userDetail1.lastName }}
            </th>
            <th class="text-center text-weight-bold text-subtitle1">
              {{ userDetail2.firstName }} {{ userDetail2.lastName }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in comparisonRows" :key="row.key">
            <td class="text-left text-weight-medium bg-grey-1">{{ row.label }}</td>
            <td class="text-center">{{ row.val1 }}</td>
            <td class="text-center">{{ row.val2 }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>

    <div v-else class="flex flex-center q-pa-xl text-grey-5 text-center">
      <div>
        <q-icon name="swap_horiz" size="64px" />
        <div class="text-h6 q-mt-md">
          Debe seleccionar ambos colaboradores para generar el contraste
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { userService } from 'src/services/api'

// Estados de carga
const loadingUsers = ref(false)
const loadingDetails = ref(false)

// Listado para los Selects
const userOptions = ref([])

// IDs Seleccionados
const selectedUser1 = ref(null)
const selectedUser2 = ref(null)

// Detalles completos de la API
const userDetail1 = ref(null)
const userDetail2 = ref(null)

// Carga inicial de la lista para rellenar los componentes q-select
onMounted(async () => {
  try {
    loadingUsers.value = true
    const response = await userService.getDashboardUsers() // limit=0 para jalar todos
    userOptions.value = response.data.users.map((user) => ({
      id: user.id,
      fullName: `${user.firstName} ${user.lastName} (${user.company?.title || 'Sin Cargo'})`,
    }))
  } catch (error) {
    console.error('Error al cargar la lista de colaboradores:', error)
  } finally {
    loadingUsers.value = false
  }
})

// Obtener detalles extendidos al cambiar un selector usando /users/{id}
const fetchUserDetail = async (slot, id) => {
  if (!id) {
    if (slot === 1) userDetail1.value = null
    if (slot === 2) userDetail2.value = null
    return
  }

  try {
    loadingDetails.value = true
    const response = await userService.getUserById(id)

    if (slot === 1) userDetail1.value = response.data
    if (slot === 2) userDetail2.value = response.data
  } catch (error) {
    console.error(`Error al obtener detalle del colaborador ${slot}:`, error)
  } finally {
    loadingDetails.value = false
  }
}

// Mapeo reactivo de las 11 características requeridas por Recursos Humanos
const comparisonRows = computed(() => {
  if (!userDetail1.value || !userDetail2.value) return []

  const u1 = userDetail1.value
  const u2 = userDetail2.value

  return [
    {
      key: 'name',
      label: 'Nombre Completo',
      val1: `${u1.firstName} ${u1.lastName}`,
      val2: `${u2.firstName} ${u2.lastName}`,
    },
    { key: 'age', label: 'Edad', val1: `${u1.age} años`, val2: `${u2.age} años` },
    {
      key: 'gender',
      label: 'Género',
      val1: u1.gender === 'male' ? 'Masculino' : 'Femenino',
      val2: u2.gender === 'male' ? 'Masculino' : 'Femenino',
    },
    {
      key: 'company',
      label: 'Empresa',
      val1: u1.company?.name || 'N/A',
      val2: u2.company?.name || 'N/A',
    },
    {
      key: 'title',
      label: 'Cargo',
      val1: u1.company?.title || 'N/A',
      val2: u2.company?.title || 'N/A',
    },
    {
      key: 'university',
      label: 'Universidad',
      val1: u1.university || 'N/A',
      val2: u2.university || 'N/A',
    },
    {
      key: 'city',
      label: 'Ciudad',
      val1: u1.address?.city || 'N/A',
      val2: u2.address?.city || 'N/A',
    },
    {
      key: 'country',
      label: 'País',
      val1: u1.address?.country || 'N/A',
      val2: u2.address?.country || 'N/A',
    },
    { key: 'height', label: 'Altura', val1: `${u1.height} cm`, val2: `${u2.height} cm` },
    { key: 'weight', label: 'Peso', val1: `${u1.weight} kg`, val2: `${u2.weight} kg` },
    {
      key: 'bloodGroup',
      label: 'Grupo Sanguíneo',
      val1: u1.bloodGroup || 'N/A',
      val2: u2.bloodGroup || 'N/A',
    },
  ]
})
</script>

<style scoped>
.comparison-table {
  background-color: white;
}

/* Forzar bordes limpios y un aspecto corporativo */
.comparison-table th {
  font-size: 14px;
}

.comparison-table td {
  font-size: 14px;
  height: 48px;
}

/* Efecto hover sutil en las filas */
.comparison-table tbody tr:hover {
  background-color: #f5f5f5;
}
</style>
