<template>
    <div class="w-full h-full">
        <div class="flex justify-center items-center h-screen w-screen top-0 ">
            <div class=" mx-4 w-1/2 h-80 bg-white dark:bg-slate-500 opacity-80 rounded-md border-4 border-dotted dark:border-gray-600 border-gray-200 shadow-lg flex flex-col text-center justify-center">
                <h1 class="font-cursive text-slate-800 dark:text-gray-300 mb-5 text-4xl font-bold">ToDo List</h1>
                <hr class="mx-10 dark:border-gray-700 ">
                <h2 class="mx-5 my-4 text-lg dark:text-gray-400">Welcome to ToDo List please Login or Register to contuniue!
                </h2>
                <div>
                    <button type="button" @click="login"
                        class="text-slate-800 dark:text-gray-300 dark:hover:text-gray-200 w-1/2 py-1 self-center underline hover:scale-110">Login</button>
                    <button type="button" @click="register"
                        class="text-slate-800 dark:text-gray-300 dark:hover:text-gray-200 mt-5 w-1/2 py-1 self-center underline hover:scale-110 ">Register</button>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
export default {};
</script>

<script setup>

import { ref, onMounted } from "vue";
import { getAuth, onAuthStateChanged, } from 'firebase/auth';
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const router = useRouter();
const rememberMe = ref(false);


const login = async () => {
    const auth = getAuth();
    try {
        router.push('/login')
    }
    catch (error) {
        let errorMessage = "An error occurred. Please try again.";
        alert(errorMessage);
    }
};
const register = async () => {
    const auth = getAuth();
    try {
        router.push('/register')
    }
    catch (error) {
        let errorMessage = "An error occurred. Please try again.";
        alert(errorMessage);
    }
};

onMounted(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            router.push('/todo');
        }
    });
});
</script>