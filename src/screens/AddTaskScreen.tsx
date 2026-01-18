import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTasks } from '../../App';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

// Shared Theme
const colors = {
  text: "#1F2937",
  primary: "#2563EB",
  secondary: "#F3F4F6",
  background: "#FFFFFF",
  error: "#EF4444",
};

// Mock Component definitions for Header and Button

const Header: React.FC<{ title: string, backgroundColor: string, showBackButton?: boolean }> = ({ title, backgroundColor, showBackButton }) => {
    const navigation = useNavigation();
    return (
        <View style={[headerStyles.header, { backgroundColor }]}>
            {showBackButton && (
                <TouchableOpacity onPress={() => navigation.goBack()} style={headerStyles.backButton}>
                    <Icon name="arrow-left" size={24} color={colors.background} />
                </TouchableOpacity>
            )}
            <Text style={headerStyles.title}>{title}</Text>
            <View style={headerStyles.right} />
        </View>
    );
};

const headerStyles = StyleSheet.create({
    header: {
        paddingTop: 50, // Simplified padding/insets
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
    backButton: {
        marginRight: 10,
    },
    right: {
        width: 34, // Spacer
    }
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

// End Mock Components

type AddTaskScreenProps = NativeStackScreenProps<RootStackParamList, 'add_task'>;

const AddTaskScreen: React.FC<AddTaskScreenProps> = ({ navigation }) => {
  const { handleAddTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    if (title.trim() === '') {
      Alert.alert('Hata', 'Görev Başlığı zorunludur.');
      return;
    }

    try {
      await handleAddTask(title.trim(), description.trim());
      navigation.goBack(); // action: saveAndGoBack
    } catch (error) {
      Alert.alert('Hata', 'Görev kaydedilirken bir sorun oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Yeni Görev" backgroundColor={colors.primary} showBackButton />

      <TextInput
        style={styles.input}
        placeholder="Görev Başlığı (Zorunlu)"
        placeholderTextColor="#9CA3AF"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Açıklama/Notlar (Opsiyonel)"
        placeholderTextColor="#9CA3AF"
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top"
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.buttonContainer}>
        <Button 
          label="Görevi Kaydet" 
          color={colors.primary} 
          onPress={handleSave} 
          fullWidth={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  input: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  multilineInput: {
    minHeight: 120,
  },
  buttonContainer: {
    marginTop: 20,
  }
});

export default AddTaskScreen;