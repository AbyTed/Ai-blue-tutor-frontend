<template>
  <div class="ocr-container">
    <h2 class="title">Image Text Extractor</h2>
    <p class="instructions">Upload a picture, and we'll help you read the text!</p>
    <input @change="onFileChange" type="file" accept="image/*" class="file-input" />
    <textarea
      v-model="studentQuestion"
      placeholder="Type your question here..."
      class="question-input"
    ></textarea>
    <div class="question-container">
      <button class="submit-button" @click="sendData">Submit</button>
    </div>
    <img id="uploaded-image" class="uploaded-image" width="50%" />
    <div v-if="isLoading" class="loading-sign">
      <div class="spinner"></div>
      <p>Processing...</p>
    </div>
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
const text = ref(null)
const responseMessage = ref('')
const studentQuestion = ref('')

const onFileChange = async (event) => {
  text.value = null
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const dataUrl = e.target.result

      // Display the image
      const imgElement = document.getElementById('uploaded-image')
      if (imgElement) {
        imgElement.src = dataUrl
      } else {
        console.error('Image element not found.')
      }

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
          text.value =
            result.data.text + 'everything beyond this is to clairify:' + studentQuestion.value
          await sendData()
        } catch (error) {
          console.error('OCR failed:', error)
          text.value = 'Failed to extract text.'
        }
      }
    }
    reader.readAsDataURL(file)
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const sendData = async () => {
  
  await delay(5000);

  console.log('Sending data:', text.value) // Log the data being sent
  try {
    const response = await axios.post(`http://localhost:5000/tutor/text`, {
      data: text.value
    })

    console.log('Response received:', response.data) // Log the response data
    responseMessage.value = response.data['message'] // Adjust according to your response structure
  } catch (error) {
    console.error('Error sending data:', error)
    responseMessage.value = 'Failed to send data.'
  }
}
</script>

<style scoped>
.question-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  background: #f9f9f9;
  max-width: 600px;
  margin: auto;
}

.title {
  font-size: 2rem;
  color: #4a90e2;
  margin-bottom: 10px;
}

.question-input {
  width: 100%;
  height: 150px;
  padding: 10px;
  border: 2px solid #4a90e2;
  border-radius: 5px;
  font-size: 1rem;
  margin-bottom: 20px;
  resize: vertical;
}

.submit-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background: #4a90e2;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.submit-button:hover {
  background: #357abd;
}

.response-message {
  font-size: 1rem;
  color: #d9534f;
  margin-top: 20px;
  text-align: center;
}
.title {
  font-size: 2rem;
  color: #4a90e2;
  margin-bottom: 10px;
}

.instructions {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 20px;
  text-align: center;
}

.file-input {
  margin-bottom: 20px;
  padding: 10px;
  border: 2px solid #4a90e2;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  background: #eaf4fc;
}

.uploaded-image {
  max-width: 80%;
  height: auto;
  border: 2px solid #4a90e2;
  border-radius: 10px;
  margin-top: 20px;
}

.help {
  font-size: 1rem;
  color: #d9534f;
  margin-top: 20px;
  text-align: center;
}
.ocr-container {
  text-align: center;
}

.loading-sign {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* Make sure it's on top */
}

.spinner {
  border: 8px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 8px solid #3498db;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

