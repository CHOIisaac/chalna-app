import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MobileLayout from '../components/layout/MobileLayout';
import { EventType, RelationshipType } from '../types';

const AddLedger: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    relationship: '', // 기본값 제거
    eventType: '', // 기본값 제거
    date: new Date(),
    amount: '',
    type: 'given', // given: 나눔, received: 받음
    memo: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    relationship: '',
    eventType: '',
    date: '',
    amount: ''
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);

  const eventTypes = Object.values(EventType);
  const relationshipTypes = Object.values(RelationshipType);
  const typeOptions = [
    { value: 'given', label: '나눔', icon: 'arrow-up', color: '#e53e3e' },
    { value: 'received', label: '받음', icon: 'arrow-down', color: '#38a169' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 실시간 검증 - 값이 입력되면 에러 메시지 제거
    if (value && value.toString().trim()) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      handleInputChange('date', selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      relationship: '',
      eventType: '',
      date: '',
      amount: ''
    };

    let hasError = false;

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
      hasError = true;
    }

    if (!formData.relationship) {
      newErrors.relationship = '관계를 선택해주세요';
      hasError = true;
    }

    if (!formData.eventType) {
      newErrors.eventType = '경조사 타입을 선택해주세요';
      hasError = true;
    }

    if (!formData.amount.trim()) {
      newErrors.amount = '금액을 입력해주세요';
      hasError = true;
    }

    setErrors(newErrors);
    return !hasError;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    // 여기서 실제 저장 로직을 구현
    console.log('Saving ledger:', formData);
    
    // 장부 페이지로 돌아가기
    router.back();
  };

  const getFieldInfo = (field: string) => {
    switch (field) {
      case 'name':
        return { label: '이름', placeholder: '이름을 입력하세요', icon: 'person' };
      case 'relationship':
        return { label: '관계', placeholder: '관계를 입력하세요', icon: 'people' };
      case 'eventType':
        return { label: '경조사 타입', placeholder: '경조사 타입을 선택하세요', icon: 'calendar' };
      case 'date':
        return { label: '날짜', placeholder: 'YYYY-MM-DD 형식으로 입력하세요', icon: 'time' };
      case 'amount':
        return { label: '금액', placeholder: '금액을 입력하세요', icon: 'cash' };
      default:
        return { label: '정보', placeholder: '정보를 입력하세요', icon: 'information' };
    }
  };

  return (
    <MobileLayout currentPage="add-ledger">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.title}>장부 추가</Text>
            <View style={styles.placeholder} />
          </View>
          <Text style={styles.subtitle}>새로운 경조사 장부를 추가하세요</Text>
        </View>

        {/* 폼 섹션 */}
        <View style={styles.formSection}>
          <View style={styles.formCard}>
            {/* 이름 */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <View style={styles.fieldIconContainer}>
                  <Ionicons name="person" size={20} color="#4a5568" />
                </View>
                <Text style={styles.fieldLabel}>
                  이름 <Text style={styles.required}>*</Text>
                </Text>
              </View>
              <TextInput
                style={[
                  styles.textInput,
                  errors.name && styles.inputError
                ]}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="이름을 입력하세요"
                placeholderTextColor="#999"
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            {/* 관계 */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <View style={styles.fieldIconContainer}>
                  <Ionicons name="people" size={20} color="#4a5568" />
                </View>
                <Text style={styles.fieldLabel}>
                  관계 <Text style={styles.required}>*</Text>
                </Text>
              </View>
              <ScrollView 
                style={[
                  styles.optionsScrollContainer,
                  errors.relationship && styles.inputError
                ]}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                <View style={styles.optionsContainer}>
                  {relationshipTypes.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        formData.relationship === option && styles.selectedOption
                      ]}
                      onPress={() => handleInputChange('relationship', option)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.optionText,
                        formData.relationship === option && styles.selectedOptionText
                      ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              {errors.relationship && (
                <Text style={styles.errorText}>{errors.relationship}</Text>
              )}
            </View>

            {/* 경조사 타입 */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <View style={styles.fieldIconContainer}>
                  <Ionicons name="calendar" size={20} color="#4a5568" />
                </View>
                <Text style={styles.fieldLabel}>
                  경조사 타입 <Text style={styles.required}>*</Text>
                </Text>
              </View>
              <ScrollView 
                style={[
                  styles.optionsScrollContainer,
                  errors.eventType && styles.inputError
                ]}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                <View style={styles.optionsContainer}>
                  {eventTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.optionButton,
                        formData.eventType === type && styles.selectedOption
                      ]}
                      onPress={() => handleInputChange('eventType', type)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.optionText,
                        formData.eventType === type && styles.selectedOptionText
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              {errors.eventType && (
                <Text style={styles.errorText}>{errors.eventType}</Text>
              )}
            </View>

            {/* 날짜 */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <View style={styles.fieldIconContainer}>
                  <Ionicons name="calendar" size={20} color="#4a5568" />
                </View>
                <Text style={styles.fieldLabel}>날짜</Text>
              </View>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => {
                  console.log('Date button pressed, showDatePicker:', showDatePicker);
                  setShowDatePicker(true);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.dateText}>
                  {formatDate(formData.date)}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
              
              {showDatePicker && (
                <View style={styles.datePickerContainer}>
                  {Platform.OS === 'ios' && (
                    <View style={styles.datePickerHeader}>
                      {/*<TouchableOpacity*/}
                      {/*  style={styles.datePickerCancelButton}*/}
                      {/*  onPress={() => setShowDatePicker(false)}*/}
                      {/*>*/}
                      {/*  <Text style={styles.datePickerCancelText}>취소</Text>*/}
                      {/*</TouchableOpacity>*/}
                      <TouchableOpacity
                        style={styles.datePickerConfirmButton}
                        onPress={() => setShowDatePicker(false)}
                      >
                        <Text style={styles.datePickerConfirmText}>확인</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  <View style={styles.datePickerWrapper}>
                    <DateTimePicker
                      value={formData.date}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleDateChange}
                      locale="ko-KR"
                      style={Platform.OS === 'ios' ? styles.datePickerIOS : undefined}
                      textColor="#000000"
                      accentColor="#4a5568"
                    />
                  </View>
                </View>
              )}
            </View>

            {/* 금액 */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <View style={styles.fieldIconContainer}>
                  <Ionicons name="cash" size={20} color="#4a5568" />
                </View>
                <Text style={styles.fieldLabel}>
                  금액 <Text style={styles.required}>*</Text>
                </Text>
              </View>
              <TextInput
                style={[
                  styles.textInput,
                  errors.amount && styles.inputError
                ]}
                value={formData.amount}
                onChangeText={(value) => handleInputChange('amount', value)}
                placeholder="금액을 입력하세요"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              {errors.amount && (
                <Text style={styles.errorText}>{errors.amount}</Text>
              )}
            </View>

            {/* 나눔/받음 타입 */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <View style={styles.fieldIconContainer}>
                  <Ionicons name="swap-vertical" size={20} color="#4a5568" />
                </View>
                <Text style={styles.fieldLabel}>타입</Text>
              </View>
              <View style={styles.typeContainer}>
                {typeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.typeButton,
                      formData.type === option.value && styles.selectedType
                    ]}
                    onPress={() => handleInputChange('type', option.value)}
                    activeOpacity={0.7}
                  >
                    <Ionicons 
                      name={option.icon as any} 
                      size={20} 
                      color={formData.type === option.value ? 'white' : option.color} 
                    />
                    <Text style={[
                      styles.typeText,
                      formData.type === option.value && styles.selectedTypeText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 메모 */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <View style={styles.fieldIconContainer}>
                  <Ionicons name="document-text" size={20} color="#4a5568" />
                </View>
                <Text style={styles.fieldLabel}>메모</Text>
              </View>
              <TextInput
                style={[styles.textInput, styles.memoInput]}
                value={formData.memo}
                onChangeText={(value) => handleInputChange('memo', value)}
                placeholder="추가 메모를 입력하세요 (선택사항)"
                placeholderTextColor="#999"
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        {/* 액션 버튼 */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>장부 추가</Text>
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
    backgroundColor: 'white',
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
  fieldContainer: {
    marginBottom: 24,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fieldIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
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
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
    minWidth: 80,
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: '#e2e8f0',
    borderColor: '#4a5568',
  },
  optionText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#4a5568',
    fontWeight: '600',
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
  dateButton: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  datePickerContainer: {
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    overflow: 'hidden',
  },
  datePickerWrapper: {
    backgroundColor: 'white',
  },
  datePickerIOS: {
    height: 200,
    backgroundColor: 'white',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  datePickerCancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  datePickerCancelText: {
    fontSize: 16,
    color: '#666',
  },
  datePickerConfirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  datePickerConfirmText: {
    fontSize: 16,
    color: '#4a5568',
    fontWeight: '600',
  },
  debugText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
    gap: 8,
  },
  selectedType: {
    backgroundColor: '#4a5568',
    borderColor: '#4a5568',
  },
  typeText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  selectedTypeText: {
    color: 'white',
  },

  // 액션 버튼들
  actionButtons: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a5568',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },

  // 필수 표시 및 에러 스타일
  required: {
    color: '#e53e3e',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#e53e3e',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  inputError: {
    borderColor: '#e53e3e',
    borderWidth: 1,
  },
});

export default AddLedger;