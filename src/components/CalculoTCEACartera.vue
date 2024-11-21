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
      <h2 class="card-title">CÁLCULO TCEA CARTERA</h2>
      <div class="form-section">
        <div class="form-group">
          <label for="numeroInstrumentos">Número de Intr.:</label>
          <input type="number" v-model="formData.numeroInstrumentos" min="1" step="1" placeholder="Ingrese el número" required />
        </div>
        <div class="form-group">
          <label for="totalRecibir">Total a Recibir:</label>
          <input type="number" v-model="formData.totalRecibir" min="0" step="0.01" placeholder="S/" required />
        </div>
      </div>
      <button class="action-button" @click="calculateTCEACartera">CALCULAR TCEA CARTERA</button>
      <div class="result-group">
        <label>TCEA Cartera:</label>
        <div class="result-box">{{ tceaCarteraResult || 'X.X %' }}</div>
      </div>
      <div class="buttons-section">
        <button class="action-button" @click="goBack">REGRESAR</button>
        <button class="action-button" @click="viewReport">VER REPORTE</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalculoTCEACartera',
  data() {
    return {
      firstName: '',
      lastName: '',
      formData: {
        numeroInstrumentos: '',
        totalRecibir: ''
      },
      tceaCarteraResult: ''
    };
  },
  mounted() {
    this.firstName = localStorage.getItem('firstName') || 'Usuario';
    this.lastName = localStorage.getItem('lastName') || '';
  },
  methods: {
    goBack() {
      this.$router.push('/home');
    },
    viewReport() {
      this.$router.push('/reporte');
    },
    calculateTCEACartera() {
      alert('Implementación pendiente para calcular TCEA Cartera');
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
