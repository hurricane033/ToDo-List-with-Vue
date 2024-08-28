<template>
    <div class="w-full absolute h-full">
        <div class="w-full h-16 sticky shadow-md ">
            <ul class="w-full h-16 flex items-center">
                <li class="ml-6 dark:text-slate-400 dark:hover:text-slate-300 text-slate-800 hover:text-slate-900 "><button @click="toggleDark()"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                        </svg>
                    </button></li>
                <li class="items-center flex">
                    <RouterLink to="/register" v-if="isLoginPage"
                        class="mr-6 right-0 fixed text-md hover:text-slate-100 text-slate-300 dark:text-slate-400 ">Sign
                        Up</RouterLink>
                    <RouterLink to="/login" v-else-if="isRegisterPage"
                        class="mr-6 right-0 fixed text-md hover:text-slate-100 text-slate-300 dark:text-slate-400">Sign
                        In</RouterLink>
                    <div v-else-if="isToDoPage" @click="logout"
                        class="mr-6 right-0 fixed cursor-pointer text-md hover:text-slate-100 text-slate-300 dark:text-slate-400">
                        Sign Out</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

export default {

    computed: {
        isLoginPage() {
            return this.$route.name === 'Login';
        },
        isRegisterPage() {
            return this.$route.name === 'Register';
        },
        isToDoPage() {
            return this.$route.name === 'ToDo';
        }
    },
};
</script>

<script setup>
import { useRouter } from 'vue-router';
import { getAuth, signOut } from 'firebase/auth';
import { useDark, useToggle } from '@vueuse/core';

const isDark = useDark()
const toggleDark = useToggle(isDark)
const router = useRouter()

const logout = () => {
    signOut(getAuth()).then(() => {
        swal("Success", "Succesfully signed out!", "success")
        router.push('/login')
    });
};

</script>