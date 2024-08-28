<template>
    <div class="flex justify-center overflow-hidden h-screen w-screen top-0 ">
        <div class="h-screen justify-center w-screen self-center">
            <!-- Title display and editing -->
            <div class=" top-20 absolute w-full flex justify-center">
                <h1 v-if="!mtitle.editing" @dblclick="titleEdit"
                    class="p-4 text-4xl text-slate-200 dark:text-slate-300">{{ maintitle }}
                </h1>
                <input v-else maxlength="32" v-focus v-model="maintitle" @keyup.enter="doneTitleEdit"
                    @blur="doneTitleEdit" class="p-4 text-3xl text-slate-700 rounded-none border-none top-2">
            </div>
        </div>

        <!-- Filter buttons -->
        <div class=" relative right-8 scale-90 min-md:scale-100 w-fit top-20 gap-1 flex flex-col ">
            <button :class="{ active: filter == 'all' }" @click="filter = 'all'"
                class="px-10 rounded-sm bg-slate-300 dark:bg-slate-400 border-r-slate-600 hover:bg-slate-200 focus:bg-slate-600 focus:translate-y-0.5">All</button>
            <button type="button" :class="{ active: filter == 'active' }" @click="filter = 'active'"
                class="px-7 rounded-sm bg-slate-300 shadow-md dark:bg-slate-400 border-r-slate-600 hover:bg-slate-200 focus:bg-slate-600 focus:translate-y-0.5">Active</button>
            <button type="button" :class="{ active: filter == 'completed' }" @click="filter = 'completed'"
                class="px-3 rounded-sm bg-slate-300 hover:bg-slate-200 dark:bg-slate-400 focus:bg-slate-600 focus:translate-y-0.5">Completed</button>
        </div>

        <!-- Todo list -->
        <div
            class="mt-8 items-start self-center overflow-y-auto overflow-x-hidden h-80 w-2/3 absolute flex justify-center">
            <ul class=" h-84 w-full flex flex-col justify-center">
                <li v-for="(todo, index) in todosFiltered" :key="todo.id" @dblclick="editToDo(todo)"
                    class="px-4 my-0.5 rounded-lg h-auto border-2 border-slate-200 dark:border-slate-500 dark:hover:bg-slate-400 dark:bg-slate-600 bg-slate-300 hover:bg-slate-200 flex items-center">

                    <input id="checkbox" type="checkbox" v-model="todo.completed" @click="Complete(todo)"
                        class="w-4 h-4 cursor-pointer bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-700">
                    <label for="checkbox" v-if="!todo.editing"
                        :class="{ 'line-through text-slate-600 opacity-90': todo.completed }"
                        class=" mx-5 w-max-full h-min-32 py-3 text-md font-medium text-gray-900 dark:text-gray-300">
                        {{ todo.title }}
                    </label>
                    <input v-focus v-model="todo.title" @keyup.enter="doneEdit(todo)" @blur="doneEdit(todo)" v-else
                        class="rounded-none border-none r-0  w-fit h-min-32 py-2 text-md font-medium text-gray-900 dark:text-gray-300">

                    <button type="button" @click="RemoveTodo(index)"
                        class="right-2 absolute hover:bg-white dark:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </li>
            </ul>
        </div>

        <!-- Input for new todo -->
        <div class=" fixed justify-center flex  w-1/2 bottom-12 items-center">
            <input maxlength="120" type="text" v-model="newTodo" @keyup.enter="addTodo"
                class=" w-full border-b-2 mr-2 bg-slate-200 dark:border-slate-500 dark:hover:bg-slate-500 dark:bg-slate-600 border-b-slate-800 opacity-75 hover:opacity-80 focus:opacity-90"
                placeholder="Type your goals!">
            <button type="submit" @click="addTodo"
                class="rounded-lg border-2  text-slate-900  bg-slate-350 hover:bg-slate-200 dark:bg-slate-600 dark:border-slate-500 dark:hover:bg-slate-400 px-2 py-1.5">Create</button>
        </div>
    </div>

</template>

