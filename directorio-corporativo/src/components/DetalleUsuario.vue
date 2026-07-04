<template>
  <q-dialog v-model="isOpen" transition-show="scale" transition-hide="scale">
    <q-card style="width: 900px; max-width: 90vw">
      <q-card-section class="bg-indigo-9 text-white row items-center q-pb-none">
        <div class="text-h6">
          <q-icon name="badge" class="q-mr-sm" size="sm" />
          Perfil del Colaborador
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <div v-if="loading" class="flex flex-center q-pa-xl">
        <q-spinner-dots color="indigo-9" size="50px" />
      </div>

      <div v-else-if="userData">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey-8"
          active-color="indigo-9"
          indicator-color="indigo-9"
          align="justify"
          narrow-indicator
        >
          <q-tab name="perfil" icon="person" label="Información General (P3)" />
          <q-tab name="compras" icon="shopping_cart" label="Compras (P4)" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="perfil">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4 text-center">
                <q-avatar size="150px" class="shadow-3 q-mb-md">
                  <img :src="userData.image" />
                </q-avatar>
                <div class="text-h6">{{ userData.firstName }} {{ userData.lastName }}</div>
                <div class="text-subtitle2 text-grey-7">{{ userData.company?.title }}</div>
              </div>

              <div class="col-12 col-md-8">
                <q-list bordered class="rounded-borders">
                  <q-expansion-item
                    group="perfil"
                    icon="contact_mail"
                    label="Datos Personales"
                    default-opened
                  >
                    <q-card
                      ><q-card-section>
                        <p><strong>Email:</strong> {{ userData.email }}</p>
                        <p><strong>Teléfono:</strong> {{ userData.phone }}</p>
                        <p>
                          <strong>Edad:</strong> {{ userData.age }} años | <strong>Género:</strong>
                          {{ userData.gender }}
                        </p>
                      </q-card-section></q-card
                    >
                  </q-expansion-item>

                  <q-expansion-item group="perfil" icon="work" label="Información Laboral">
                    <q-card
                      ><q-card-section>
                        <p><strong>Empresa:</strong> {{ userData.company?.name }}</p>
                        <p><strong>Departamento:</strong> {{ userData.company?.department }}</p>
                        <p>
                          <strong>Dirección:</strong> {{ userData.company?.address?.address }},
                          {{ userData.company?.address?.city }}
                        </p>
                      </q-card-section></q-card
                    >
                  </q-expansion-item>

                  <q-expansion-item
                    group="perfil"
                    icon="account_balance"
                    label="Universidad y Banco"
                  >
                    <q-card>
                      <q-card-section>
                        <p><strong>Universidad:</strong> {{ userData.university }}</p>
                        <p>
                          <strong>Tarjeta (Termina en):</strong> **** **** ****
                          {{ userData.bank?.cardNumber.slice(-4) }}
                        </p>
                        <p><strong>Moneda:</strong> {{ userData.bank?.currency }}</p>
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>

                  <q-expansion-item group="perfil" icon="accessibility" label="Información Física">
                    <q-card>
                      <q-card-section>
                        <p><strong>Altura:</strong> {{ userData.height }} cm</p>
                        <p><strong>Peso:</strong> {{ userData.weight }} kg</p>
                        <p><strong>Grupo Sanguíneo:</strong> {{ userData.bloodGroup }}</p>
                        <p><strong>Color de Ojos:</strong> {{ userData.eyeColor }}</p>
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>

                  <q-expansion-item group="perfil" icon="currency_bitcoin" label="Criptomonedas">
                    <q-card>
                      <q-card-section>
                        <p><strong>Moneda:</strong> {{ userData.crypto?.coin }}</p>
                        <p><strong>Billetera:</strong> {{ userData.crypto?.wallet }}</p>
                        <p><strong>Red:</strong> {{ userData.crypto?.network }}</p>
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                </q-list>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="compras">
            <div v-if="userCarts.length === 0" class="text-center text-grey-7 q-pa-md">
              <q-icon name="remove_shopping_cart" size="48px" />
              <p>Este colaborador no tiene carritos de compra registrados.</p>
            </div>

            <div v-else v-for="cart in userCarts" :key="cart.id" class="q-mb-md">
              <q-card bordered flat>
                <q-card-section class="bg-grey-2">
                  <div class="text-subtitle2 font-weight-bold">Carrito #{{ cart.id }}</div>
                </q-card-section>
                <q-markup-table flat dense>
                  <thead>
                    <tr class="bg-grey-1">
                      <th class="text-left">Producto</th>
                      <th class="text-center">Precio Unit.</th>
                      <th class="text-center">Cantidad</th>
                      <th class="text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in cart.products" :key="item.id">
                      <td class="text-left">{{ item.title }}</td>
                      <td class="text-center">${{ item.price.toFixed(2) }}</td>
                      <td class="text-center">{{ item.quantity }}</td>
                      <td class="text-right">${{ item.total.toFixed(2) }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
                <q-card-section class="text-right bg-indigo-1">
                  <div class="text-subtitle1 text-weight-bold">
                    Total General: ${{ cart.total.toFixed(2) }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const isOpen = ref(false)
const loading = ref(false)
const tab = ref('perfil')

const userData = ref(null)
const userCarts = ref([])

const abrirDetalle = async (id) => {
  isOpen.value = true
  loading.value = true
  tab.value = 'perfil'
  userData.value = null
  userCarts.value = []

  try {
    const [resUser, resCarts] = await Promise.all([
      axios.get(`https://dummyjson.com/users/${id}`),
      axios.get(`https://dummyjson.com/users/${id}/carts`),
    ])

    userData.value = resUser.data
    userCarts.value = resCarts.data.carts
  } catch (error) {
    console.error('Error obteniendo detalles del usuario:', error)
  } finally {
    loading.value = false
  }
}

defineExpose({ abrirDetalle })
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}
</style>
