<template>
  <div class="register-container">
    <div class="background-overlay"></div>
    <div class="register-card" v-if="!registrationSuccess">
      <h2 class="register-title">REGISTRO</h2>
      <form class="register-form" @submit.prevent="handleRegister">
        <select v-model="documentType" required class="input-field">
          <option value="" disabled selected>TIPO DE DOCUMENTO</option>
          <option value="dni">DNI</option>
          <option value="pasaporte">CARNET DE EXTRANJERÍA</option>
        </select>
        <input
            type="text"
            v-model="username"
            @input="validateDocument"
            placeholder="USUARIO(N°DOCUMENTO)"
            required
            class="input-field"
        />
        <input
            type="text"
            v-model="firstName"
            @input="validateName"
            placeholder="NOMBRES"
            required
            class="input-field"
        />
        <input
            type="text"
            v-model="lastName"
            @input="validateName"
            placeholder="APELLIDOS"
            required
            class="input-field"
        />

        <input
            type="email"
            v-model="email"
            placeholder="CORREO ELECTRÓNICO"
            required
            class="input-field"
        />
        <input
            type="password"
            v-model="password"
            placeholder="CONTRASEÑA"
            required
            class="input-field"
        />

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div class="button-group">
          <button type="button" class="cancel-button" @click="showLogin">CANCELAR</button>
          <button type="submit" class="register-button">REGISTRAR</button>
        </div>
      </form>

    </div>

    <!-- Mensaje de confirmación con logo -->
    <div v-if="registrationSuccess" class="confirmation-overlay">
      <div class="confirmation-card">
        <img src="../assets/Confirmacion.png" alt="Logo de confirmación" class="confirmation-logo" />
        <div class="confirmation-message">REGISTRO CREADO<br>SATISFACTORIAMENTE</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      documentType: '',
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      registrationSuccess: false,
      errorMessage: '' // Mensaje de error en caso de duplicados
    };
  },
  watch: {
    // Limpiar el campo de documento cuando se cambie el tipo de documento
    documentType(newType) {
      this.username = ''; // Limpiar el campo de documento cuando cambie el tipo
    }
  },
  methods: {
    handleRegister() {
      // Validaciones de entrada
      if (!this.validateForm()) {
        return; // Si alguna validación falla, no se procesa el registro
      }

      // Datos del usuario a registrar
      const newUser = {
        documentType: this.documentType,
        documentNumber: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password
      };

      // Comprobar si el usuario ya existe
      axios.get('http://localhost:3000/users')
          .then(response => {
            const existingUser = response.data.find(user =>
                (user.documentNumber === this.username && user.documentType === this.documentType) ||
                user.email === this.email
            );

            if (existingUser) {
              this.errorMessage = 'El DNI/Carnet o el correo electrónico ya están registrados.';
            } else {
              // Llamada POST al servidor JSON si no hay duplicados
              this.registerUser(newUser);
            }
          })
          .catch(error => {
            console.error('Error al comprobar el usuario:', error);
          });
    },
    validateDocument() {
      // Validar el documento según el tipo seleccionado
      if (this.documentType === 'dni') {
        this.username = this.username.replace(/[^0-9]/g, '').slice(0, 8); // Solo números, máximo 8 dígitos
      } else if (this.documentType === 'pasaporte') {
        this.username = this.username.replace(/[^0-9]/g, '').slice(0, 20); // Solo números, máximo 20 dígitos
      } else {
        // Si no se selecciona tipo, permitir cualquier número de dígitos
        this.username = this.username.replace(/[^0-9]/g, '');
      }
    },
    validateName(event) {
      // Permitir solo letras del alfabeto inglés (a-z, A-Z), sin acentos ni caracteres especiales
      const value = event.target.value.replace(/[^a-zA-Z]/g, '');
      if (event.target.placeholder === 'NOMBRES') {
        this.firstName = value;
      } else if (event.target.placeholder === 'APELLIDOS') {
        this.lastName = value;
      }
    },
    registerUser(newUser) {
      axios.post('http://localhost:3000/users', newUser)
          .then(response => {
            console.log('Usuario creado exitosamente:', response.data);
            this.registrationSuccess = true;
            this.errorMessage = '';

            // Redirección automática al login después de 3 segundos
            setTimeout(() => {
              this.showLogin();
            }, 3000);
          })
          .catch(error => {
            console.error('Error al crear el usuario:', error);
          });
    },
    validateForm() {
      // Validar longitud del documento
      if (this.documentType === 'dni' && (!/^\d{8}$/.test(this.username))) {
        this.errorMessage = 'El DNI debe tener 8 dígitos numéricos.';
        return false;
      } else if (this.documentType === 'pasaporte' && (!/^\d{1,20}$/.test(this.username))) {
        this.errorMessage = 'El Carnet de Extranjería debe tener hasta 20 dígitos numéricos.';
        return false;
      }

      // Validar nombres y apellidos solo con letras del alfabeto básico
      const nameRegex = /^[a-zA-Z]+$/;
      if (!nameRegex.test(this.firstName) || !nameRegex.test(this.lastName)) {
        this.errorMessage = 'Nombres y apellidos solo deben contener letras (sin números ni símbolos).';
        return false;
      }

      // Resetear mensaje de error si pasa las validaciones
      this.errorMessage = '';
      return true;
    },
    showLogin() {
      this.$router.push('/'); // Navega de vuelta al componente de inicio de sesión
    }
  }
};
</script>



