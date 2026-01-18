import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';

export type RootStackParamList = {
  home: undefined;
  add_task: undefined;
  task_detail: { taskId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="home"
        screenOptions={{
          headerShown: false, 
        }}
      >
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="add_task" component={AddTaskScreen} />
        <Stack.Screen name="task_detail" component={TaskDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;