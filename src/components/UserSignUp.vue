<template>
  <div class="signup-container">
    <h1 class="signup-title">Sign Up</h1>
    <form @submit.prevent="handleSignUp" class="signup-form">
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
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required placeholder="Enter your email" />
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
      <div class="form-group">
        <label for="confirm-password">Confirm Password:</label>
        <input
          type="password"
          id="confirm-password"
          v-model="confirmPassword"
          required
          placeholder="Confirm your password"
        />
      </div> <button type="submit" class="signup-button">Sign Up</button>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const message = ref('')
const errorMessage = ref('')

const handleSignUp = async () => {
  if (password.value !== confirmPassword.value) {
    message.value = 'Passwords do not match.'
    return
  }
  try {
    axios.defaults.withCredentials = true
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_SERVER_PRODUCTION}/signup`, {
      username: username.value,
      email: email.value,
      password: password.value
    })

    let data = response.data['message']
    // Reset error message
    message.value = data
  } catch (error) {
    console.error('Sign up failed:', error)
    errorMessage.value = 'Sign up failed, change username or email'
  }
}
</script>

<style scoped>
.signup-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 95vh; /* Full viewport height for better centering */
  background-color: #f5f5f5;
  padding: 20px; /* Add padding for responsiveness */
}

.signup-title {
  margin-bottom: 30px; /* Increased margin for better spacing */
  font-size: 2.5rem; /* Larger title for prominence */
  color: #333;
  font-weight: 600; /* Slightly bolder title */
}

.signup-form {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Enhanced shadow for depth */
  padding: 30px; /* Increased padding for a spacious look */
  width: 100%;
  max-width: 400px; /* Adjust max-width for better scaling */
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
  border: 1px solid #ccc; /* Subtle border color */
  border-radius: 4px;
  font-size: 1rem; /* Consistent font size */
}

.signup-button {
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

.signup-button:hover {
  background-color: #0056b3;
}

.error-message {
  margin-top: 15px; /* Increased margin for better spacing */
  color: #dc3545;
  font-size: 0.875rem;
}
</style>

