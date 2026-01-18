import React, { useState, useEffect, createContext, useContext } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Shared Constants and Types
const colors = {
  text: "#1F2937",
  primary: "#2563EB",
  secondary: "#F3F4F6",
  background: "#FFFFFF",
  error: "#EF4444",
};

interface Task {
    id: string;
    title: string;
    description: string | null;
    isCompleted: boolean;
    createdAt: string;
    updatedAt: string;
}

// --- API Service (Mocking axios/fetch logic) ---
const API_BASE_URL = 'http://10.0.2.2:3000/api/tasks'; // Use 10.0.2.2 for Android Emulator

const api = {
    fetchTasks: async (): Promise<Task[]> => {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('API Error fetching tasks');
        return response.json();
    },
    addTask: async (task: { title: string, description: string }): Promise<Task> => {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task),
        });
        if (!response.ok) throw new Error('API Error adding task');
        return response.json();
    },
    updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error('API Error updating task');
        return response.json();
    },
    deleteTask: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok && response.status !== 204) throw new Error('API Error deleting task');
    },
};

interface TaskContextType {
  tasks: Task[];
  refreshTasks: () => void;
  isLoading: boolean;
  handleAddTask: (title: string, description: string) => Promise<void>;
  handleUpdateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  handleDeleteTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const fetchedTasks = await api.fetchTasks();
      setTasks(fetchedTasks);
    } catch (e) {
      console.error("Failed to load tasks:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async (title: string, description: string) => {
    await api.addTask({ title, description });
    await loadTasks();
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    await api.updateTask(id, updates);
    await loadTasks(); 
  };

  const handleDeleteTask = async (id: string) => {
    await api.deleteTask(id);
    await loadTasks();
  };


  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <TaskContext.Provider value={{ tasks, refreshTasks: loadTasks, isLoading, handleAddTask, handleUpdateTask, handleDeleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export default function App() {
  return (
    <TaskProvider>
      <AppNavigator />
    </TaskProvider>
  );
}