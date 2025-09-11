import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MobileLayout from '../components/layout/MobileLayout';
import { EventType, RelationshipType } from '../types';

const EditField: React.FC = () => {
  const router = useRouter();
  const { id, field, currentValue, name } = useLocalSearchParams<{
    id: string;
    field: string;
    currentValue: string;
    name: string;
  }>();

  const [value, setValue] = useState(currentValue);

  const getFieldInfo = () => {
    switch (field) {
      case 'name':
        return { label: '이름', icon: 'person' };
      case 'relationship':
        return { label: '관계', icon: 'people' };
      case 'eventType':
        return { label: '경조사 타입', icon: 'calendar' };
      case 'date':
        return { label: '날짜', icon: 'time' };
      case 'amount':
        return { label: '금액', icon: 'cash' };
      case 'memo':
        return { label: '메모', icon: 'document-text' };
      default:
        return { label: '정보', icon: 'information' };
    }
  };

  const fieldInfo = getFieldInfo();

  const handleSave = () => {
    if (!value.trim()) {
      Alert.alert('오류', '값을 입력해주세요.');
      return;
    }

    // 여기서 실제 저장 로직을 구현
    console.log(`Saving ${field}: ${value}`);
    
    // 바로 이전 페이지로 돌아가기
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <MobileLayout currentPage="edit-field">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.title}>{fieldInfo.label} 수정</Text>
            <View style={styles.placeholder} />
          </View>
        </View>

        {/* 수정 폼 */}
        <View style={styles.formSection}>
          <View style={styles.formCard}>
            <View style={styles.fieldHeader}>
              <View style={styles.fieldIconContainer}>
                <Ionicons name={fieldInfo.icon as any} size={24} color="#4a5568" />
              </View>
              <View style={styles.fieldInfo}>
                <Text style={styles.fieldLabel}>{fieldInfo.label}</Text>
                {(field === 'eventType' || field === 'relationship') && (
                  <Text style={styles.fieldDescription}>
                    {field === 'eventType' 
                      ? '경조사 타입을 선택하세요' 
                      : '관계를 선택하세요'
                    }
                  </Text>
                )}
              </View>
            </View>

            {field === 'eventType' ? (
              <ScrollView 
                style={styles.optionsScrollContainer}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                <View style={styles.optionsContainer}>
                  {Object.values(EventType).map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        value === option && styles.selectedOption
                      ]}
                      onPress={() => setValue(option)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.optionText,
                        value === option && styles.selectedOptionText
                      ]}>
                        {option}
                      </Text>
                      {value === option && (
                        <Ionicons name="checkmark" size={20} color="#4a5568" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : field === 'relationship' ? (
              <ScrollView 
                style={styles.optionsScrollContainer}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                <View style={styles.optionsContainer}>
                  {Object.values(RelationshipType).map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        value === option && styles.selectedOption
                      ]}
                      onPress={() => setValue(option)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.optionText,
                        value === option && styles.selectedOptionText
                      ]}>
                        {option}
                      </Text>
                      {value === option && (
                        <Ionicons name="checkmark" size={20} color="#4a5568" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <TextInput
                style={[styles.textInput, field === 'memo' && styles.memoInput]}
                value={value}
                onChangeText={setValue}
                keyboardType={field === 'amount' ? 'numeric' : 'default'}
                multiline={field === 'relationship' || field === 'memo'}
                numberOfLines={field === 'relationship' ? 2 : field === 'memo' ? 3 : 1}
                textAlignVertical={field === 'memo' ? 'top' : 'center'}
              />
            )}
          </View>
        </View>

        {/* 액션 버튼들 */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </MobileLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // 헤더 스타일
  header: {
    backgroundColor: 'f8f9fa',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 20,
  },

  // 폼 섹션
  formSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  fieldIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  fieldInfo: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  fieldDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#f8f9fa',
    minHeight: 56,
  },
  optionsScrollContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  optionsContainer: {
    gap: 12,
    padding: 12,
  },
  memoInput: {
    height: 160,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: 'white',
  },
  selectedOption: {
    backgroundColor: '#e2e8f0',
    borderColor: '#4a5568',
  },
  optionText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#4a5568',
    fontWeight: '600',
  },

  // 액션 버튼들
  actionButtons: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  confirmButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a5568',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default EditField;
