import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTasks } from '../../App'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Shared Theme and Type definitions (In a real app, these would be imported from separate files)
const colors = {
  text: "#1F2937",
  primary: "#2563EB",
  secondary: "#F3F4F6",
  background: "#FFFFFF",
  error: "#EF4444",
};

interface Task { id: string; title: string; description: string | null; isCompleted: boolean; }

// Mock Component definitions for Header and FabButton (Usually imported from components/)

const Header: React.FC<{ title: string, backgroundColor: string, showBackButton?: boolean, navigation?: any }> = ({ title, backgroundColor }) => (
    <View style={[styles.headerBase, { backgroundColor }]}>
        <Text style={styles.headerTitle}>{title}</Text>
    </View>
);

const FabButton: React.FC<{ iconName: string, color: string, onPress: () => void }> = ({ iconName, color, onPress }) => (
    <TouchableOpacity style={[styles.fab, { backgroundColor: color }]} onPress={onPress}>
        <Icon name={iconName} size={30} color={colors.background} />
    </TouchableOpacity>
);

const TaskItem: React.FC<{ task: Task, toggleStatus: (id: string, status: boolean) => void, onPress: (id: string) => void }> = ({ task, toggleStatus, onPress }) => {
    return (
        <TouchableOpacity 
            style={[styles.taskItem, { borderLeftColor: task.isCompleted ? '#10B981' : colors.primary }]}
            onPress={() => onPress(task.id)}
        >
            <TouchableOpacity onPress={() => toggleStatus(task.id, !task.isCompleted)} style={styles.checkbox}>
                <Icon 
                    name={task.isCompleted ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'} 
                    size={24} 
                    color={task.isCompleted ? colors.primary : colors.text} 
                />
            </TouchableOpacity>
            
            <Text style={[styles.taskTitle, task.isCompleted && styles.completedTitle]}>
                {task.title}
            </Text>
        </TouchableOpacity>
    );
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { tasks, handleUpdateTask } = useTasks();

  const handleToggleStatus = async (taskId: string, newStatus: boolean) => {
    await handleUpdateTask(taskId, { isCompleted: newStatus });
  };

  const handleItemClick = (taskId: string) => {
    navigation.navigate('task_detail', { taskId });
  };

  const navigateToAdd = () => {
    navigation.navigate('add_task');
  };

  return (
    <View style={styles.container}>
      <Header title="Yapılacaklar" backgroundColor={colors.primary} />
      
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem 
            task={item} 
            toggleStatus={handleToggleStatus} 
            onPress={handleItemClick}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Henüz görev eklenmedi.</Text>
            </View>
        )}
      />

      <FabButton 
        iconName="plus" 
        color={colors.primary} 
        onPress={navigateToAdd} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  // Header Styles
  headerBase: {
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.background,
  },
  // Task Item Styles
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 5,
    elevation: 1,
  },
  checkbox: {
    marginRight: 10,
  },
  taskTitle: {
    fontSize: 16,
    color: colors.text,
    flexShrink: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.text,
  },
  // FAB Styles
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    elevation: 6,
  }
});

export default HomeScreen;