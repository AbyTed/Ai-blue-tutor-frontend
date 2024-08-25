
<template>
  <div class="login-container">
    <h1 class="login-title">Login</h1>
    <form @submit.prevent="handleLogin" class="login-form">
      <div v-if="message" class="success-message">{{ message }}</div>
      <div class="form-group">
        <label for="username">Username:</label>
        <input
          type="text"
          id="username"
          v-model="username"
          required
          placeholder="Enter your username"
        />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          placeholder="Enter your password"
        />
      </div>
      <button type="submit" class="login-button" :disabled="isLoading">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const message = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const router = useRouter()

const handleLogin = async () => {
  isLoading.value = true
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_SERVER_PRODUCTION}/login`, {
      username: username.value,
      password: password.value
    })
    
    let data = response.data['message']
    errorMessage.value = ''
    message.value = data
    
    router.push('/login/blueTutor')
    
  } catch (error) {
    console.error('Login failed:', error)
    message.value = ''
    errorMessage.value = 'Invalid username or password.'
  } finally {
    isLoading.value = false
  }
}
</script>




<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 95vh; /* Full viewport height for better centering */
  background-color: #f5f5f5;
  padding: 20px; /* Add padding for responsiveness */
}

.login-title {
  margin-bottom: 20px;
  font-size: 2.5rem; /* Slightly larger title for prominence */
  color: #333;
  font-weight: 600; /* Slightly bolder title */
}

.login-form {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Slightly larger shadow for depth */
  padding: 50px 45px 40px 20px; /* Increased padding for a spacious look */
  width: 100%;
  max-width: 700px;
  max-height: 700px; /* Adjust max-width for better scaling on larger screens */
}

.form-group {
  margin-bottom: 20px; /* Increased margin for better spacing */
}

.form-group label {
  display: block;
  margin-bottom: 8px; /* Increased margin for better readability */
  font-weight: 500; /* Medium weight for labels */
  color: #555; /* Slightly lighter color for labels */
}

.form-group input {
  width: 100%;
  padding: 12px; /* Increased padding for better touch targets */
  border: 1px solid #ccc; /* Light border color for a subtle look */
  border-radius: 4px;
  font-size: 1rem; /* Consistent font size */
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease; /* Smooth transition for hover effect */
}

.login-button:hover {
  background-color: #0056b3;
}



.success-message {
  color: #28a745; /* Updated color for success */
  font-size: 0.875rem; /* Consistent font size with error message */
}

</style>
