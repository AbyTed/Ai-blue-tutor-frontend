<template>
  <div class="ocr-container">
    <h2>Image Text Extractor</h2>
    <input type="file" @change="onFileChange" accept="image/*" />

    <p v-if="text">{{ text }}</p>
    <p class="help" v-if="responseMessage">
      {{ responseMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Tesseract from 'tesseract.js'
import axios from 'axios'

const grayscaleImage = ref(null)
const text = ref('')
const responseMessage = ref('')
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const onFileChange = async (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const dataUrl = e.target.result
      const img = new Image()
      img.src = dataUrl
      img.onload = async () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        // Convert to grayscale
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
          data[i] = avg // Red
          data[i + 1] = avg // Green
          data[i + 2] = avg // Blue
        }
        ctx.putImageData(imageData, 0, 0)

        // Apply thresholding
        const threshold = 128
        for (let i = 0; i < data.length; i += 4) {
          const avg = data[i] // Since it's grayscale, R=G=B
          const binary = avg > threshold ? 255 : 0
          data[i] = binary // Red
          data[i + 1] = binary // Green
          data[i + 2] = binary // Blue
        }
        ctx.putImageData(imageData, 0, 0)

        grayscaleImage.value = canvas.toDataURL('image/png')

        // Perform OCR
        try {
          const result = await Tesseract.recognize(grayscaleImage.value, 'eng', {
            logger: (info) => console.log(info) // Optional: Log progress
          })
          text.value = result.data.text
          
        } catch (error) {
          console.error('OCR failed:', error)
          text.value = 'Failed to extract text.'
        }
      }
    }
    reader.readAsDataURL(file)
  }
}



const sendData = async () => {
  console.log('Sending data:', text.value) // Log the data being sent
  try {
    const response = await axios.post(`http://localhost:5000/tutor/text`, {
      data: text.value
    })

    console.log('Response received:', response.data) // Log the response data
    responseMessage.value = response.data.message // Adjust according to your response structure
  } catch (error) {
    console.error('Error sending data:', error)
    responseMessage.value = 'Failed to send data.'
  }
}
</script>

<style scoped>

.container {
  color: black;
  border: 5px solid lightblue;
  border-radius: 5px;
  background-color: lightgreen;
  padding: 5px;
}
.ocr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

input[type='file'] {
  margin-bottom: 1rem;
}

button {
  margin-bottom: 1rem;
}

h2 {
  margin-bottom: 1rem;
}

h3 {
  margin-top: 1rem;
}
</style>

