import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTasks } from '../../App';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

// Shared Theme and Types
const colors = {
  text: "#1F2937",
  primary: "#2563EB",
  secondary: "#F3F4F6",
  background: "#FFFFFF",
  error: "#EF4444",
};

interface Task { id: string; title: string; description: string | null; isCompleted: boolean; }

// Mock Component definitions (Header, Button, TaskDetailCard) 

interface HeaderAction { icon: string; action: () => void; }

const Header: React.FC<{ title: string, backgroundColor: string, showBackButton?: boolean, actions?: HeaderAction[] }> = ({ title, backgroundColor, showBackButton, actions = [] }) => {
    const navigation = useNavigation();
    return (
        <View style={[headerStyles.header, { backgroundColor }]}>
            <View style={headerStyles.left}>
                {showBackButton && (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={headerStyles.backButton}>
                        <Icon name="arrow-left" size={24} color={colors.background} />
                    </TouchableOpacity>
                )}
            </View>
            <Text style={headerStyles.title}>{title}</Text>
            <View style={headerStyles.right}>
                {actions.map((action, index) => (
                    <TouchableOpacity key={index} onPress={action.action} style={headerStyles.actionButton}>
                        <Icon name={action.icon} size={24} color={colors.background} />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const headerStyles = StyleSheet.create({
    header: {
        paddingTop: 50, 
        paddingHorizontal: 16,
        paddingBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.background,
    },
    left: { width: 34 }, // For alignment
    right: { flexDirection: 'row' },
    backButton: {},
    actionButton: { marginLeft: 10 }
});

const Button: React.FC<{ label: string, color: string, onPress: () => void, fullWidth?: boolean, variant?: 'solid' | 'outline' }> = ({ label, color, onPress, fullWidth, variant }) => {
    const isOutline = variant === 'outline';
    const buttonStyle = [
        buttonStyles.buttonBase,
        fullWidth && buttonStyles.fullWidth,
        isOutline ? buttonStyles.outlineButton : { backgroundColor: color },
        isOutline && { borderColor: color, borderWidth: 2 }
    ];
    const textStyle = [
        buttonStyles.buttonText,
        isOutline ? { color: color } : { color: colors.background }
    ];
    return (
        <TouchableOpacity style={buttonStyle} onPress={onPress}>
            <Text style={textStyle}>{label}</Text>
        </TouchableOpacity>
    );
};

const buttonStyles = StyleSheet.create({
    buttonBase: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullWidth: {
        width: '100%',
    },
    outlineButton: {
        backgroundColor: colors.background,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

const TaskDetailCard: React.FC<{
    task: Task;
    isEditing: boolean;
    onTitleChange: (text: string) => void;
    onDescriptionChange: (text: string) => void;
    onToggleStatus: (status: boolean) => void;
}> = ({ task, isEditing, onTitleChange, onDescriptionChange, onToggleStatus }) => {
  
    const descriptionPlaceholder = isEditing ? "Açıklama girin..." : "Açıklama yok.";

    return (
        <View style={detailCardStyles.card}>
            {isEditing ? (
                <TextInput
                    style={detailCardStyles.titleInput}
                    value={task.title}
                    onChangeText={onTitleChange}
                    placeholder="Başlık"
                />
            ) : (
                <Text style={detailCardStyles.title}>{task.title}</Text>
            )}

            <View style={detailCardStyles.separator} />

            <Text style={detailCardStyles.label}>Açıklama</Text>
            {isEditing ? (
                <TextInput
                    style={[detailCardStyles.descriptionInput, {minHeight: 100}]}
                    value={task.description || ''}
                    onChangeText={onDescriptionChange}
                    placeholder={descriptionPlaceholder}
                    multiline
                    textAlignVertical="top"
                />
            ) : (
                <Text style={detailCardStyles.description}>
                    {task.description || descriptionPlaceholder}
                </Text>
            )}

            <View style={detailCardStyles.separator} />

            <View style={detailCardStyles.statusRow}>
                <Text style={detailCardStyles.label}>Durum:</Text>
                <TouchableOpacity 
                    style={detailCardStyles.statusToggle}
                    onPress={() => onToggleStatus(!task.isCompleted)}
                >
                    <Icon 
                        name={task.isCompleted ? 'check-circle' : 'circle-outline'} 
                        size={20} 
                        color={task.isCompleted ? '#10B981' : colors.text} 
                    />
                    <Text style={[detailCardStyles.statusText, task.isCompleted && detailCardStyles.completedStatus]}>
                        {task.isCompleted ? 'Tamamlandı' : 'Beklemede'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const detailCardStyles = StyleSheet.create({
    card: {
        backgroundColor: colors.secondary,
        borderRadius: 10,
        padding: 20,
        margin: 16,
        elevation: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 10,
    },
    titleInput: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        borderBottomWidth: 1,
        borderBottomColor: '#D1D5DB',
        marginBottom: 10,
        padding: 0,
    },
    label: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 10,
        marginBottom: 5,
    },
    description: {
        fontSize: 16,
        color: colors.text,
    },
    descriptionInput: {
        fontSize: 16,
        color: colors.text,
        backgroundColor: colors.background,
        borderRadius: 5,
        padding: 10,
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    separator: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 15,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statusToggle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        marginLeft: 5,
        fontSize: 16,
        color: colors.text,
    },
    completedStatus: {
        color: '#10B981',
        fontWeight: 'bold',
    }
});

// End Mock Components

type TaskDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'task_detail'>;

const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({ route, navigation }) => {
    const { taskId } = route.params;
    const { tasks, handleUpdateTask, handleDeleteTask } = useTasks();
    const [task, setTask] = useState<Task | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [initialTask, setInitialTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);

    // 1. Load initial task data
    useEffect(() => {
        const currentTask = tasks.find(t => t.id === taskId);
        if (currentTask) {
            setTask(currentTask);
            setInitialTask(currentTask);
        } else if (!loading) { 
             // If we failed to find it after initial load
            Alert.alert("Hata", "Görev bulunamadı.");
            navigation.goBack();
        }
        setLoading(false);
    }, [taskId, tasks, navigation]);

    // 2. Handle saving updates when exiting editing mode
    const handleSaveUpdates = async () => {
        if (!task || !initialTask) return;
        
        if (task.title.trim() === '') {
            Alert.alert('Hata', 'Başlık boş bırakılamaz.');
            setTask(initialTask); // Revert
            setIsEditing(false);
            return;
        }

        const updates: Partial<Task> = {};
        if (task.title !== initialTask.title) updates.title = task.title;
        if (task.description !== initialTask.description) updates.description = task.description;

        if (Object.keys(updates).length > 0) {
            try {
                await handleUpdateTask(taskId, updates);
            } catch (error) {
                Alert.alert('Hata', 'Güncelleme başarısız.');
            }
        }
        setIsEditing(false);
    };

    // 3. Status Toggle Handler
    const handleToggleStatus = async (newStatus: boolean) => {
        if (!task) return;
        setTask(prev => prev ? {...prev, isCompleted: newStatus} : null);
        await handleUpdateTask(taskId, { isCompleted: newStatus });
    };

    // 4. Delete Handler
    const handleDelete = () => {
        Alert.alert(
            "Görevi Sil",
            "Bu görevi silmek istediğinizden emin misiniz?",
            [
                { text: "İptal", style: "cancel" },
                { 
                    text: "Sil", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await handleDeleteTask(taskId);
                            navigation.goBack(); // action: deleteTaskAndGoBack
                        } catch (error) {
                            Alert.alert('Hata', 'Görev silinemedi.');
                        }
                    } 
                }, 
            ]
        );
    };

    // Define Header Actions
    const currentHeaderActions = isEditing 
        ? [{ icon: 'content-save', action: handleSaveUpdates }] // Save button
        : [{ icon: 'pencil', action: () => setIsEditing(true) }]; // Edit button (action: enableEditing)

    if (loading || !task) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header 
                title="Görev Detayı" 
                backgroundColor={colors.primary} 
                showBackButton
                actions={currentHeaderActions}
            />

            <ScrollView>
                <TaskDetailCard 
                    task={task}
                    isEditing={isEditing}
                    onTitleChange={(text) => setTask(prev => prev ? {...prev, title: text} : null)}
                    onDescriptionChange={(text) => setTask(prev => prev ? {...prev, description: text} : null)}
                    onToggleStatus={handleToggleStatus}
                />

                <View style={styles.buttonContainer}>
                    <Button
                        label="Görevi Sil"
                        color={colors.error}
                        onPress={handleDelete}
                        fullWidth={true}
                        variant="outline"
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    buttonContainer: {
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background
    }
});

export default TaskDetailScreen;