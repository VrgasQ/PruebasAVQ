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

    <div class="main-card" v-if="!registrationSuccess">
      <h2 class="card-title">REGISTRAR NUEVA LETRA</h2>
      <div class="form-section">
        <!-- Campo Número de Cartera -->
        <div class="form-group">
          <label>Número De Cartera:</label>
          <select v-model="formData.numeroPlanilla" required>
            <option value="" disabled selected>Seleccione una cartera</option>
            <option v-for="cartera in carteras" :key="cartera.id" :value="cartera.id">
              Cartera {{ cartera.id }}
            </option>
          </select>
        </div>

        <!-- Campos del formulario -->
        <div class="form-group">
          <label>Razón Social/ Nombres:</label>
          <input type="text" v-model="formData.razonSocial" maxlength="100" required />
        </div>
        <div class="form-group">
          <label>Apellido Paterno:</label>
          <input type="text" v-model="formData.apellidoPaterno" maxlength="50" required />
        </div>
        <div class="form-group">
          <label>Apellido Materno:</label>
          <input type="text" v-model="formData.apellidoMaterno" maxlength="50" required />
        </div>
        <div class="form-group">
          <label>Tipo Documento Identidad:</label>
          <select v-model="formData.tipoDocumento" required>
            <option value="" disabled selected>Elige el tipo de documento</option>
            <option value="RUC">RUC</option>
            <option value="DNI">DNI</option>
          </select>
        </div>
        <div class="form-group" v-if="formData.tipoDocumento">
          <label>Nº Documento Identidad:</label>
          <input
            type="text"
            v-model="formData.documentoIdentidad"
            maxlength="20"
            placeholder="Ingrese el número de documento"
            required
          />
        </div>
        <div class="form-group">
          <label>Nº Letra:</label>
          <input
            type="number"
            v-model="formData.numeroLetra"
            min="1"
            step="1"
            placeholder="Ejemplo: 001"
            required
          />
        </div>
        <div class="form-group">
          <label>Fecha De Giro:</label>
          <input type="date" v-model="formData.fechaGiro" required />
        </div>
        <div class="form-group">
          <label>Fecha De Vencimiento:</label>
          <input type="date" v-model="formData.fechaVencimiento" required />
        </div>
        <div class="form-group">
          <label>Valor Nominal:</label>
          <input type="number" v-model="formData.valorNominal" min="0" step="0.01" placeholder="S/" required />
        </div>
      </div>
      <div class="buttons-section">
        <button class="action-button" @click="goBack">REGRESAR</button>
        <button class="action-button" @click="registerLetter">REGISTRAR LETRA</button>
        <button class="action-button" @click="viewList">VER LISTADO DE LETRAS</button>
      </div>
    </div>

    <div v-if="registrationSuccess" class="confirmation-overlay">
      <div class="confirmation-card">
        <img src="../assets/Confirmacion.png" alt="Logo de confirmación" class="confirmation-logo" />
        <div class="confirmation-message">LETRA AGREGADA<br>SATISFACTORIAMENTE</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RegistrarNuevaLetra",
  data() {
    return {
      userId: localStorage.getItem("userId") || "",
      carteras: [], // Almacena las carteras del usuario
      formData: {
        numeroPlanilla: "", // Campo seleccionado por el usuario
        razonSocial: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        tipoDocumento: "",
        documentoIdentidad: "",
        numeroLetra: "", // Utilizado como ID único
        fechaGiro: "",
        fechaVencimiento: "",
        valorNominal: "",
      },
      registrationSuccess: false,
      errorMessage: "",
    };
  },
  async mounted() {
    await this.fetchCarteras(); // Carga las carteras del usuario al montar el componente
  },
  methods: {
    async fetchCarteras() {
      try {
        const response = await axios.get(
          `http://localhost:3000/carteras?userId=${this.userId}`
        );
        this.carteras = response.data;
      } catch (error) {
        console.error("Error al cargar las carteras:", error);
      }
    },
    async registerLetter() {
      if (!this.formData.numeroPlanilla) {
        alert("Debe seleccionar un número de cartera.");
        return;
      }

      if (!this.formData.numeroLetra) {
        alert("Debe ingresar un Nº de Letra único.");
        return;
      }

      try {
        // Verificar si el número de letra ya existe
        const response = await axios.get("http://localhost:3000/letras");
        const existingLetter = response.data.find(
          (letra) => letra.numeroLetra === this.formData.numeroLetra
        );

        if (existingLetter) {
          alert(
            `El Nº de Letra ${this.formData.numeroLetra} ya existe. Por favor, ingrese otro.`
          );
          return;
        }

        const letterData = {
          ...this.formData,
          id: this.formData.numeroLetra, // Asigna numeroLetra como ID
          planillaId: this.formData.numeroPlanilla, // Asocia la cartera seleccionada
        };

        await axios.post("http://localhost:3000/letras", letterData);
        this.registrationSuccess = true;
        alert("Letra registrada correctamente.");

        setTimeout(() => {
          this.$router.push("/listado-letras");
        }, 3000);
      } catch (error) {
        console.error("Error al registrar la letra:", error);
        alert("Hubo un problema al registrar la letra.");
      }
    },
    goBack() {
      this.$router.push("/home");
    },
    viewList() {
      this.$router.push("/listado-letras");
    },
    logout() {
      localStorage.removeItem("userId");
      this.$router.push("/");
    },
  },
};
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Changa:wght@500&display=swap');

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
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.form-group label {
  flex-basis: 30%;
  text-align: right;
}

.form-group input, .form-group select {
  flex-grow: 1;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.buttons-section {
  display: flex;
  gap: 10px;
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
/* Aplica el estilo de color gris al label */
.label-placeholder {
  color: #fa0606; /* Cambia este color si deseas otro tono de gris */
  font-weight: normal; /* Ajusta el peso de la fuente si es necesario */
}

select, option {
  color: black; /* Asegúrate de que el color sea visible */
  font-size: 16px; /* Ajusta el tamaño si es necesario */
}
</style>
