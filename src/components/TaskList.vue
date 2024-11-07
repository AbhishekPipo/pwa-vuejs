<template>
    <div class="task-list">
      <div class="add-task">
        <input 
          v-model="newTask" 
          @keyup.enter="addTask"
          placeholder="Add new task..."
          class="task-input"
        >
        <button @click="addTask" class="add-button">Add</button>
      </div>
  
      <div class="tasks">
        <div v-for="task in tasks" :key="task.id" class="task-item">
          <input 
            type="checkbox" 
            :checked="task.completed"
            @change="toggleTask(task)"
          >
          <span :class="{ completed: task.completed }">{{ task.title }}</span>
          <button @click="deleteTask(task.id)" class="delete-button">×</button>
        </div>
      </div>
  
      <div v-if="isOffline" class="offline-notice">
        You are offline. Changes will be synchronized when you're back online.
      </div>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex'
  
  export default {
    name: 'TaskList',
    data() {
      return {
        newTask: ''
      }
    },
    computed: {
      ...mapState(['tasks', 'isOffline'])
    },
    created() {
      this.$store.dispatch('fetchTasks')
      window.addEventListener('online', this.handleConnectionChange)
      window.addEventListener('offline', this.handleConnectionChange)
    },
    unmounted() {
      window.removeEventListener('online', this.handleConnectionChange)
      window.removeEventListener('offline', this.handleConnectionChange)
    },
    methods: {
      async addTask() {
        if (!this.newTask.trim()) return
        await this.$store.dispatch('addTask', this.newTask)
        this.newTask = ''
      },
      toggleTask(task) {
        this.$store.dispatch('toggleTask', task)
      },
      deleteTask(id) {
        this.$store.dispatch('deleteTask', id)
      },
      handleConnectionChange() {
    this.$store.commit('SET_OFFLINE_STATUS', !navigator.onLine);
    if (navigator.onLine) {
      this.$store.dispatch('syncOfflineTasks');
    }
  }
    }
  }
  </script>
  
  <style lang="scss">
  .task-list {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  
    .add-task {
      display: flex;
      margin-bottom: 20px;
      gap: 10px;
  
      .task-input {
        flex: 1;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
  
      .add-button {
        padding: 8px 16px;
        background-color: #4DBA87;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
  
        &:hover {
          background-color: darken(#4DBA87, 10%);
        }
      }
    }
  
    .task-item {
      display: flex;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #eee;
      gap: 10px;
  
      .completed {
        text-decoration: line-through;
        color: #888;
      }
  
      .delete-button {
        margin-left: auto;
        background: #ff4444;
        color: white;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
  
        &:hover {
          background-color: darken(#ff4444, 10%);
        }
      }
    }
  
    .offline-notice {
      margin-top: 20px;
      padding: 10px;
      background-color: #fff3cd;
      border: 1px solid #ffeeba;
      color: #856404;
      border-radius: 4px;
      text-align: center;
    }
  }
  </style>
  