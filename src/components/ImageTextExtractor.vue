<template>
  <div>
    <h1>Image Text Extractor</h1>
    <button @click="openCamera">Capture Image</button>
    <input
      type="file"
      ref="fileInput"
      accept="image/*"
      capture="environment"
      style="display: none;"
      @change="handleImageUpload"
    />
    <canvas ref="canvas" style="display: none;"></canvas>
    <img v-if="imageSrc" :src="imageSrc" alt="Captured Image" />
    <p v-if="extractedText">Extracted Text: {{ extractedText }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fileInput = ref(null)
const canvas = ref(null)
const imageSrc = ref('')
const extractedText = ref('')

const openCamera = () => {
  fileInput.value.click()
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imageSrc.value = e.target.result
      processImage(file)
    }
    reader.readAsDataURL(file)
  }
}

const processImage = (file) => {
  const ctx = canvas.value.getContext('2d')
  const img = new Image()
  img.onload = () => {
    canvas.value.width = img.width
    canvas.value.height = img.height
    ctx.drawImage(img, 0, 0)
    extractTextFromImage()
  }
  img.src = URL.createObjectURL(file)
}

const extractTextFromImage = () => {
  // Use a library like Tesseract.js to extract text from the canvas image
  import('tesseract.js').then(({ createWorker }) => {
    const worker = createWorker()
    worker.load().then(() => worker.loadLanguage('eng')).then(() => worker.initialize('eng')).then(() => {
      return worker.recognize(canvas.value)
    }).then(({ data: { text } }) => {
      extractedText.value = text
      worker.terminate()
    })
  })
}
</script>

<style scoped>
/* Add your styles here */
</style>

