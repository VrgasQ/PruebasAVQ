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
      <h2 class="card-title">LISTADO DE LETRAS</h2>
      <div class="data-box">
        <table class="letras-table">
          <thead>
          <tr>
            <th>Nº</th>
            <th>Razón Social/Nombres</th>
            <th>Apellido Paterno</th>
            <th>Tipo Doc. Id</th>
            <th>Nº Doc. Id</th>
            <th>Fecha Giro</th>
            <th>Fecha Vcto</th>
            <th>V. Nominal</th>
            <th>Nº Días</th>
            <th>TEP (I')</th>
            <th>D</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(letra, index) in letras" :key="letra.id">
            <td>{{ index + 1 }}</td>
            <td>{{ letra.razonSocial }}</td>
            <td>{{ letra.apellidoPaterno }}</td>
            <td>{{ letra.tipoDocumento }}</td>
            <td>{{ letra.documentoIdentidad }}</td>
            <td>{{ letra.fechaGiro }}</td>
            <td>{{ letra.fechaVencimiento }}</td>
            <td>{{ letra.valorNominal }}</td>
            <td>{{ calculateDias(letra) }}</td>
            <td>{{ calculateTEP(letra) }}</td>
            <td>{{ calculateD(letra) }}</td>
            <td>
              <button @click="editLetter(letra.id)">Editar</button>
              <button @click="deleteLetter(letra.id)">Eliminar</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="buttons-section">
        <button class="action-button" @click="goBack">REGRESAR</button>
        <button class="action-button" @click="saveLetters">GUARDAR DATOS</button>
        <button class="action-button" @click="goToNext">SIGUIENTE</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ListadoLetras",
  data() {
    return {
      firstName: "",
      lastName: "",
      letras: [], // Almacenará la última letra
      carteraSeleccionada: null // Almacena la cartera asociada
    };
  },
  mounted() {
    this.firstName = localStorage.getItem("firstName") || "";
    this.lastName = localStorage.getItem("lastName") || "";
    this.fetchLastLetra(); // Cargar datos al montar el componente
  },
  methods: {
    async fetchLastLetra() {
      try {
        const response = await axios.get("http://localhost:3000/letras");
        const allLetras = response.data;

        if (allLetras.length > 0) {
          this.letras = [allLetras[allLetras.length - 1]]; // Cargar solo la última letra

          // Buscar la cartera correspondiente al planillaId
          const carteraResponse = await axios.get("http://localhost:3000/carteras");
          const carteraSeleccionada = carteraResponse.data.find(
            (cartera) => cartera.id === this.letras[0].planillaId // Relación cartera-letra
          );

          if (carteraSeleccionada) {
            this.carteraSeleccionada = carteraSeleccionada; // Guardar la cartera seleccionada
          } else {
            console.warn("No se encontró una cartera asociada al planillaId.");
            this.carteraSeleccionada = null;
          }
        } else {
          this.letras = [];
        }
      } catch (error) {
        console.error("Error al cargar las letras o la cartera:", error);
      }
    },

    calculateDias(letra) {
      if (
        !letra.fechaVencimiento ||
        !this.carteraSeleccionada ||
        !this.carteraSeleccionada.fechaDescuento
      ) {
        console.warn("Fechas inválidas o no definidas");
        return 0;
      }

      // Convertir las fechas a objetos Date
      const vencimiento = new Date(letra.fechaVencimiento);
      const descuento = new Date(this.carteraSeleccionada.fechaDescuento);

      if (isNaN(vencimiento.getTime()) || isNaN(descuento.getTime())) {
        console.warn("Fechas no válidas para el cálculo");
        return 0;
      }

      // Cálculo de la diferencia en días: Fecha de Vencimiento (letra) - Fecha de Descuento (cartera)
      const diffTime = vencimiento - descuento;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convertir a días
    },

    calculateTEP(letra) {
      if (!this.carteraSeleccionada || !this.carteraSeleccionada.teaCompensatoria) {
        console.warn("Cartera seleccionada o TEA no definida.");
        return "0.00 %";
      }

      const tea = parseFloat(this.carteraSeleccionada.teaCompensatoria.replace("%", "")) / 100; // Convertir TEA a decimal
      const numeroDias = this.calculateDias(letra); // Usar la función calculateDias para obtener el número de días
      const diasPorAnio = parseInt(this.carteraSeleccionada.diasPorAnio); // Días por año de la cartera

      if (numeroDias === 0 || isNaN(diasPorAnio)) {
        return "0.00 %"; // Si no hay días o días por año no es válido, TEP es 0
      }

      // Cálculo del TEP: (1 + TEA)^(Días / Días por Año) - 1
      const tep = Math.pow(1 + tea, numeroDias / diasPorAnio) - 1;
      return (tep * 100).toFixed(3) + " %"; // Retornar en porcentaje con 2 decimales
    },

    calculateD(letra) {
  const tepDecimal = parseFloat(this.calculateTEP(letra).replace("%", "")) / 100; // Convertir TEP a decimal

  if (tepDecimal === 0) {
    return "0.000%"; // Si TEP es 0, D también es 0 y se muestra como 0%
  }

  // Cálculo de "d": TEP / (1 + TEP)
  const d = tepDecimal / (1 + tepDecimal);
  return (d * 100).toFixed(3) + "%"; // Multiplicar por 100 para convertir a porcentaje y formatear a 2 decimales
},

async saveLetters() {
      try {
        const processedLetters = this.letras.map((letra) => ({
          razonSocial: letra.razonSocial,
          apellidoPaterno: letra.apellidoPaterno,
          tipoDocumento: letra.tipoDocumento,
          documentoIdentidad: letra.documentoIdentidad,
          fechaGiro: letra.fechaGiro,
          fechaVencimiento: letra.fechaVencimiento,
          valorNominal: letra.valorNominal,
          numeroDias: this.calculateDias(letra),
          tep: this.calculateTEP(letra),
          d: this.calculateD(letra),
        }));

        await axios.post("http://localhost:3000/listado_de_letras", {
          letras: processedLetters,
        });

        alert("Datos guardados correctamente en el servidor.");
      } catch (error) {
        console.error("Error al guardar los datos:", error);
        alert("Hubo un problema al guardar los datos.");
      }
    },

    async editLetter(id) {
      this.$router.push(`/editar-letra/${id}`);
    },

    async deleteLetter(id) {
      try {
        await axios.delete(`http://localhost:3000/letras/${id}`);
        this.letras = this.letras.filter((letra) => letra.id !== id);
        alert("Letra eliminada con éxito");
      } catch (error) {
        console.error("Error al eliminar la letra:", error);
      }
    },

    logout() {
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      this.$router.push("/");
    },

    goBack() {
      this.$router.push("/home");
    },

    goToNext() {
      this.$router.push("/calculo-tcea");
    },
  },
};
</script>








<style scoped>
.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 0;
}

.dashboard-container {
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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

.main-card {
  margin-top: 80px;
  padding: 20px;
  border-radius: 10px;
  background-color: rgba(255, 243, 227, 0.8);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 5;
  width: 1100px;
  min-height: 450px;
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

.data-box {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(88, 39, 7, 1);
  width: 100%;
}

.letras-table {
  width: 100%;
  border-collapse: collapse;
}

.letras-table th, .letras-table td {
  border: 1px solid rgba(88, 39, 7, 1);
  padding: 10px;
  text-align: left;
  color: rgba(88, 39, 7, 1);
}

.buttons-section {
  display: flex;
  justify-content: space-between;
  width: 100%;
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
}
</style>
