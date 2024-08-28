import { createApp } from 'vue';
import App from './App.vue';
import './index.css';
import router from './router';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import swal from 'sweetalert';



const app = initializeApp(firebaseConfig);



const db = getFirestore(app);
const auth = getAuth(app);


const vueApp = createApp(App);
vueApp.config.globalProperties.$db = db;
vueApp.config.globalProperties.$auth = auth;
vueApp.use(router);
vueApp.mount('#app');
