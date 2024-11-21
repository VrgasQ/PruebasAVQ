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
      <h2 class="card-title">REPORTE</h2>
      <div class="data-box">
        <table class="letras-table">
          <thead>
            <tr>              <th>Nº</th>              <th>Fecha de Giro</th>              <th>Fecha Vcto/Dcto</th>              <th>Valor Nominal</th>              <th>Descuento</th>
                            <th>Costo Inicial</th>              <th>Costo Final</th>              <th>Seguro</th>              <th>Retención</th>              <th>V. Neto</th>
                            <th>Valor a Recibir</th>              <th>Flujo</th>              <th>TCEA</th>              <th>Descargar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in reportData" :key="index">
              <td>{{ item.numero }}</td>
              <td>{{ item.fechaGiro || '-' }}</td>
              <td>{{ item.fechaVencimiento || '-' }}</td>
              <td>{{ item.valorNominal || '-' }}</td>
              <td>{{ item.descuento || '-' }}</td>
              <td>{{ item.costoInicial || '-' }}</td>
              <td>{{ item.costoFinal || '-' }}</td>
              <td>{{ item.seguro || '-' }}</td>
              <td>{{ item.retencion || '-' }}</td>
              <td>{{ item.valorNeto || '-' }}</td>
              <td>{{ item.valorRecibir || '-' }}</td>
              <td :class="{'negative-flow': parseFloat(item.flujo) > 0}">{{ item.flujo || '-' }}</td>
              <td>{{ item.tcea || '-' }}</td>
              <td>
                <button v-if="item.descargable" @click="downloadReport(item)" class="action-button">
                  DESCARGAR
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="buttons-section">
        <button class="action-button" @click="goBack">REGRESAR</button>
        <button class="action-button" @click="saveReport">GUARDAR REPORTE</button>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "Reporte",
  data() {
    return {
      firstName: "",
      lastName: "",
      reportData: [], // Datos del reporte cargados
      carteraSeleccionada: null, // Almacena la cartera seleccionada
    };
  },
  mounted() {
    this.firstName = localStorage.getItem("firstName") || "";
    this.lastName = localStorage.getItem("lastName") || "";
    this.loadReportData(); // Cargar datos al montar el componente
  },
  methods: {
    async loadReportData() {
  try {
    const [carterasResponse, letrasResponse] = await Promise.all([
      axios.get("http://localhost:3000/carteras"),
      axios.get("http://localhost:3000/letras"),
    ]);
    const carteras = carterasResponse.data;
    const letras = letrasResponse.data;
    const cartera = carteras.find((cartera) => cartera.id === 1); // Cambiar por el ID de la cartera actual
    if (cartera) {
      this.carteraSeleccionada = cartera;
      this.diasPorAnio = cartera.diasPorAnio; // Almacenar días por año aquí para usarlo en los cálculos

      const letrasFiltradas = letras.filter(
        (letra) => letra.planillaId === cartera.id
      );
      const letrasMapeadas = letrasFiltradas.map((letra, index) => ({
        numero: index + 1,
        fechaGiro: letra.fechaGiro,
        fechaVencimiento: letra.fechaVencimiento, // Mantener fecha de vencimiento real de la letra
        valorNominal: letra.valorNominal,
        descuento: this.calculateDescuento(letra, cartera),
        costoInicial: this.calculateCostoInicial(letra, cartera),
        costoFinal: this.calculateCostoFinal(letra, cartera),
        seguro: this.calculateSeguro(letra, cartera),
        retencion: this.calculateRetencion(letra, cartera),
        valorNeto: this.calculateValorNeto(
    {
      valorNominal: letra.valorNominal,
      descuento: this.calculateDescuento(letra, cartera),
    },
    cartera
  ),        
  valorRecibir: this.calculateValorRecibir(
    {
      valorNeto: this.calculateValorNeto(
        {
          valorNominal: letra.valorNominal,
          descuento: this.calculateDescuento(letra, cartera),
        },
        cartera
      ),
      costoInicial: this.calculateCostoInicial(letra, cartera),
      seguro: this.calculateSeguro(letra, cartera),
      retencion: this.calculateRetencion(letra, cartera),
    },
    cartera
  ),        
       flujo: this.calculateFlujo(letra, cartera),
        tcea: this.calculateTCEA(letra, cartera),
        descargable: true,
      }));

      const flujoTotal = letrasMapeadas.reduce(
        (total, letra) => total + parseFloat(letra.valorRecibir || 0),
        0
      );

      const lineaInicial = {
        numero: 0,
        fechaGiro: null,
        fechaVencimiento: cartera.fechaDescuento, // Usar fecha de descuento de la cartera
        valorNominal: null,
        descuento: null,
        costoInicial: null,
        costoFinal: null,
        seguro: null,
        retencion: null,
        valorNeto: null,
        valorRecibir: null,
        flujo: flujoTotal.toFixed(2), // Usar el flujo total calculado
        tcea: null,
        descargable: false,
      };

      this.reportData = [lineaInicial, ...letrasMapeadas];
    } else {
      console.warn("No se encontró una cartera seleccionada.");
    }
  } catch (error) {
    console.error("Error al cargar los datos del reporte:", error);
  }
},

    async saveReport() {
      try {
        await axios.post("http://localhost:3000/reporte", {
          reporte: this.reportData,
        });
        alert("Reporte guardado correctamente.");
      } catch (error) {
        console.error("Error al guardar el reporte:", error);
        alert("Hubo un problema al guardar el reporte.");
      }
    },

    // Métodos de cálculo aquí
    calculateDescuento(letra, cartera) { 
      if (!cartera || !cartera.teaCompensatoria || !letra.valorNominal) {
    console.warn("Datos incompletos para calcular el descuento.");
    return 0;
  }

  // Convertir TEA a TEP
  const tea = parseFloat(cartera.teaCompensatoria.replace("%", "")) / 100; // Convertir TEA a decimal
  const diasPorAnio = parseInt(cartera.diasPorAnio); // Días por año (360 o 365)
  const dias = Math.ceil(
    (new Date(letra.fechaVencimiento) - new Date(cartera.fechaDescuento)) /
      (1000 * 60 * 60 * 24)
  ); // Diferencia en días

  if (isNaN(tea) || isNaN(diasPorAnio) || dias <= 0) {
    console.warn("Datos inválidos para calcular TEP o días.");
    return 0;
  }

  // Cálculo del TEP
  const tep = Math.pow(1 + tea, dias / diasPorAnio) - 1;

  // Cálculo de "d"
  const d = tep / (1 + tep);

  // Cálculo del descuento
  const descuento = letra.valorNominal * d;

  return descuento.toFixed(2); // Retornar con dos decimales


    },


    calculateCostoInicial(letra, cartera) {
  // Verificar si la cartera tiene datos válidos
  if (!cartera) {
    console.warn("Cartera no definida.");
    return "-";
  }

  // Inicializar la suma
  let sumaCostosInicio = 0;

  // Verificar cada campo de la cartera y sumar si el período es "Inicio"
  if (cartera.comisionActivacionPeriodo === "Inicio") {
    sumaCostosInicio += parseFloat(cartera.comisionActivacion || 0);
    console.log("Comisión Activación sumada:", cartera.comisionActivacion);
  }

  if (cartera.gastosAdministrativosPeriodo === "Inicio") {
    sumaCostosInicio += parseFloat(cartera.gastosAdministrativos || 0);
    console.log("Gastos Administrativos sumados:", cartera.gastosAdministrativos);
  }

  if (cartera.portesPeriodo === "Inicio") {
    sumaCostosInicio += parseFloat(cartera.portes || 0);
    console.log("Portes sumados:", cartera.portes);
  }

  if (cartera.seguroPeriodo === "Inicio" && !cartera.seguro.includes("%")) {
    sumaCostosInicio += parseFloat(cartera.seguro || 0);
    console.log("Seguro sumado:", cartera.seguro);
  }

  if (cartera.retencionPeriodo === "Inicio" && !cartera.retencion.includes("%")) {
    sumaCostosInicio += parseFloat(cartera.retencion || 0);
    console.log("Retención sumada:", cartera.retencion);
  }

  // Retornar la suma con dos decimales
  console.log("Suma total de costos de inicio:", sumaCostosInicio);
  return sumaCostosInicio.toFixed(2);
},
    
calculateCostoFinal(letra, cartera) {
  // Verificar si la cartera tiene datos válidos
  if (!cartera) {
    console.warn("Cartera no definida.");
    return "-";
  }

  // Inicializar la suma
  let sumaCostosFin = 0;

  // Verificar cada campo de la cartera y sumar si el período es "Fin"
  if (cartera.comisionActivacionPeriodo === "Fin") {
    sumaCostosFin += parseFloat(cartera.comisionActivacion || 0);
    console.log("Comisión Activación sumada en Fin:", cartera.comisionActivacion);
  }

  if (cartera.gastosAdministrativosPeriodo === "Fin") {
    sumaCostosFin += parseFloat(cartera.gastosAdministrativos || 0);
    console.log("Gastos Administrativos sumados en Fin:", cartera.gastosAdministrativos);
  }

  if (cartera.portesPeriodo === "Fin") {
    sumaCostosFin += parseFloat(cartera.portes || 0);
    console.log("Portes sumados en Fin:", cartera.portes);
  }

  if (cartera.seguroPeriodo === "Fin" && !cartera.seguro.includes("%")) {
    sumaCostosFin += parseFloat(cartera.seguro || 0);
    console.log("Seguro sumado en Fin:", cartera.seguro);
  }

  if (cartera.retencionPeriodo === "Fin" && !cartera.retencion.includes("%")) {
    sumaCostosFin += parseFloat(cartera.retencion || 0);
    console.log("Retención sumada en Fin:", cartera.retencion);
  }

  // Retornar la suma con dos decimales
  console.log("Suma total de costos de fin:", sumaCostosFin);
  return sumaCostosFin.toFixed(2);
},
calculateSeguro(letra, cartera) {
  if (
    !letra.fechaVencimiento ||
    !cartera ||
    !cartera.fechaDescuento ||
    !letra.valorNominal ||
    !cartera.seguro
  ) {
    console.warn("Datos incompletos para calcular el seguro.");
    return 0;
  }

  // Convertir las fechas a objetos Date
  const vencimiento = new Date(letra.fechaVencimiento);
  const descuento = new Date(cartera.fechaDescuento);

  if (isNaN(vencimiento.getTime()) || isNaN(descuento.getTime())) {
    console.warn("Fechas no válidas para el cálculo de seguro.");
    return 0;
  }

  // Calcular la diferencia en días
  const diffTime = vencimiento - descuento;
  const numeroDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convertir a días

  if (numeroDias <= 0) {
    console.warn("El número de días es inválido para el cálculo de seguro.");
    return 0;
  }

  // Asegurarse de que el seguro es un porcentaje
  const seguroPorcentaje = cartera.seguro.includes("%")
    ? parseFloat(cartera.seguro.replace("%", "")) / 100
    : parseFloat(cartera.seguro);

  if (isNaN(seguroPorcentaje) || seguroPorcentaje <= 0) {
    console.warn("El valor del seguro no es válido.");
    return 0;
  }

  // Calcular el seguro
  const seguro = (seguroPorcentaje / 360) * numeroDias * letra.valorNominal;

  // Redondear a dos decimales
  return seguro.toFixed(2);
},
calculateRetencion(letra, cartera) {
  // Verificar que los datos necesarios estén presentes
  if (!cartera || !letra || !cartera.retencion || !letra.valorNominal) {
    console.warn("Datos incompletos para calcular la retención.");
    return 0;
  }

  // Asegurarse de que la retención sea un porcentaje
  const retencionPorcentaje = cartera.retencion.includes("%")
    ? parseFloat(cartera.retencion.replace("%", "")) / 100
    : parseFloat(cartera.retencion);

  if (isNaN(retencionPorcentaje) || isNaN(letra.valorNominal)) {
    console.warn("Valores no válidos para calcular la retención.");
    return 0;
  }

  // Calcular la retención
  const retencion = letra.valorNominal * retencionPorcentaje;

  // Redondear a dos decimales
  return retencion.toFixed(2);
},
    calculateValorNeto(letra, cartera) {
  if (!letra.valorNominal || !letra.descuento) {
    console.warn("Datos incompletos para calcular el valor neto.");
    return "-";
  }

  // Calcular el valor neto
  const valorNeto = parseFloat(letra.valorNominal) - parseFloat(letra.descuento);

  // Redondear a dos decimales y retornar
  return valorNeto.toFixed(2);
},

calculateValorRecibir(letra, cartera) {
  // Validar datos necesarios
  if (!letra.valorNeto || !letra.costoInicial || !letra.seguro || !letra.retencion) {
    console.warn("Datos incompletos para calcular el valor a recibir.");
    return "-";
  }

  // Convertir valores a flotantes
  const valorNeto = parseFloat(letra.valorNeto) || 0;
  const costoInicial = parseFloat(letra.costoInicial) || 0;
  const seguro = parseFloat(letra.seguro) || 0;
  const retencion = parseFloat(letra.retencion) || 0;

  // Calcular el valor a recibir
  const valorRecibir = valorNeto - costoInicial - seguro - retencion;

  // Redondear a dos decimales y retornar
  return valorRecibir.toFixed(2);
},
calculateFlujo(letra, cartera) {
  // Validar datos necesarios
  if (!letra || !cartera) {
    console.warn("Datos incompletos para calcular el flujo.");
    return 0;
  }

  // Obtener el Valor Nominal
  const valorNominal = parseFloat(letra.valorNominal) || 0;

  // Calcular la suma de los costos finales
  let sumaCostosFin = 0;
  if (cartera.comisionActivacionPeriodo === "Fin") {
    sumaCostosFin += parseFloat(cartera.comisionActivacion || 0);
    console.log("Comisión Activación sumada en Fin:", cartera.comisionActivacion);
  }

  if (cartera.gastosAdministrativosPeriodo === "Fin") {
    sumaCostosFin += parseFloat(cartera.gastosAdministrativos || 0);
    console.log("Gastos Administrativos sumados en Fin:", cartera.gastosAdministrativos);
  }

  if (cartera.portesPeriodo === "Fin") {
    sumaCostosFin += parseFloat(cartera.portes || 0);
    console.log("Portes sumados en Fin:", cartera.portes);
  }

  if (cartera.seguroPeriodo === "Fin" && !cartera.seguro.includes("%")) {
    sumaCostosFin += parseFloat(cartera.seguro || 0);
    console.log("Seguro sumado en Fin:", cartera.seguro);
  }

  if (cartera.retencionPeriodo === "Fin" && !cartera.retencion.includes("%")) {
    sumaCostosFin += parseFloat(cartera.retencion || 0);
    console.log("Retención sumada en Fin:", cartera.retencion);
  }
  sumaCostosFin = parseFloat(sumaCostosFin.toFixed(2));
  console.log("Suma total de costos finales:", sumaCostosFin);

  // Calcular la retención
  let retencion = 0;
  if (cartera.retencion) {
    const retencionPorcentaje = cartera.retencion.includes("%")
      ? parseFloat(cartera.retencion.replace("%", "")) / 100
      : parseFloat(cartera.retencion);

    if (!isNaN(retencionPorcentaje) && retencionPorcentaje > 0) {
      retencion = valorNominal * retencionPorcentaje;
      retencion = parseFloat(retencion.toFixed(2));
      console.log("Retención calculada:", retencion);
    }
  }

  // Calcular el flujo
  const flujo = -valorNominal - sumaCostosFin + retencion;

  console.log("Flujo calculado:", flujo, {
    valorNominal,
    sumaCostosFin,
    retencion,
  });

  // Retornar el flujo positivo (sin el signo negativo)
  return Math.abs(flujo).toFixed(2);
},




    
calculateTCEA(letra, cartera) {
  if (!letra || !cartera || !letra.fechaVencimiento || !cartera.fechaDescuento) {
    console.warn("Datos incompletos o no válidos para calcular la TCEA.");
    return "0%";
  }

  const vencimiento = new Date(letra.fechaVencimiento);
  const descuento = new Date(cartera.fechaDescuento);
  if (isNaN(vencimiento.getTime()) || isNaN(descuento.getTime())) {
    console.warn("Fechas no válidas para el cálculo");
    return "0%";
  }
  const diffTime = vencimiento - descuento;
  const numeroDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (numeroDias === 0) {
    return "0%";
  }

  console.log("Número de días:", numeroDias);

  const diasPorAnio = parseInt(cartera.diasPorAnio);  // Asegúrate de declararla solo una vez aquí

  // Cálculo de TEP y D
  const tea = parseFloat(cartera.teaCompensatoria.replace("%", "")) / 100;
  const tep = Math.pow(1 + tea, numeroDias / diasPorAnio) - 1;
  const d = tep / (1 + tep) * 100;  // Convertir D a porcentaje aquí
  const descuentoValor = parseFloat(letra.valorNominal) * (d / 100);  // Asegúrate de usar d como un porcentaje

  console.log("TEP (%):", (tep * 100).toFixed(3), "d (%):", d.toFixed(3), "Descuento valor:", descuentoValor.toFixed(2));

  const valorNominal = parseFloat(letra.valorNominal) || 0;
  const valorNeto = valorNominal - descuentoValor;
  console.log("Valor nominal:", valorNominal, "Valor neto:", valorNeto.toFixed(2));

  let sumaCostosFin = 0;
  ['comisionActivacion', 'gastosAdministrativos', 'portes', 'seguro', 'retencion']
    .forEach(costo => {
      if (cartera[`${costo}Periodo`] === 'Fin') {
        sumaCostosFin += parseFloat(cartera[costo] || 0);
      }
    });

  let retencion = 0;
  if (cartera.retencion.includes("%")) {
    retencion = parseFloat(cartera.retencion.replace("%", "")) / 100 * valorNominal;
  } else {
    retencion = parseFloat(cartera.retencion) || 0;
  }

  const flujo = -(valorNominal + sumaCostosFin - retencion);
  const flujoPositivo = Math.abs(flujo); // Convierte el valor a positivo
  console.log("Flujo:", flujoPositivo);

  //--------

  let costoInicial = 0;
['comisionActivacion', 'gastosAdministrativos', 'portes', 'seguro', 'retencion']
  .forEach(costo => {
    if (cartera[`${costo}Periodo`] === 'Inicio' && !cartera[`${costo}`].includes("%")) {
      // Solo sumar si el costo está en el período de "Inicio" y no es un porcentaje
      costoInicial += parseFloat(cartera[`${costo}`] || 0);
    }
  });

    //----------

  const seguroCalculated = cartera.seguro.includes("%")
    ? parseFloat(cartera.seguro.replace("%", "")) / 100 * valorNominal * (numeroDias / 360)
    : parseFloat(cartera.seguro) || 0;
  const seguro = parseFloat(seguroCalculated.toFixed(2));

  const valorRecibir = valorNeto.toFixed(2) - costoInicial - seguro - retencion;
  console.log("Flujo:", valorNeto.toFixed(2), costoInicial, seguro, retencion);
  console.log("Valor a recibir:", valorRecibir.toFixed(2));

  console.log("Valor Neto:", valorNeto.toFixed(2), "Costo Inicial:", costoInicial, "Seguro:", seguro.toFixed(2), "Retención:", retencion.toFixed(2));
  console.log("Valor a recibir:", valorRecibir);
  console.log("Valor dias:", numeroDias);
  console.log("Valor flujo:", flujoPositivo);
  console.log("Valor diasXanio:", diasPorAnio);


  const base = flujoPositivo / valorRecibir;
  const exponente = diasPorAnio / numeroDias;
  const tcea = Math.pow(base, exponente) - 1;

  if (isNaN(tcea)) {
    console.warn("El cálculo de la TCEA resultó en un valor no numérico.");
    return "NaN%";
  }

  return `${(tcea * 100).toFixed(4)}%`; // Ajustado para mostrar 4 decimales

}

,





    logout() {
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      this.$router.push("/");
    },

    goBack() {
      this.$router.push("/home");
    },
    

    downloadReport(item) {
      alert(`Descargando el reporte para la letra N° ${item.numero}`);
      
    },
    filters:{
      formatFlujo(value) {
      const number = parseFloat(value);
      if (isNaN(number)) return "-";
      return number < 0 ? `(${Math.abs(number).toFixed(2)})` : number.toFixed(2);
    }
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
  justify-content: center;
  width: 100%;
  margin-top: auto;
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

.negative-flow {
  color: red;
  font-weight: bold;
}

</style>
