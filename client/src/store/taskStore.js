import { create } from 'zustand';
import api from '../api/axiosConfig';
import useAuthStore from './authStore';

const useTaskStore = create((set, get) => ({
    tasks: [],
    isLoading: false,
    error: null,

    fetchTasks: async (filters = {}) => {
        set({ isLoading: true, error: null });
        try {
            const params = new URLSearchParams(filters).toString();
            const response = await api.get(`/tasks?${params}`);
            set({ tasks: response.data, isLoading: false });
        } catch (error) {
            set({ isLoading: false, error: error.message });
        }
    },

    addTask: async (taskData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/tasks', taskData);
            set((state) => ({
                tasks: [response.data, ...state.tasks],
                isLoading: false
            }));
            return response.data;
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },

    updateTask: async (id, taskData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/tasks/${id}`, taskData);
            set((state) => ({
                tasks: state.tasks.map((t) => (t._id === id ? response.data : t)),
                isLoading: false
            }));
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },

    deleteTask: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/tasks/${id}`);
            set((state) => ({
                tasks: state.tasks.filter((t) => t._id !== id),
                isLoading: false
            }));
        } catch (error) {
            set({ isLoading: false, error: error.message });
        }
    },

    completeTask: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.patch(`/tasks/${id}/complete`);
            const { task, user } = response.data;

            // Update task in list
            set((state) => ({
                tasks: state.tasks.map((t) => (t._id === id ? task : t)),
                isLoading: false
            }));

            // Update user stats in auth store
            useAuthStore.setState((state) => ({
                user: { ...state.user, ...user }
            }));

            return response.data;
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    }
}));

export default useTaskStore;
