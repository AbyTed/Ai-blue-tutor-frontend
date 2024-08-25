
<template>
  <div class="ocr-container">
    <form @submit.prevent="handleSubmit">
      <h2 class="title">Ai English Tutor</h2>
      <p class="instructions">Upload a picture, and we'll help you on your assignment!</p>
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
    <img
      id="uploaded-image"
      class="uploaded-image"
      alt="your assignment displayed here"
      width="50%"
    />

    <div v-if="isLoading" class="loading-sign">
      <div class="spinner"></div>
      <p>Processing...</p>
    </div>

    <p class="help" :class="messageType" v-if="responseMessage">
      {{ responseMessage }}
    </p>
    <div class="audio-player">
      <audio v-if="audioUrl" controls :src="audioUrl"></audio>
    </div>
  </div>
</template>

<script setup >
import { ref } from 'vue'
import Tesseract from 'tesseract.js'
import axios from 'axios'

const audioUrl = ref('')
const grayscaleImage = ref(null)
const responseMessage = ref('')
const studentQuestion = ref('')
const isRecognizing = ref(false)
const isLoading = ref(false)
const text = ref('')
const audio_present = ref(false)
const messageType = ref('')
let mediaRecorder = null
let audioChunks = []

const processImage = async (dataUrl) => {
  const img = new Image()
  img.src = dataUrl

  return new Promise((resolve) => {
    img.onload = () => {
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
      const grayscaleDataUrl = canvas.toDataURL('image/png')
      resolve(grayscaleDataUrl)
    }
  })
}

const performOCR = async (imageUrl) => {
  try {
    const result = await Tesseract.recognize(imageUrl, 'eng', {
      logger: (info) => console.log(info) // Optional: Log progress
    })
    return result.data.text
  } catch (error) {
    console.error('OCR failed:', error)
    throw new Error('Failed to extract text.')
  }
}

const onFileChange = async (event) => {
  const file = event.target.files[0]
  text.value = null

  if (file) {
    const reader = new FileReader()

    reader.onload = async (e) => {
      const dataUrl = e.target.result
      

      // Display the image
      const originalImg = document.getElementById('uploaded-image')
      if (originalImg) {
        originalImg.src = dataUrl
      }

      try {
        const grayscaleDataUrl = await processImage(dataUrl)
        grayscaleImage.value = grayscaleDataUrl

        const extractedText = await performOCR(grayscaleDataUrl)
        text.value = extractedText
      } catch (error) {
        console.error("")
      }
    }

    reader.readAsDataURL(file)
  } else {
    console.error('No file selected.')
  }
}
const sendAudioRequest = async (text_value) => {
  try {
    // Send the request to the backend
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_SERVER_PRODUCTION}/tutor/audio`,
      { text: text_value },
      {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'blob' // Important for receiving binary data
      }
    )

    // Create a URL for the received audio blob
    const audio_url = URL.createObjectURL(response.data)
    audioUrl.value = audio_url // Update your audioUrl reactive variable
  } catch (error) {
    console.error('Error sending data:', error)
    setMessage('Failed to send data', 'error')
  } finally {
    isLoading.value = false
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
const waitForVariable = (getVariable, targetValue, interval = 100, timeout = 100000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()

    const check = () => {
      const value = getVariable()
      if (value != targetValue) {
        resolve()
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout: Variable did not reach target value.'))
      } else {
        setTimeout(check, interval)
      }
    }

    check()
  })
}
const setMessage = (message, type) => {
  responseMessage.value = message
  messageType.value = type
}

// Attach handleRecording to a single button's click event
const handleSubmit = async (event) => {
  event.preventDefault()
  isLoading.value = true

  const formData = new FormData()

  // Append image if available
  await waitForVariable(() => text.value, null)

  formData.append('text', text.value)

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
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_SERVER_PRODUCTION}/tutor/text`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    )

    await sendAudioRequest(response.data.message)
    setMessage(response.data.message, 'info')
  } catch (error) {
    console.error('Error sending data:', error)
    setMessage('Failed to send data', 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.audio-player {
  text-align: center;
  margin-top: 20px;
}

textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
}

button {
  padding: 10px 20px;
  background-color: #2196f3;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

audio {
  margin-top: 20px;
}

.audio-source {
  margin-top: 1rem; /* Spacing above the audio component */
  text-align: center; /* Center the audio controls */
}
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
.help {
  font-size: 1rem;
  border-radius: 5px;
  padding: 10px;
  margin-top: 20px;
  text-align: center;
}

.success {
  color: #155724;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
}

.error {
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}

.info {
  color: #004085;
  background-color: #cce5ff;
  border: 1px solid #b8daff;
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

.ocr-container {
  text-align: center;
  height: 95vh;
  padding: 50px;
  align-content: center;
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

