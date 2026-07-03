<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-indigo-9 text-white">
      <q-toolbar class="q-py-sm">
        <q-btn 
          flat 
          dense 
          round 
          icon="menu" 
          aria-label="Menu" 
          @click="toggleLeftDrawer" 
          class="q-mr-sm"
        />

        <q-avatar size="40px" class="q-mr-md">
          <q-icon name="vitals" size="32px" class="text-amber-5" />
        </q-avatar>

        <q-toolbar-title class="text-weight-bold">
          Directorio Corporativo
          <div class="text-caption text-indigo-2 text-weight-regular">
            Sistema Interno de Gestión
          </div>
        </q-toolbar-title>

        <q-space />

        <div class="row items-center q-gutter-sm">
          <q-chip icon="school" color="indigo-7" text-color="white" dense class="q-px-md">
            Desan University
          </q-chip>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer 
      v-model="leftDrawerOpen" 
      show-if-above 
      bordered 
      :width="260"
      class="bg-grey-1"
    >
      <q-list padding class="text-grey-8">
        <q-item-label header class="text-weight-bold text-uppercase text-indigo-9 q-xs-pt-md">
          Módulos del Sistema
        </q-item-label>

        <q-item 
          clickable 
          v-ripple 
          to="/" 
          exact
          active-class="menu-item-active"
          class="q-ma-sm rounded-borders"
        >
          <q-item-section avatar>
            <q-icon name="badge" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">Colaboradores</q-item-label>
            <q-item-label caption>Búsqueda y consulta</q-item-label>
          </q-item-section>
        </q-item>

        <q-item 
          clickable 
          v-ripple 
          to="/comparar" 
          exact
          active-class="menu-item-active"
          class="q-ma-sm rounded-borders"
        >
          <q-item-section avatar>
            <q-icon name="compare_arrows" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">Comparador</q-item-label>
            <q-item-label caption>Contraste de perfiles para RRHH</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <q-item-label header class="text-weight-bold text-uppercase text-grey-6">
          Equipo de Desarrollo
        </q-item-label>
        
        <div class="q-px-md text-caption text-grey-6">
          Evaluación Grupal PC02
        </div>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
/* Estilos personalizados para mejorar el aspecto visual del menú lateral */
.rounded-borders {
  border-radius: 8px;
}

.menu-item-active {
  color: #1a237e !important; /* indigo-10 */
  background-color: #e8eaf6 !important; /* indigo-1 */
  font-weight: bold;
}

.menu-item-active .q-icon {
  color: #3f51b5 !important; /* indigo */
}
</style>