<style>
@import url('https://fonts.googleapis.com/css2?family=Changa:wght@200..800&family=Poppins:wght@300;400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  margin: 0;
  overflow: hidden; /* Evita el desplazamiento */
}

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px); /* Ajusta la altura para descontar el footer */
  padding-top: 50px; /* Ajusta según sea necesario para centrar */
  padding-bottom: 50px; /* Añade espacio inferior */
  background: url('../assets/fondo.jpg') no-repeat center center fixed;
  background-size: cover;
  position: relative;
}

.register-card {
  background: rgba(255, 243, 227, 1);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 400px;
  max-height: 70vh;  /* Ajusta la altura máxima según el espacio disponible */
  overflow-y: auto;  /* Agrega scroll si es necesario */
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centra verticalmente el contenido */
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 243, 227, 0.37); /* Color rojo con transparencia */
  z-index: 0; /* Asegura que esté detrás de la card y botones */
}



.register-title {
  font-family: 'Changa', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: rgba(88, 39, 7, 1);
  text-align: center;
  margin-bottom: 15px;
  text-decoration: underline;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-field {
  width: 100%;
  padding: 2px;
  border: 1px solid #ccc;

  background-color: rgba(144, 169, 85, 1);
  color: white;
  text-align: center;
  font-family: 'Changa', sans-serif;

  font-size: 20px;
  font-weight: 200;
}

.input-field::placeholder {
  color: white;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.cancel-button,
.register-button {
  width: 48%;
  padding: 10px;
  font-family: 'Changa', sans-serif;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-button {
  background-color: rgba(49, 87, 44, 1);
  color: white;
}

.register-button {
  background-color: rgba(49, 87, 44, 1);
  color: white;
}

.confirmation-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}

.confirmation-card {
  background-color: #31572C; /* Fondo verde */
  width: 500px; /* Aumenta el ancho de la tarjeta */
  height: 300px; /* Aumenta la altura de la tarjeta */
  padding: 30px 40px; /* Ajusta el padding para darle más espacio interno */
  border-radius: 15px; /* Aumenta el borde redondeado */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3); /* Sombra más pronunciada */
}

.confirmation-logo {
  width: 100px; /* Tamaño más grande del logo */
  height: 100px;
  margin-bottom: 20px;
}

.confirmation-message {
  color: white;
  font-family: 'Changa', sans-serif;
  font-size: 24px; /* Aumenta el tamaño de la fuente */
  text-align: center;
  padding: 15px;
}

.error-message {
  color: red;
  font-size: 14px;
  text-align: center;
  font-family: 'Changa', sans-serif;
}

</style>
