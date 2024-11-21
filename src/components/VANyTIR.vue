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
      <h2 class="card-title">CÁLCULO VAN Y TIR </h2>
      <div class="form-section">
        <div class="form-group">
          <label for="cokAnual">COK Anual (%):</label>
          <input
              type="number"
              v-model="formData.cokAnual"
              min="0"
              step="0.01"
              placeholder="Ingrese el porcentaje"
              required
          />
          <button @click="logReportData">Mostrar datos en consola</button>
        </div>
        <div class="form-group">
          <label for="diasPorAnio">Nº Días Por Año:</label>
          <select v-model="formData.diasPorAnio" required>
            <option value="360">360</option>
            <option value="365">365</option>
          </select>
        </div>
      </div>

      <div class="buttons-section">
        <button class="action-button" @click="calculateTIR">CALCULAR TIR</button>
        <button class="action-button" @click="calculateVAN">CALCULAR VAN</button>
      </div>

      <div class="result-group">
        <div class="result-box">{{ tirNoAnualizada || 'X.X %' }}</div>

        <div class="result-box">{{ vanResult || "X.X" }}</div>

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
  name: "VANyTIR",
  data() {
    return {
      firstName: "",
      lastName: "",
      formData: {
        cokAnual: "",
        diasPorAnio: "360",
      },
      tirNoAnualizada: "", // Define aquí la propiedad
      tirResult: "",
      vanResult: "", // Nueva propiedad para almacenar el VAN
      reportData: [], // Aquí se guardará el reporte
    };
  },
  mounted() {
    this.firstName = localStorage.getItem("firstName") || "Usuario";
    this.lastName = localStorage.getItem("lastName") || "";

    // Llama a fetchReportData para obtener los datos al cargar la página
    this.fetchReportData();
  },
  methods: {
    async fetchReportData() {
      try {
        console.log("Intentando obtener datos del servidor...");
        const response = await fetch("http://localhost:3000/reporte");

        if (!response.ok) {
          throw new Error(`Error al obtener los datos: ${response.statusText}`);
        }

        // Convertir la respuesta a JSON
        const data = await response.json();

        // Imprimir la respuesta completa para verificar la estructura
        console.log("Respuesta completa del servidor:", data);

        // Verificar que la respuesta sea un arreglo y que tenga al menos un elemento
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("La respuesta del servidor no es válida o está vacía");
        }

        // Acceder al primer objeto del arreglo y al campo `reporte`
        const reporteData = data[0]?.reporte;

        // Validar que `reporte` sea un arreglo con datos
        if (!reporteData || !Array.isArray(reporteData) || reporteData.length === 0) {
          throw new Error("El reporte no contiene datos válidos");
        }

        // Guardar los datos en el componente
        this.reportData = reporteData;
        console.log("Datos obtenidos del reporte:", this.reportData);
      } catch (error) {
        console.error("Error al obtener el reporte:", error);
      }
    },
    logReportData() {
      // Método para verificar los datos en la consola
      console.log("Datos almacenados en reportData:", this.reportData);
    },
    goBack() {
      this.$router.push("/home");
    },
    viewReport() {
      this.$router.push("/reporte");
    },
    calculateTIR() {
      try {
        if (!this.reportData || this.reportData.length === 0) {
          throw new Error("No hay datos para calcular la TIR");
        }

        // Fecha base
        const fechaBase = new Date(this.reportData[0].fechaVencimiento);

        // Preparar flujos y días
        const flujos = [];
        const dias = [];

        this.reportData.forEach((item, index) => {
          const fecha = new Date(item.fechaVencimiento);
          const flujo = parseFloat(item.flujo);

          flujos.push(index === 0 ? -flujo : flujo);
          const diasDesdeBase = Math.round((fecha - fechaBase) / (1000 * 60 * 60 * 24));
          dias.push(diasDesdeBase);
        });

        console.log("Flujos enviados al cálculo:", flujos);
        console.log("Días transcurridos desde la fecha base:", dias);

        // Calcular TIR no anualizada
        const tir = this.calculateIRRWithDays(flujos, dias);
        this.tirNoAnualizada = `${(tir * 100).toFixed(4)}%`; // Formatear con 4 dígitos
        console.log("TIR no anualizada:", tir);
      } catch (error) {
        console.error("Error al calcular la TIR:", error);
        this.tirNoAnualizada = "Error en la TIR no anualizada";
      }
    },

    calculateIRRWithDays(cashFlows, dias) {
      let irr = 0.1; // Suposición inicial (10%)
      const maxIter = 1000;
      const tol = 1e-6;

      for (let iter = 0; iter < maxIter; iter++) {
        let npv = 0;
        let derivative = 0;

        for (let i = 0; i < cashFlows.length; i++) {
          const tiempo = dias[i] / 365; // Ajustar el tiempo a años (365 días)
          npv += cashFlows[i] / Math.pow(1 + irr, tiempo);
          derivative -= (tiempo * cashFlows[i]) / Math.pow(1 + irr, tiempo + 1);
        }

        const newIrr = irr - npv / derivative;

        if (Math.abs(newIrr - irr) < tol) {
          return newIrr; // Retornar la TIR calculada
        }

        irr = newIrr;
      }

      throw new Error("No se pudo calcular la TIR después de 1000 iteraciones");
    },

    calculateVAN() {
      try {
        if (!this.reportData || this.reportData.length === 0) {
          throw new Error("No hay datos para calcular el VAN");
        }

        // Convertir la tasa COK anual en tasa diaria efectiva
        const cokAnual = parseFloat(this.formData.cokAnual) / 100; // Convertir a decimal
        const diasPorAnio = parseInt(this.formData.diasPorAnio, 10);
        const tasaDiaria = Math.pow(1 + cokAnual, 1 / diasPorAnio) - 1;

        console.log("Tasa diaria calculada:", tasaDiaria);

        // Fecha base (fecha del primer flujo)
        const fechaBase = new Date(this.reportData[0].fechaVencimiento);

        // Calcular el VAN
        let van = 0;

        this.reportData.forEach((item, index) => {
          const fecha = new Date(item.fechaVencimiento);
          const flujo = parseFloat(item.flujo);

          // Días transcurridos desde la fecha base
          const diasDesdeBase = Math.round((fecha - fechaBase) / (1000 * 60 * 60 * 24));
          const factorDescuento = Math.pow(1 + tasaDiaria, diasDesdeBase);

          console.log(
              `Flujo: ${flujo}, Días: ${diasDesdeBase}, Factor: ${factorDescuento}`
          );

          // Ajustar el flujo inicial como inversión negativa
          const flujoDescontado = flujo / factorDescuento;
          van += flujoDescontado;
        });

        // Guardar el resultado redondeado a 2 decimales
        this.vanResult = van.toFixed(2);
        console.log("VAN calculado:", this.vanResult);
      } catch (error) {
        console.error("Error al calcular el VAN:", error);
        this.vanResult = "Error en el cálculo de VAN";
      }
    },
    logout() {
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      this.$router.push("/");
    },
  },
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
  gap: 20px;
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
