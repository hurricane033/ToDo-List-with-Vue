<template>
  <div id="app">
    <Navigation />

    <router-view></router-view>

    <Footer />
  </div>

</template>

<script>
import Register from './pages/Register.vue';
import Login from './pages/Login.vue';
import Navigation from './components/Navigation.vue';
import ToDo from './pages/ToDo.vue';
import Footer from './components/Footer.vue';
import Home from './pages/Home.vue';


export default {
  name: 'App',
  components: {
    Home,
    ToDo,
    Navigation,
    Footer,
    Login,
    Register
  }
}
</script>

<style></style>
