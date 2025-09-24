<template>
  <div class="container">
    <h1 class="title"><span class="rainbow">Super</span> contador!</h1>
    <div class="update-note">Ahora en Kubernetes!</div>
    <div class="subtitle">
      Este es un contador que usa Nest como backend y Redis para la persistencia
    </div>
    <div class="contador" :class="{ loading: isLoading }">
      <button class="button" type="button" @click="reducir()">-</button>
      <span>{{ contador }}</span>
      <button class="button" type="button" @click="aumentar()">+</button>
    </div>
    <div v-if="showError" class="error">Ocurrió un error al comunicarse con el backend</div>
    <div class="note">
      <div>Se pueden usar los siguientes endpoints para manipular los datos:</div>
      <ul>
        <li>POST - {{ apiIncrement }}</li>
        <li>POST - {{ apiDecrement }}</li>
        <li>POST - {{ apiCounter }} - body: {"counter": &lt;cantidad&gt;}</li>
        <li>GET - {{ apiCounter }}</li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const contador = ref(0)
const showError = ref(false)
const isLoading = ref(false)
const apiIncrement = ref(`${window._env_.VITE_BACKEND}/counter/increment`)
const apiDecrement = ref(`${window._env_.VITE_BACKEND}/counter/decrement`)
const apiCounter = ref(`${window._env_.VITE_BACKEND}/counter`)

async function reducir() {
  const start = Date.now()
  let elapsed = 0
  try {
    isLoading.value = true

    const response = await fetch(apiDecrement.value, {
      method: 'POST',
    })

    elapsed = Date.now() - start

    if (!response.ok) {
      showError.value = true
    } else {
      showError.value = false
      const data = await response.json()
      contador.value = data.count
    }
  } catch (err) {
    console.error(err)
    showError.value = true
  } finally {
    const remaining = 1500 - elapsed

    if (remaining > 0) {
      await new Promise<void>((resolve) =>
        setTimeout(() => {
          isLoading.value = false
          resolve()
        }, remaining),
      )
    }
  }
}

async function aumentar() {
  const start = Date.now()
  let elapsed = 0

  try {
    isLoading.value = true
    const response = await fetch(apiIncrement.value, {
      method: 'POST',
    })

    elapsed = Date.now() - start

    if (!response.ok) {
      showError.value = true
    } else {
      showError.value = false
      const data = await response.json()
      contador.value = data.count
    }
  } catch (err) {
    console.error(err)
    showError.value = true
  } finally {
    const remaining = 1500 - elapsed

    if (remaining > 0) {
      await new Promise<void>((resolve) =>
        setTimeout(() => {
          isLoading.value = false
          resolve()
        }, remaining),
      )
    }
  }
}

onMounted(async () => {
  const start = Date.now()
  let elapsed = 0

  try {
    isLoading.value = true
    const response = await fetch(apiCounter.value)

    elapsed = Date.now() - start

    if (!response.ok) {
      showError.value = true
    } else {
      showError.value = false
      const data = await response.json()
      contador.value = data.count
    }
  } catch (err) {
    console.error(err)
    showError.value = true
  } finally {
    const remaining = 1500 - elapsed

    if (remaining > 0) {
      await new Promise<void>((resolve) =>
        setTimeout(() => {
          isLoading.value = false
          resolve()
        }, remaining),
      )
    }
  }
})
</script>
<style lang="css" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100vh;
}

.title {
  font-size: 34px;
  margin-bottom: 24px;
}

.subtitle {
  color: #cccccc;
  margin-bottom: 24px;
}

.note {
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  font-size: 12px;
  color: #888888;
}

.note ul li {
  margin: 5px 0;
}

.contador {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 200px;
  padding: 20px;
  margin: 20px;
  border-radius: 0.4rem;
  border: 1px solid white;
  background: linear-gradient(to left, #2d2d2d 0%, #000000 50%, #2d2d2d 100%);
  background-size: 200% 100%;
}

.loading {
  animation: shimmer 1.5s ease-in-out;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.button {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
}

.button:hover {
  cursor: pointer;
}

.error {
  border: 1px solid #772222;
  border-radius: 0.4rem;
  padding: 10px;
  animation: error 4s infinite ease-in-out;
}

@keyframes error {
  0% {
    border: 1px solid #772222;
  }
  50% {
    border: 1px solid #dd2222;
  }
  0% {
    border: 1px solid #772222;
  }
}

.rainbow {
  background: linear-gradient(
    90deg,
    rgba(131, 58, 180, 1) 0%,
    rgba(252, 152, 62, 1) 25%,
    rgba(253, 29, 29, 1) 50%,
    rgba(252, 152, 62, 1) 75%,
    rgba(131, 58, 180, 1) 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s infinite linear;
  text-transform: uppercase;
}

.update-note {
  transform: rotateZ(45deg);
  position: absolute;
  top: 55px;
  right: -85px;
  border: 2px solid #dd2222;
  background-color: #772222;
  width: 300px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
