<template>
  <div id="app">
    <header class="header">
      <h1>Task Manager PWA</h1>
      <div v-if="deferredPrompt" class="install-prompt">
        <button @click="installPWA" class="install-button">Install App</button>
      </div>
    </header>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      deferredPrompt: null
    }
  },
  mounted() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      this.deferredPrompt = e
    })
  },
  methods: {
    async installPWA() {
      if (!this.deferredPrompt) return
      this.deferredPrompt.prompt()
      const choiceResult = await this.deferredPrompt.userChoice
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt')
      }
      this.deferredPrompt = null
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.header {
  background-color: #4DBA87;
  color: white;
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;

  .install-button {
    background-color: white;
    color: #4DBA87;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
      background-color: darken(white, 5%);
    }
  }
}
</style>
