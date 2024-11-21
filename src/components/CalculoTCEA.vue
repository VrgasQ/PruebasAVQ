<template>
  <div class="form-container">
    <div class="background-overlay"></div>
    <div class="header">
      <div class="welcome-message">
        <img src="../assets/user.png" alt="User Icon" class="user-icon" />
        <span>Bienvenido, {{ firstName }} {{ lastName }}</span>
      </div>
      <button class="logout-button" @click="logout">CERRAR SESIÓN</button>
    </div>

    <div class="main-card">
      <h2 class="card-title">CÁLCULO DE LA TCEA</h2>
      <div class="form-section">
        <div class="form-group">
          <label for="numeroLetra">Nº Letra:</label>
          <select v-model="formData.numeroLetra" @change="onLetraSelect" required>
            <option value="" disabled selected>Seleccione una letra</option>
            <option v-for="letra in letras" :key="letra.id" :value="letra.numeroLetra">
              {{ letra.numeroLetra }}
            </option>
          </select>
        </div>
      </div>
      <button class="action-button" @click="calculateTCEA">CALCULAR TCEA</button>
      <div class="result-group">
        <label>Resultado TCEA:</label>
        <div class="result-box">{{ tceaResult || 'X.X %' }}</div>
      </div>
      <div class="buttons-section">
        <button class="action-button" @click="goBack">REGRESAR</button>
        <button class="action-button" @click="viewReport">VER REPORTE</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'CalculoTCEA',
  data() {
    return {
      firstName: '',
      lastName: '',
      formData: {
        numeroLetra: ''
      },
      letras: [],
      tceaResult: ''
    };
  },
  mounted() {
    this.firstName = localStorage.getItem('firstName') || 'Usuario';
    this.lastName = localStorage.getItem('lastName') || '';

    axios.get('http://localhost:3000/letras')
        .then(response => {
          console.log('Datos de letras:', response.data);
          this.letras = response.data;
        })
        .catch(error => {
          console.error('Error al obtener letras:', error);
        });
  },
  methods: {
    goBack() {
      this.$router.push('/home');
    },
    viewReport() {
      this.$router.push('/reporte');
    },
    onLetraSelect() {
      console.log('Letra seleccionada:', this.formData.numeroLetra);
    },
    calculateTCEA() {
      alert('Implementación pendiente para calcular TCEA');
    },
    logout() {
      localStorage.removeItem('firstName');
      localStorage.removeItem('lastName');
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.form-container {
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
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 5;
  width: 700px;
  min-height: 500px;
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
  display: flex;
  flex-direction: column;
  color: rgba(88, 39, 7, 1);
  gap: 15px;
  width: 100%;
}

.form-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.form-group label {
  flex-basis: 30%;
  text-align: right;
}

.form-group input,
.form-group select {
  flex-grow: 1;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
  color: rgba(88, 39, 7, 1);
  max-width: 200px;
}

.result-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
  color: rgba(88, 39, 7, 1);
}

.result-box {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
  width: 100px;
  color: rgba(88, 39, 7, 1);
}

.buttons-section {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
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

.action-button {
  margin-top: 15px;
}

.form-group select {
  color: #000; /* Asegúrate de que el texto sea visible */
  background-color: #fff; /* Fondo blanco para el select */
}
</style>
