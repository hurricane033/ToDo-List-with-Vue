<template>
    <div class="flex flex-row justify-center items-center h-screen w-screen top-0 ">
        <div class="w-96 h-96 mx-4 bg-white dark:shadow-2xl dark:outline dark:outline-slate-700 dark:bg-slate-500 opacity-80 rounded-md shadow-md">
            <div class="text-center">
                <h1 class="p-4 text-2xl text-slate-800 dark:text-gray-300">Sign Up</h1>
            </div>
            <hr class="mx-4">
            <div class="w-full px-10 mt-4">
                <div>
                    <label for="e-mail" class="block indent-2 text-slate-800 dark:text-gray-300">E-mail</label>
                    <input type="text" class="w-full" @keyup.enter="register" v-model="email" id="e-mail" placeholder="Enter your E-mail...">
                </div>
                <div class="mt-3 relative">
                    <label for="password" class="block indent-2 text-slate-800 dark:text-gray-300">Password</label>
                    <div class="items-center">
                        <input type="password" class="w-full" @keyup.enter="register" v-model="password" id="password"
                            placeholder="Enter a password...">
                    </div>
                </div>
                <div class="mt-3">
                    <label for="confirmation" class="block indent-2 text-slate-800 dark:text-gray-300">Password
                        (Again)</label>
                    <input type="password" @keyup.enter="register" v-model="confirmation" class="w-full" id="confirmation"
                        placeholder="Confirm your password...">
                </div>
                <div class="flex mt-2">
                <button type="submit" id="register-btn" @click="register"
                    class="mt-3 mx-auto self-center w-40 py-1 bg-slate-600 text-white rounded-full shadow-sm hover:bg-slate-700 hover:scale-105 active:bg-slate-800">Sign Up</button>
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
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const confirmation = ref("");
const router = useRouter();
const auth = getAuth();

const register = () => {

    if (password.value.length < 6) {
        swal("Error", "Your password must be at least 6 characters long!", "error");
        return;
    }

    if (password.value !== confirmation.value) {
        swal("Error", "Passwords don't match", "error");
        return;
    }

    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then(() => {
            swal("Success", "Successfully signed up!", "success");
            router.push('/todo');
        })
        .catch((error) => {
            handleAuthError(error);
        });
};

function handleAuthError(error) {
    let errorMessage;
    switch (error.code) {
        case 'auth/email-already-in-use':
            errorMessage = "This email address is already in use.";
            break;
        case 'auth/invalid-email':
            errorMessage = "The email address is invalid.";
            break;
        case 'auth/weak-password':
            errorMessage = "The password is too weak.";
            break;
        default:
            errorMessage = `An unknown error occurred: ${error.message}`;
    }
    swal("Error",errorMessage, "error");
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