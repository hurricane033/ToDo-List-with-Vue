<template>
    <div class="flex flex-row justify-center items-center h-screen w-screen top-0 ">
        <div class="w-96 mx-4 h-96 bg-white opacity-80 dark:outline dark:outline-slate-700 dark:bg-slate-500 rounded-md shadow-md">
            <div class="text-center">
                <h1 class="p-4 text-2xl text-slate-800 dark:text-gray-300">Sign In</h1>
            </div>
            <hr class="mx-4">
            <div class="w-full px-10 mt-8">
                <div>
                    <label for="e-mail" class="block indent-2 text-slate-800 dark:text-gray-300">E-mail</label>
                    <input type="text" v-model="email" @keyup.enter="login" class=" w-full" id="e-mail" placeholder="Enter your E-mail...">
                </div>
                <div class="mt-3 relative">
                    <label for="password" class="block indent-2 text-slate-800 dark:text-gray-300">Password</label>
                    <div class="items-center">
                        <input type="password" v-model="password" @keyup.enter="login" class="w-full" id="password"
                            placeholder="Enter a password...">

                    </div>

                </div>
                <div class="mt-3 mx-1 flex w-full items-center justify-between">
                    <div>
                        <input type="checkbox" v-model="rememberMe" class="cursor-pointer size-2.5 hover:bg-slate-400 "
                            id="remember">
                        <label class="dark:text-gray-300" for="remember"> Remember me</label>
                    </div>
                </div>
                <div class="flex mt-2">
                <button type="submit" id="login-btn" @click="login"
                    class="mt-3 mx-auto self-center w-40 py-1 bg-slate-600 text-white rounded-full shadow-sm hover:bg-slate-700 hover:scale-105 active:bg-slate-800">Sign In</button>
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
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserSessionPersistence, browserLocalPersistence } from 'firebase/auth';
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const router = useRouter();
const rememberMe = ref(false);
const auth = getAuth();



const login = async () => {
   
    try {
        await setPersistence(auth, rememberMe.value ? browserLocalPersistence : browserSessionPersistence);
        await signInWithEmailAndPassword(auth, email.value, password.value);
        swal("Success", "Succesfully signed in!", "success");
        router.push('/todo')
    }
    catch (error) {
        let errorMessage;

        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = "The email address is invalid.";
                break;
            default:
                errorMessage = "The password/e-mail is incorrect.";
        }
        swal("Error", errorMessage, "error");
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