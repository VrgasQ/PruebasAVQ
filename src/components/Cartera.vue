"<template>
  <div class="typeform-container">
    <div class="background-overlay"></div>
    <div class="header">
      <div class="welcome-message">
        <img src="../assets/user.png" alt="User Icon" class="user-icon" />
        <span>Bienvenido, {{ firstName }} {{ lastName }}</span>
      </div>
      <button class="logout-button" @click="logout">CERRAR SESIÓN</button>
    </div>

    <div class="main-card">
      <h2 class="card-title">CREAR CARTERA</h2>
      <div class="form-section">
        <p>Razon Social Empresa: EcoMarket S.A.C.</p>
        <div class="form-group">
          <label>Número de Cartera:</label>
          <input type="text" v-model="formData.numeroCartera" maxlength="50" placeholder="Ingrese número de cartera" />
        </div>
        <div class="form-group">
          <label>Cuenta Corriente de Cargo/Abono:</label>
          <input type="text" v-model="formData.cuentaCorriente" maxlength="13" placeholder="Máximo 13 dígitos" />
        </div>
        <div class="form-group">
          <label>Fecha de Descuento:</label>
          <input type="date" v-model="formData.fechaDescuento" />
        </div>
<div class="form-group">
  <label>Días x Año:</label>
  <select v-model="formData.diasPorAnio">
    <option value="360">360 días</option>
    <option value="365">365 días</option>
  </select>
</div>
        <div class="form-group">
          <label>Comisión Activación:</label>
          <input type="text" v-model="formData.comisionActivacion" placeholder="Ingrese valor" />
          <select v-model="formData.comisionActivacionPeriodo">
            <option value="Inicio">Inicio</option>
            <option value="Fin">Fin</option>
          </select>
        </div>
        <div class="form-group">
          <label>Gastos Administrativos:</label>
          <input type="text" v-model="formData.gastosAdministrativos" placeholder="Ingrese valor" />
          <select v-model="formData.gastosAdministrativosPeriodo">
            <option value="Inicio">Inicio</option>
            <option value="Fin">Fin</option>
          </select>
        </div>
        <div class="form-group">
          <label>Portes:</label>
          <input type="text" v-model="formData.portes" placeholder="Ingrese valor" />
          <select v-model="formData.portesPeriodo">
            <option value="Inicio">Inicio</option>
            <option value="Fin">Fin</option>
          </select>
        </div>
        <div class="form-group">
          <label>Seguro:</label>
          <input type="text" v-model="formData.seguro" placeholder="Porcentaje (%)" />
          <select v-model="formData.seguroPeriodo">
            <option value="Inicio">Inicio</option>
            <option value="Fin">Fin</option>
          </select>
        </div>
        <div class="form-group">
          <label>Retención:</label>
          <input type="text" v-model="formData.retencion" placeholder="Porcentaje (%)" />
          <select v-model="formData.retencionPeriodo">
            <option value="Inicio">Inicio</option>
            <option value="Fin">Fin</option>
          </select>
        </div>
        <div class="form-group">
          <label>TEA Compensatoria:</label>
          <input type="text" v-model="formData.teaCompensatoria" placeholder="Porcentaje (%)" />
        </div>
        <div class="form-group">
          <label>Moneda:</label>
          <select v-model="formData.moneda">
            <option value="Soles">Soles</option>
            <option value="Dólares">Dólares</option>
          </select>
        </div>
      </div>
      <div class="buttons-section">
        <button class="action-button" @click="goBack">REGRESAR</button>
        <button class="action-button" @click="guardarCartera">CONTINUAR</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TypeForm',
  data() {
  return {
    formData: {
      numeroCartera: '',
      cuentaCorriente: '',
      fechaDescuento: '',
      diasPorAnio: '360', // Valor por defecto
      comisionActivacion: '',
      comisionActivacionPeriodo: 'Inicio',
      gastosAdministrativos: '',
      gastosAdministrativosPeriodo: 'Inicio',
      portes: '',
      portesPeriodo: 'Inicio',
      seguro: '',
      seguroPeriodo: 'Inicio',
      retencion: '',
      retencionPeriodo: 'Inicio',
      teaCompensatoria: '',
      moneda: 'Soles',
    },
  };
},
  methods: {
    async guardarCartera() {
      const userId = localStorage.getItem('userId'); // Obtén el ID del usuario desde el localStorage
      if (!userId) {
        alert('Usuario no identificado. Por favor, inicia sesión nuevamente.');
        this.$router.push('/');
        return;
      }

      try {
        // Obtén todas las carteras para calcular el próximo ID
        const response = await axios.get('http://localhost:3000/carteras');
        const newId = response.data.length + 1; // Calcula el nuevo ID como el siguiente número

        // Agrega el userId y el nuevo ID al objeto de la cartera
        const carteraData = {
          id: newId, // ID numérico incremental
          ...this.formData,
          userId,
        };

        // Realiza la solicitud POST para guardar la cartera
        await axios.post('http://localhost:3000/carteras', carteraData);
        alert('Cartera guardada correctamente.');

        // Redirige a /registrar-nueva-letra
        this.$router.push('/registrar-nueva-letra');
      } catch (error) {
        console.error('Error al guardar la cartera:', error);
        alert('Hubo un problema al guardar la cartera.');
      }
    },
    goBack() {
      this.$router.push('/home');
    },
    logout() {
      localStorage.removeItem('userId');
      this.$router.push('/');
    },
  },
};
</script>"


<style scoped>
/* Importación de la fuente */
@import url('https://fonts.googleapis.com/css2?family=Changa:wght@500&display=swap');

/* Estilos generales */

.typeform-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url('../assets/fondo-ini.jpg') no-repeat center center fixed;
  background-size: cover;
  position: relative;
}

.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  background-color: rgba(255, 243, 227, 0.9);
  position: fixed;
  top: 0;
  z-index: 10;
}

.welcome-message {
  display: flex;
  align-items: center;
  font-family: 'Changa', sans-serif;
  color: rgba(88, 39, 7, 1);
  font-size: 24px;
}

.user-icon {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.logout-button {
  background-color: rgba(49, 87, 44, 1);
  color: white;
  padding: 10px 15px;
  font-family: 'Changa', sans-serif;
  cursor: pointer;
  font-size: 18px;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 0;
}

.main-card {
  background-color: rgba(255, 243, 227, 0.8);
  margin: -40px auto 20px auto;
  padding: 20px;
  border-radius: 10px;
  z-index: 5;
  width: 900px;
  min-height: 450px;
}

.card-title {
  font-family: 'Changa', sans-serif;
  font-size: 26px;
  color: rgba(88, 39, 7, 1);
  margin-bottom: 20px;
  text-align: center;
  text-decoration: underline;
}

.form-section {
  font-family: 'Changa', sans-serif;
  color: rgba(88, 39, 7, 1);
  font-size: 18px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
  font-family: 'Changa', sans-serif;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-family: 'Changa', sans-serif;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-family: 'Changa', sans-serif;
}

.buttons-section {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.action-button {
  background-color: rgba(49, 87, 44, 1);
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-family: 'Changa', sans-serif;
  font-size: 16px;
  cursor: pointer;
  width: 180px;
  text-align: center;
}

.dual-input {
  display: flex;
  gap: 10px;
}

.dual-input input {
  width: 50%;
}

.form-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.form-group label {
  flex: 1;
  margin-right: 10px;
}

.form-group input {
  flex: 2;
  margin-right: 10px;
}

.form-group select {
  flex: 1;
}
</style>
