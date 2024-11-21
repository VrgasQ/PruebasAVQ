<template>
  <div class="dashboard-container">
    <div class="background-overlay"></div>
    <div class="header">
      <div class="welcome-message">
        <img src="../assets/user.png" alt="User Icon" class="user-icon" />
        <span>Bienvenido, {{ firstName }} {{ lastName }}</span>
      </div>
      <button class="logout-button" @click="logout">CERRAR SESIÓN</button>
    </div>

    <div class="main-card">
      <div class="notification-section">
        <div class="notification-icon" @click="showNotification" title="Haga clic para ver notificaciones" style="cursor: pointer;">
          <img src="../assets/adver.png" alt="Alerta" class="alert-icon" />
          <span v-if="upcomingInvoices > 0" class="notification-count">{{ upcomingInvoices }}</span>
        </div>
      </div>
      <h2 class="card-title">MENU PRINCIPAL</h2>
      <div class="facturas-section">
        <p>Facturas Próximas A Vencer: <span class="highlight-number-box">{{ upcomingInvoices }}</span></p>
        <p>Facturas Recientemente Pagadas: <span class="highlight-number-box">{{ recentInvoices }}</span></p>
      </div>

      <div class="buttons-section">
        <button class="action-button" @click="goToDigitPlanilla">CREAR CARTERA</button>
        <button class="action-button" @click="goToNewLetter">REGISTRAR NUEVA LETRA</button>
        <button class="action-button" @click="goToTCEA">CALCULO DE LA TCEA</button>
        <button class="action-button" @click="goToTCEACartera">CALCULO DE LA TCEA CARTERA</button>
        <button class="action-button" @click="goToReport">REPORTE</button>
        <button class="action-button" @click="goToVANYTIR">VAN Y TIR</button>
      </div>
    </div>

    <div v-if="showToast" :class="['toast-notification', upcomingInvoices > 0 ? 'debt' : 'no-debt']">
      <p><strong>NOTIFICACIONES</strong><br />
        {{ upcomingInvoices > 0 ? 'TIENES LETRAS POR VENCER O YA VENCIDAS!' : 'Estás al día, no tienes facturas próximas a vencer.' }}</p>
    </div>
  </div>
</template>


<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      firstName: '',
      lastName: '',
      upcomingInvoices: 0,
      recentInvoices: 0,
      showToast: false
    };
  },
  mounted() {
    this.firstName = localStorage.getItem('firstName') || '';
    this.lastName = localStorage.getItem('lastName') || '';

    this.loadInvoices();
  },
  methods: {
    loadInvoices() {
      if (this.firstName === "Alexis" && this.lastName === "Vargas") {
        this.upcomingInvoices = 5;
        this.recentInvoices = 3;
      } else {
        this.upcomingInvoices = 0;
        this.recentInvoices = 0;
      }
    },
    showNotification() {
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 2000);
    },
    logout() {
      localStorage.removeItem('firstName');
      localStorage.removeItem('lastName');
      this.$router.push('/');
    },
    goToDigitPlanilla() {
      this.$router.push('/digit-planilla');
    },
    goToNewLetter() {
      this.$router.push('/registrar-nueva-letra');
    },
    goToTCEA() {
      this.$router.push('/calculo-tcea');
    },
    goToTCEACartera() {
      this.$router.push('/calculo-tcea-cartera');
    },
    goToReport() {
      this.$router.push('/reporte');
    },
    goToVANYTIR() {
      this.$router.push('/van-tir');
    }
  }
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Changa:wght@500&display=swap');

.dashboard-container {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centra verticalmente la tarjeta */
  align-items: center;
  min-height: 100vh; /* Asegura que ocupe toda la altura de la ventana */
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: fixed; /* Fija el header en la parte superior */
  top: 0;
  z-index: 10;
}
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-family: 'Changa', sans-serif;
  font-size: 16px;
  color: white;
  z-index: 100;
}

/* Color rojo para notificación de deuda */
.toast-notification.debt {
  background-color: rgba(200, 0, 0, 0.85);
}

/* Color verde para notificación sin deuda */
.toast-notification.no-debt {
  background-color: rgba(49, 87, 44, 1);
}
.welcome-message {
  display: flex;
  align-items: center;
  font-family: 'Changa', sans-serif;
  color: rgba(88, 39, 7, 1);
  font-size: 24px;
  font-weight: 400;
}

.user-icon {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.logout-button {
  background-color: rgba(49, 87, 44, 1);
  color: white;
  border: none;
  padding: 10px 15px;
  font-family: 'Changa', sans-serif;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
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
  margin: -40px auto 20px auto; /* Ajusta la posición entre el header y el footer */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 5;
  width: 900px; /* Ajusta el tamaño según sea necesario */
  min-height: 450px; /* Altura mínima de la tarjeta */
  justify-content: center; /* Centra el contenido dentro de la tarjeta */
}

.notification-section {
  align-self: flex-end;
  margin-bottom: 10px;
}

.notification-icon {
  position: relative;
  display: inline-block;
}

.alert-icon {
  width: 30px;
  height: 30px;
}

.notification-count {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
}

.card-title {
  font-family: 'Changa', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: rgba(88, 39, 7, 1);
  margin-bottom: 20px;
  text-align: center;
  text-decoration: underline;
}

.facturas-section {
  margin-bottom: 20px;
  font-family: 'Changa', sans-serif;
  color: rgba(88, 39, 7, 1);
  font-size: 18px;
  text-align: center;
}

/* Estilo del cuadro marrón para los números */
.highlight-number-box {
  display: inline-block;
  background-color: rgba(88, 39, 7, 1); /* Marrón oscuro */
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
}

.buttons-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  justify-items: center;
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
  height: 80px;
  text-align: center;
}
</style>
