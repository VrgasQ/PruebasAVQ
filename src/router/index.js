import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Home from "../components/Home.vue";
import TypeForm from "../components/Cartera.vue"; // Importa TypeForm
import RegistrarNuevaLetra from '../components/RegistrarNuevaLetra.vue';
import CalculoTCEA from '../components/CalculoTCEA.vue';
import ListadoLetras from '../components/ListadoLetras.vue';
import Reporte from '../components/Reporte.vue';
import CalculoTCEACartera from '../components/CalculoTCEACartera.vue'; // Nuevo import
import VANyTIR from '../components/VANyTIR.vue'; // Nuevo import

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        props: true
    },
    {
        path: '/digit-planilla',
        name: 'TypeForm',
        component: TypeForm,
        props: true
    },
    {
        path: '/registrar-nueva-letra',
        name: 'RegistrarNuevaLetra',
        component: RegistrarNuevaLetra
    },
    {
        path: '/calculo-tcea',
        name: 'CalculoTCEA',
        component: CalculoTCEA
    },
    {
        path: '/listado-letras',
        name: 'ListadoLetras',
        component: ListadoLetras
    },
    {
        path: '/reporte',
        name: 'Reporte',
        component: Reporte
    },
    {
        path: '/calculo-tcea-cartera',
        name: 'CalculoTCEACartera',
        component: CalculoTCEACartera
    },
    {
        path: '/van-tir',
        name: 'VANyTIR',
        component: VANyTIR
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
