<script setup>
import { ref } from 'vue'
import UserLogin from './components/UserLogin.vue'
import UserSignUp from './components/UserSignUp.vue'
import WelcomeItem from './components/WelcomeItem.vue'
const currentPage = ref(UserLogin) // Default to UserLogin

const showPage = (page) => {
  currentPage.value = page
}
</script>
<template>
  <div id="app">
    <welcome-item />
    <header></header>
    <main>
      <component :is="currentPage" />
    </main>
    <nav>
      <button @click="showPage(UserLogin)" class="nav-button">Login</button>
      <button @click="showPage(UserSignUp)" class="nav-button">Sign Up</button>
    </nav>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}
#app {
  align-content: center;
}
.logo {
  display: block;
  margin: 0 auto 2rem;
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
