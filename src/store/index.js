import { saveTask, initDB } from '../services/indexedDB';
import { createStore } from 'vuex';
export default createStore({
  state: {
    tasks: [],
    isOffline: !navigator.onLine
  },
  mutations: {
    SET_TASKS(state, tasks) {
      state.tasks = tasks;
    },
    ADD_TASK(state, task) {
      state.tasks.push(task);
    },
    UPDATE_TASK(state, updatedTask) {
      const index = state.tasks.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        state.tasks[index] = updatedTask;
      }
    },
    DELETE_TASK(state, taskId) {
      state.tasks = state.tasks.filter(task => task.id !== taskId);
    },
    SET_OFFLINE_STATUS(state, status) {
      state.isOffline = status;
    }
  },
  actions: {
    async fetchTasks({ commit }) {
      try {
        // Try to fetch from IndexedDB first
        const db = await initDB();
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => {
          commit('SET_TASKS', request.result);
        };

        // If online, sync data with the server
        if (navigator.onLine) {
          const response = await fetch('http://localhost:3000/tasks');
          const tasks = await response.json();
          commit('SET_TASKS', tasks);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    },
    async addTask({ commit }, title) {
      const task = { title, completed: false };

      try {
        // Save to IndexedDB
        await saveTask(task);
        commit('ADD_TASK', task);

        if (navigator.onLine) {
          const response = await fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
          });
          const newTask = await response.json();
          commit('ADD_TASK', newTask);
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  }
});
