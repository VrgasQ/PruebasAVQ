<template>
  <div class="login-container">
    <div class="background-overlay"></div>

    <div class="create-account">
      <router-link to="/register">
        <button class="create-button" @click="goToRegister">CREAR CUENTA</button>
      </router-link>
    </div>

    <div class="login-card">
      <h2 class="login-title">INICIO DE SESIÓN</h2>
      <input
          type="text"
          placeholder="USUARIO(N°DOCUMENTO)"
          class="input-field"
          v-model="documentNumber"
          @input="validateNumberInput"
      />
      <input
          type="password"
          placeholder="CONTRASEÑA"
          class="input-field"
          v-model="password"
      />
      <button class="login-button" @click="login">INICIAR SESIÓN</button>
      <!-- Mensaje de error si la autenticación falla -->
      <p v-if="loginError" style="color: red; text-align: center;   font-family: 'Changa', sans-serif; font-size: 18px;">{{ loginError }}</p>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
export default {
  name: 'LoginCard',
  data() {
    return {documentNumber: '', password: '', loginError: null,};},
  methods: {
    async login() {
      try {
        const response = await axios.get('http://localhost:3000/users');
        const users = response.data;

        // Busca el usuario por documento y contraseña
        const user = users.find(
          (user) =>
            user.documentNumber === this.documentNumber.trim() &&
            user.password === this.password
        );
        if (user) {
          // Guarda el `userId`, `firstName`, y `lastName` en `localStorage`
          localStorage.setItem('userId', user.id);
          localStorage.setItem('firstName', user.firstName);
          localStorage.setItem('lastName', user.lastName);
          // Redirige al home
          this.$router.push('/home');
        } else {
          this.loginError = 'Usuario o contraseña incorrectos.';
        }
      } catch (error) {
        console.error('Error al autenticar:', error);
        this.loginError = 'Hubo un problema al iniciar sesión. Inténtalo de nuevo.';
      }
    },
    goToRegister() {
      this.$router.push('/register');
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Changa:wght@200..800&family=Poppins:wght@300;400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  overflow: hidden; /* Evita el desplazamiento */
}

.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px); /* Ajusta la altura total menos el tamaño del footer */
  background: url('../assets/fondo.jpg') no-repeat center center fixed;
  background-size: cover;
  position: relative;
}

/* Capa de transparencia roja que está debajo de la card */
.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 243, 227, 0.37); /* Color rojo con transparencia */
  z-index: 0; /* Asegura que esté detrás de la card y botones */
}

.create-account {
  position: absolute; /* Posiciona el botón en la esquina */
  top: 20px;
  right: 20px;
  z-index: 2; /* Asegura que esté encima del overlay */
}

.create-button {
  background-color: rgba(49, 87, 44, 1); /* color del botón */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 15px;
  cursor: pointer;
  font-family: 'Changa', sans-serif;
  font-size: 18px;
  font-weight: 500;
}

.login-card {
  background: rgba(255, 243, 227, 1); /* Cambia el color de fondo aquí */
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 400px; /* Ajusta el ancho según tus preferencias */
  height: auto; /* Deja que la altura se ajuste automáticamente */
  z-index: 2; /* Asegura que esté encima del overlay */
}

.login-title {
  font-family: 'Changa', sans-serif;
  text-align: center;
  margin-bottom: 1px; /* Espacio reducido entre el título y los campos de entrada */
  text-decoration: underline; /* Agrega subrayado al título */
  color: rgba(88, 39, 7, 1); /* Cambia el color del título */
}

.input-field {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid rgba(144, 169, 85, 1);
  background-color: rgba(144, 169, 85, 1); /* Color de fondo para los campos de entrada */
  color: white; /* Color del texto en los campos de entrada */
  text-align: center;
  font-family: 'Changa', sans-serif;
  font-size: 20px;
  font-weight: 200;
}

.input-field::placeholder {
  color: rgba(231, 231, 231, 1); /* Color del texto del placeholder */
}

.login-button {
  width: 150px;
  padding: 8px;
  background-color: rgba(49, 87, 44, 1);
  color: white;
  border: none;
  cursor: pointer;
  font-family: 'Changa', sans-serif;
  margin: 10px auto;
  display: block;
  font-size: 18px;
  font-weight: 600;
  z-index: 2; /* Asegura que esté encima del overlay */
}
</style>
