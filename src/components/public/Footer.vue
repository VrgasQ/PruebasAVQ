<template>
  <div class="page-container">
    <main class="content">
      <!-- Aquí va el contenido de tu página -->
    </main>
    <footer class="footer">
      <div class="footer-content">
        <img src="../../assets/Logo.png" alt="EcoMarket Logo" class="logo" />
        <span class="footer-text">ECOMARKET</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Changa:wght@500&display=swap');

html, body {
  height: 100%; /* Asegura que el HTML y el cuerpo ocupen toda la altura de la ventana */
  margin: 0; /* Elimina el margen por defecto */
}

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Asegura que el contenedor ocupe al menos la altura de la ventana */
}

.content {
  flex: 1; /* Permite que el contenido crezca y ocupe el espacio disponible */
  display: flex;
  justify-content: center;
  align-items: center; /* Centra el contenido */
  position: relative;
  margin-bottom: 100px; /* Espacio para que el footer no se superponga */
}

.footer {
  background-color: rgba(49, 87, 44, 1);
  padding: 5px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
  position: absolute; /* Cambiado a absolute para que se posicione en relación a su contenedor */
  bottom: 0; /* Lo coloca en la parte inferior del contenedor */
}

.footer-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 80px;
  height: 80px;
}

.footer-text {
  font-family: 'Changa', sans-serif;
  font-weight: 500;
  font-size: 60px;
}
</style>
