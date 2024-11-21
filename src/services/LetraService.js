// src/services/LetraService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/letras';

export default {
  async agregarLetra(letra) {
    try {
      // Primero, obtenemos todas las letras para encontrar el último `id`
      const response = await axios.get(API_URL);
      const letras = response.data;

      // Encuentra el último `id` y calcula el nuevo `id`
      const ultimoId = letras.length > 0 ? Math.max(...letras.map(l => l.id || 0)) : 0;
      const nuevoId = ultimoId + 1;

      // Crea una nueva letra con el `id` incremental
      const nuevaLetra = { ...letra, id: nuevoId };

      // Enviar la nueva letra al servidor
      const resultado = await axios.post(API_URL, nuevaLetra);
      return resultado.data;
    } catch (error) {
      console.error("Error al agregar la letra:", error);
      throw error;
    }
  }
};
