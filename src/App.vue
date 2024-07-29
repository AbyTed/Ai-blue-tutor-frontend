<script setup>
import { ref } from 'vue'
import UserLogin from './components/UserLogin.vue'
import UserSignUp from './components/UserSignUp.vue'

const currentPage = ref(UserSignUp) // Default to UserLogin

const showPage = (page) => {
  currentPage.value = page
}
</script>
<template>
  <div id="app">
    <header>
      <div class="heading">
        <h1>Welcome to Blue Tutor</h1>
      </div>
      <nav>
        <button @click="showPage(UserLogin)" class="nav-button">Login</button>
        <button @click="showPage(UserSignUp)" class="nav-button">Sign Up</button>
      </nav>
    </header>
    <main>
      <component :is="currentPage" />
    </main>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}
.heading {
  text-align: center;
  padding: 1rem 0 1rem;
  border: 1rem;
  border-color: black;
  border-radius: 5%;
  color: rgb(53, 167, 233);
}
@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.nav-button {
  background-color: #ffffff; /* White background */
  border: 2px solid #003366; /* Dark blue border */
  color: #003366; /* Dark blue text */
  font-size: 1rem;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

.nav-button:hover {
  background-color: #003366; /* Dark blue background on hover */
  color: #ffffff; /* White text on hover */
  border-color: #003366; /* Dark blue border on hover */
}

.nav-button:active {
  background-color: #002244; /* Even darker blue when active */
  color: #ffffff; /* White text when active */
}
</style>
