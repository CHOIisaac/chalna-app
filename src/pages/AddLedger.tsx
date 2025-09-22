import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MobileLayout from '../components/layout/MobileLayout';
import { handleApiError, ledgerService } from '../services/api';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const eventTypes = Object.values(EventType);
  const relationshipTypes = Object.values(RelationshipType);
  const typeOptions = [
    { value: 'given', label: '나눔' },
    { value: 'received', label: '받음' }
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

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      // API 형식에 맞게 데이터 변환
      const ledgerData = {
        counterparty_name: formData.name,
        counterparty_phone: '', // 기본값 (나중에 필드 추가 가능)
        relationship_type: formData.relationship,
        event_type: formData.eventType,
        event_date: formData.date.toISOString().split('T')[0], // YYYY-MM-DD 형식
        entry_type: formData.type,
        amount: parseInt(formData.amount),
        memo: formData.memo
      };

      const response = await ledgerService.createLedger(ledgerData);

      if (response.success) {
        // 성공 시 장부 목록으로 돌아가기
        router.back();
      } else {
        // 에러 처리
        setError(response.error || '장부 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('장부 추가 실패:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout currentPage="add-ledger">
      <View style={styles.container}>
        {/* 고정 헤더 */}
        <View style={styles.fixedHeader}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.title}>장부 작성</Text>
            <View style={styles.placeholder} />
          </View>
        </View>

        {/* 스크롤 가능한 컨텐츠 */}
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>

        {/* 폼 섹션 */}
        <View style={styles.formSection}>
          <View style={styles.formCard}>
            {/* 이름 */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
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
                <Text style={styles.fieldLabel}>
                  경조사 <Text style={styles.required}>*</Text>
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
            <View style={[styles.fieldContainer, styles.dateFieldContainer]}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>날짜</Text>
              </View>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.dateButtonText}>
                  {formData.date.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </TouchableOpacity>
              
              {showDatePicker && (
                <View style={styles.datePickerContainer}>
                  {Platform.OS === 'ios' && (
                    <View style={styles.datePickerHeader}>
                      <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                        <Text style={styles.datePickerHeaderText}>완료</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  <View style={styles.datePickerWrapper}>
                    <DateTimePicker
                      value={formData.date}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleDateChange}
                      textColor="#000000"
                      accentColor="#4a5568"
                      style={styles.datePicker}
                      locale="ko-KR"
                    />
                  </View>
                </View>
              )}
            </View>

            {/* 금액 */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
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
                <Text style={styles.fieldLabel}>구분</Text>
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
          {/* 에러 메시지 */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* 저장 버튼 */}
          <View style={styles.bottomSection}>
            <TouchableOpacity 
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>저장</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </View>
    </MobileLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // 고정 헤더 스타일
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: 16,
    // paddingBottom: 20,
    zIndex: 1000,
  },
  
  // 스크롤 컨텐츠
  scrollContent: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 60, // 헤더 높이만큼 여백
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

  // 폼 섹션
  formSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20
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
    gap: 8,
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
    flex: 1,
    minWidth: '30%',
    maxWidth: '31%',
    justifyContent: 'center',
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#ffffff',
    borderColor: '#000000',
  },
  optionText: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#000000',
    fontWeight: '600',
  },
  optionsScrollContainer: {
    maxHeight: 240,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    padding: 12,
  },
  memoInput: {
    height: 160,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  dateFieldContainer: {
    position: 'relative',
  },
  datePickerContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    overflow: 'hidden',
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  datePickerHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
  },
  datePickerWrapper: {
    padding: 16,
    backgroundColor: 'white',
  },
  datePicker: {
    backgroundColor: 'white',
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  selectedType: {
    backgroundColor: '#ffffff',
    borderColor: '#000000',
  },
  typeText: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '600',
  },
  selectedTypeText: {
    color: '#000000',
  },

  bottomSection: {
    paddingHorizontal: 26,
    paddingVertical: 20,
    backgroundColor: 'f8f9fa',
  },
  saveButton: {
    backgroundColor: 'black',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  errorContainer: {
    marginHorizontal: 26,
    marginBottom: 10,
    padding: 12,
    backgroundColor: '#fee',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fcc',
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