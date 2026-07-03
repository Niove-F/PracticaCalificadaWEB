import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com' // [cite: 4]
});

export const userService = {
  // Pregunta 1: Listado paginado
  getAllUsers(limit = 10, skip = 0) {
    return api.get(`/users?limit=${limit}&skip=${skip}`); // [cite: 8]
  },
  
  // Pregunta 5: Obtener TODOS los usuarios para el Dashboard
  // DummyJSON por defecto trae 30 usuarios -> limit=0 para traer todos de golpe al frontend.
  getDashboardUsers() {
    return api.get('/users?limit=0'); // [cite: 26, 29]
  },

  // Pregunta 2: Buscador
  searchUsers(query) {
    return api.get(`/users/search?q=${query}`); // [cite: 13]
  },

  // Pregunta 3 y 8: Detalle y Comparación
  getUserById(id) {
    return api.get(`/users/${id}`); // [cite: 17, 37]
  },

  // Pregunta 4: Carrito de compras
  getUserCarts(id) {
    return api.get(`/users/${id}/carts`); // [cite: 22]
  }
};