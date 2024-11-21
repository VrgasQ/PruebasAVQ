import axios from 'axios';

const API_URL = 'http://localhost:3000/planillas';

export default {
  // Obtener planillas de un usuario específico
  async obtenerPlanillasDeUsuario(userId) {
    try {
      const response = await axios.get(`${API_URL}?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener las planillas del usuario:", error);
      throw error;
    }
  },

  // Crear una nueva planilla con un ID secuencial
  async crearPlanilla(planilla) {
    try {
      // Obtener todas las planillas del usuario para calcular el ID secuencial
      const planillasDeUsuario = await this.obtenerPlanillasDeUsuario(planilla.userId);

      // Determinar el nuevo ID como el mayor ID + 1 o 1 si no hay planillas previas
      const nuevoId = planillasDeUsuario.length > 0 
        ? Math.max(...planillasDeUsuario.map(p => p.id || 0)) + 1 
        : 1;

      // Crear la nueva planilla con el ID y el userId correctos
      const nuevaPlanilla = { ...planilla, id: nuevoId, userId: planilla.userId };

      // Enviar la nueva planilla al servidor
      const response = await axios.post(API_URL, nuevaPlanilla);
      return response.data;
    } catch (error) {
      console.error("Error al crear la planilla:", error);
      throw error;
    }
  }
};
