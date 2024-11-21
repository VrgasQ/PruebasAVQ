<template>
  <div id="app">
    <!-- Aquí es donde Vue Router cargará los componentes -->
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script>
import Footer from './components/public/Footer.vue';

export default {
  components: {
    Footer
  }
};
</script>

<style>
#app {
  /* Estilos para el contenedor principal */
}
</style>
