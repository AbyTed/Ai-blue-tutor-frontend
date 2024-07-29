<script setup>
</script>
<template>
  <div id="app">
    <header></header>
    <main>
      <router-view></router-view>
    </main>
    <nav aria-label="Main Navigation">
      <router-link to="/" class="nav-button">Home</router-link>
      <router-link to="/login" class="nav-button">Login</router-link>
      <router-link to="/signup" class="nav-button">Sign Up</router-link>
    </nav>
  </div>
</template>


<style scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 90vh;
}

main {
  flex: 1;
  /* Main content styling */
}

.nav-bar {
  display: flex;
  justify-content: center;
  background-color: #add8e6; /* Light blue color */
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.nav-button {
  background: #ffffff;
  border: none;
  border-radius: 4px;
  color: #333;
  padding: 10px 20px;
  margin: 0 5px;
  font-size: 1rem;
  text-decoration: none; /* Remove underline from router-link */
  display: inline-block;
  transition: background 0.3s, color 0.3s;
}

.nav-button:hover {
  background-color: #f0f8ff; /* Slightly lighter blue */
  color: #000;
}
header {
  line-height: 1.5;
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

.nav-button:active {
  background-color: #002244; /* Even darker blue when active */
  color: #ffffff; /* White text when active */
}
.item {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center items horizontally */
  justify-content: center; /* Center items vertically */
  text-align: center; /* Center text */
  margin-top: 2rem;
}

.details {
  margin-left: 1rem; /* Adjust this as needed */
}

i {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--color-text);
}

.heading {
  margin: 1rem 0;
  padding: 1rem;
  border: 2px solid black;
  border-radius: 5%;
  color: rgb(53, 167, 233);
}

h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

h3 {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

p {
  font-size: 1rem;
  color: var(--color-text);
  max-width: 600px; /* Optional: limit the width of the text block */
}
</style>
