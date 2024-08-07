
<template>
  <div class="ocr-container">
    <form @submit.prevent="handleSubmit">
      <h2 class="title">Ai Tutor</h2>
      <p class="instructions">Upload a picture, and we'll help you read the assignment!</p>
      <input required type="file" @change="onFileChange" accept="image/*" class="file-input" />
      <textarea
        v-model="studentQuestion"
        placeholder="Type your question here..."
        class="question-input"
      ></textarea>
      <type type="button" @click="handleRecording" :disabled="isRecognizing">
        {{ isRecognizing ? 'Stop Recording' : 'Start Recording' }}
      </type>
      <div class="question-container">
        <input type="submit" class="submit-button" value="Submit" />
      </div>
    </form>
    <img id="uploaded-image" class="uploaded-image" alt="assignment" width="50%" />
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
const responseMessage = ref('')
const studentQuestion = ref('')
const isRecognizing = ref(false)
const isLoading = ref(false)
const text = ref('')
const audio_present = ref(false)

let mediaRecorder = null
let audioChunks = []

const onFileChange = async (file) => {
  if (file) {
    const reader = new FileReader()

    reader.onload = async (e) => {
      const dataUrl = e.target.result

      // Display the image
      console.log(dataUrl)
      const originalImg = document.getElementById('uploaded-image')
      if (originalImg) {
        originalImg.src = dataUrl
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

const handleRecording = async () => {
  if (isRecognizing.value) {
    // Stop recording
    audio_present.value = true
    if (mediaRecorder) {
      mediaRecorder.stop()
      isRecognizing.value = false
      console.log('Recording stopped.')
    }
  }
  // Start recording
  else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder = new MediaRecorder(stream)
      audioChunks = [] // Reset audio chunks

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data)
          console.log('Audio chunk available:', event.data.size)
        }
      }

      mediaRecorder.onstop = async () => {
        console.log('Recording stopped.')
        if (audioChunks.length > 0) {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
          const audioUrl = URL.createObjectURL(audioBlob)
          console.log('Audio Blob URL:', audioUrl)

          // Optional: Verify the audio data size
          console.log('Audio Blob size:', audioBlob.size)

          // Optionally, create a File from Blob and append it to FormData
          const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' })
          console.log('Audio File:', audioFile)

          // Optionally, perform further actions with the File
        } else {
          console.warn('No audio chunks available.')
        }
      }

      mediaRecorder.start()
      isRecognizing.value = true
    } catch (error) {
      console.error('Error accessing media devices:', error)
      isRecognizing.value = false
    }
  } else {
    alert('Media Devices not supported')
  }
}

// Attach handleRecording to a single button's click event
const handleSubmit = async (event) => {
  event.preventDefault()
  isLoading.value = true

  const formData = new FormData()

  // Append image if available

  formData.append('text', text)

  // Append text
  formData.append('studentQuestion', studentQuestion.value)

  // Append audio file if available
  if (audio_present.value) {
    if (audioChunks.length > 0) {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
      const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' })
      formData.append('audio', audioFile)
    }
  }
  try {
    const response = await axios.post('https://bluetutor-backend.vercel.app/tutor/text', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    responseMessage.value = response.data.message
  } catch (error) {
    console.error('Error sending data:', error)
    responseMessage.value = 'Failed to send data.'
  } finally {
    isLoading.value = false
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
/* Add your CSS styles here */
.file-input,
.question-input,
.submit-button {
  display: block;
  margin: 10px auto;
}
.uploaded-image {
  display: block;
  margin: 10px auto;
}
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 40px;
  height: 40px;
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



@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

