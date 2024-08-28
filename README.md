<h1>ToDo List</h3>
<summary>Table of Contents</summary>
  <ol>
        <li><a href="#introduction">Introduction</a></li>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#description">Description</a></li>
        <li><a href="#design">Design</a></li>
  </ol>

## Introduction

>I made a ToDo List website app using Vue, Vite and Tailwind. For the database I prefered Firestore and deployed the website in Firebase. It was a fun process for me, I learned almost all the elements from scratch. Here you will find a briefe description about the project 
My website looks like below, and if you want you can click the link and create your own todo list too: <a href="https://todo-list-bb153.web.app">My Website</a>  </p>

|<div><img src="src\assets\home page.png" alt="homepage" width="500" height="250"></div>| <div><img src="src\assets\sign up page.png" alt="sign up page" width="500" height="250"></div>|
| :---: |:---:|
|<div><img src="src\assets\sign in page.png" alt="sign in" width="500" height="250"></div>|<div><img src="src\assets\todo list page.png" alt="todo list page" width="500" height="250"></div>|



## Built With

* [![Vue][Vue.js]][Vue-url]
* [![Vite][Vite.js]][Vite-url]
* [![Tailwind CSS][TailwindCSS]][TailwindCSS-url]

## Installation

First download <a href="https://nodejs.org/en">node.js<a/> and install npm with

    npm install -g npm
    
Then install vue on your computer with

    npm install -g @vue/cli

and you also need vite 

    npm install --save-dev vite @vitejs/plugin-vue

for dark mode you can install vueuse

    npm install @vueuse/core



## Description

>My project has 4 pages and 2 components, you already saw the pages and the components are navigation bar and footer. Vue has an efficient way of using components for the iterating situations.

Project covers these features:
* Sign up with additional confirmation password
* Sign in with additional remember me
* Sign out 
* A spesific todo list for every user
* Editable List title
* Database and Hosting in Firebase/Firestore
* Add, edit and delete todos
* Filter list according to the completed status
* Dark Mode
* Security Precautions

### Sign in, Sign Up, Sign out

For authentication I used these functions in my project from firebase:

    import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

They helped me to connect my app with the database without any complex function writing.

    import { useRouter } from "vue-router";

I also used vue router to reach sign in sign up and sign out from my navigation bar.

Also firebase has documentation for easier error handling while using it. If you are interested: 
<a href="https://firebase.google.com/docs/auth/admin/errors?hl=tr">Admin Authentication API Errors</a>

### Spesific Todo List for Every User

In my main.js you can see that I have global propereties

    vueApp.config.globalProperties.$db = db;
    vueApp.config.globalProperties.$auth = auth;
    
to make an example I have a function for fetching todos like below

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

in my firebase database I have a collection named users this code gets the current user uid and finds it in users collection then fetchs the users saved todos. It ordered them with an descending order so I also added my todos collection a timestap. This way I ordered them with the ascending timestamp order.
I also implemented this in my add, edit and delete functions.

### Firebase 

It has really great features, easy to use in a project like this and beginner friendly. <a href="https://console.firebase.google.com/">Firebase</a>

### Edit Todo and Title

When you look at a todo item the todo is in a label form, and also has an hidden input area under it. With the help of two functions Edit and Complete I wrote the editing mode. 

### Filter List 

The checkbox has an important role in this function. I defined a boolean named todo.completed, and whenever the box is checked that boolean changed it's value with the help of v-model. That way I filtered the list according to the booleans value.

### Dark Mode

Tailwind has an esasy way to apply dark mode to your website. In class you can add whatever colors you want with dark: added before it. For further information: <a href="https://tailwindcss.com/docs/dark-mode">Using Tailwind CSS to style your site in dark mode</a>

### Security Precautions

Other then error handling to prevent from non-users to use the todo-list I wrote the code below:

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

this way if the user doesn't exist in the database it will route them to the login page and give an alert.

## Design
For design I went for a clean look with one of my favorite color. I used sweet alerts for a more clean look: <a href=""https://sweetalert.js.org/guides/>Sweet Alert</a>


    


<div align="center">
<img src="src\assets\todo.png" alt="Logo" width="130" height="40">
</div>

<!-- MARKDOWN LINKS & IMAGES -->
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Vite.js]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFFFFF
[Vite-url]: https://vitejs.dev/
[TailwindCSS]: https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=FFFFFF
[TailwindCSS-url]: https://tailwindcss.com/


  
