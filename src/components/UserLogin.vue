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
    const response = await axios.post('http://localhost:5000/login', {
      username: username.value,
      password: password.value
    })

    let data = response.data["message"]
    errorMessage.value = ''
    message.value = data

    router.push('/image-text-extractor')
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
  height: 70vh;
  background-color: #f5f5f5;
}

.login-title {
  margin-bottom: 20px;
  font-size: 2rem;
  color: #333;
}

.login-form {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 300px;
  max-width: 100%;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.login-button:hover {
  background-color: #0056b3;
}

.error-message {
  margin-top: 10px;
  color: #dc3545;
  font-size: 0.875rem;
}
.success-message {
  margin-top: 10px;
  color: green;
  font-size: rem;
}
</style>