<script>
import { collection, getDocs, addDoc, Timestamp, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from "vue-router";


export default {
    data() {
        return {
            maintitle: 'Your ToDo List Title',
            mtitle: {
                editing: false
            },
            newTodo: '',
            todos: [],
            titleDocId: '',
            beforeEditTitle: '',
            beforeEditCache: '',
            filter: 'all',
            user: null,
        };
    },

    computed: {
        todosFiltered() {
            if (this.filter == 'all') {
                return this.todos
            }
            else if (this.filter == 'active') {
                return this.todos.filter(todo => !todo.completed)
            }
            else if (this.filter == 'completed') {
                return this.todos.filter(todo => todo.completed)
            }

            return this.todos
        },
    },

    methods: {
        async fetchTodos() {
            if (!this.user) return;
            try {
                const q = query(collection(this.$db, `users/${this.user.uid}/todos`), orderBy('timestamp', 'asc'));
                const querySnapshot = await getDocs(q);

                this.todos = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    title: doc.data().title,
                    completed: doc.data().completed,
                    timestamp: doc.data().timestamp?.toDate()
                }));

            } catch (error) {
                console.error("Error fetching todos: ", error);
                swal("Error", "An error occurred.", "error");
            }
        },

        async Complete(todo) {
            if (!this.user) return;
            try {
                const todoDocRef = doc(this.$db, `users/${this.user.uid}/todos`, todo.id);
                await updateDoc(todoDocRef, {
                    completed: !todo.completed
                });

            } catch (error) {
                console.error("Error updating completed status: ", error);
                swal("Error", "An error occurred.", "error");
            }
        },

        async fetchTitle() {
            if (!this.user) return;

            try {
                const collectionRef = collection(this.$db, `users/${this.user.uid}/maintitle`);
                const querySnapshot = await getDocs(collectionRef);

                if (querySnapshot.empty) {
                    const defaultTitle = "Your ToDo List Title";
                    const docRef = await addDoc(collectionRef, {
                        mtitle: defaultTitle
                    });
                    this.maintitle = defaultTitle;
                    this.titleDocId = docRef.id;

                } else {
                    const doc = querySnapshot.docs[0];
                    this.titleDocId = doc.id;
                    this.maintitle = doc.data().mtitle;
                }
            } catch (error) {
                console.error("Error fetching title: ", error);
                swal("Error", "An error occurred.", "error");
            }
        },

        async addTodo() {
            if (!this.user) return;
            if (this.newTodo.trim().length === 0) {
                return;
            }
            const newTodoItem = {
                title: this.newTodo,
                completed: false,
                timestamp: Timestamp.fromDate(new Date())
            };

            try {
                const docRef = await addDoc(collection(this.$db, `users/${this.user.uid}/todos`), newTodoItem);

                this.todos.push({
                    id: docRef.id,
                    ...newTodoItem
                });

                this.newTodo = '';
            } catch (error) {
                console.error("Error adding todo: ", error);
                swal("Error", "An error occurred.", "error");
            }
        },

        async RemoveTodo(index) {
            if (!this.user) return;
            const todoToDelete = this.todos[index];
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this todo!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        try {
                            deleteDoc(doc(this.$db, `users/${this.user.uid}/todos`, todoToDelete.id));
                            this.todos.splice(index, 1);
                        }
                        catch (error) {
                            console.error("Error deleting todo: ", error);
                            swal("Error", "An error occurred.", "error");
                        }
                        swal("Poof! Your todo has been deleted!", {
                            icon: "success",
                        });
                    } else {
                        swal("Your todo is safe!");
                    }
                });

        },

        editToDo(todo) {
            this.beforeEditCache = todo.title;
            todo.editing = true;
        },

        async doneEdit(todo) {
            if (!this.user) return;
            if (todo.title.trim().length === 0) {
                todo.title = this.beforeEditCache;
            }
            todo.editing = false;
            try {
                const todoDocRef = doc(this.$db, `users/${this.user.uid}/todos`, todo.id);
                await updateDoc(todoDocRef, {
                    title: todo.title
                });
            } catch (error) {
                console.error("Error updating todo: ", error);
                swal("Error", "An error occurred.", "error");
            }
        },

        titleEdit() {
            this.beforeEditTitle = this.maintitle;
            this.mtitle.editing = true;
        },

        async doneTitleEdit() {
            if (!this.user) return;
            if (this.maintitle.trim().length === 0) {
                this.maintitle = this.beforeEditTitle;
            }
            this.mtitle.editing = false;
            try {

                const titleDocRef = doc(this.$db, `users/${this.user.uid}/maintitle`, this.titleDocId);
                await updateDoc(titleDocRef, {
                    mtitle: this.maintitle
                });
            } catch (error) {
                console.error("Error updating main title: ", error);
                swal("Error", "An error occurred.", "error");
            }
        },
    },

    mounted() {
        const router = useRouter();
        const auth = getAuth();
        onAuthStateChanged(this.$auth, (user) => {
            this.user = user;
            if (user) {
                this.fetchTodos();
                this.fetchTitle();
            } else {
                router.push('/login');
                swal("Cautious", "Please sign in!");
            }
        });
    },

    directives: {
        focus: {
            mounted(el) {
                el.focus();
            }
        }
    },
};
</script>
