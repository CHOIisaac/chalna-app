import { Ionicons } from '@expo/vector-icons';
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
// eslint-disable-next-line @typescript-eslint/no-var-requires
const DateTimePicker = require('@react-native-community/datetimepicker').default;

const AddSchedule: React.FC = () => {
  const router = useRouter();
  
  // 폼 상태
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [memo, setMemo] = useState('');
  
  // 에러 상태
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // 날짜 피커 상태
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // 경조사 타입 옵션
  const eventTypes = ['결혼식', '장례식', '돌잔치', '개업식', '생일', '졸업식', '기념일', '기타'];
  
  // 상태 옵션
  const statusOptions = ['예정', '완료'];
  
  // 폼 검증
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!title.trim()) {
      newErrors.title = '일정명을 입력해주세요';
    }
    
    if (!eventType) {
      newErrors.eventType = '경조사 타입을 선택해주세요';
    }
    
    if (!status) {
      newErrors.status = '상태를 선택해주세요';
    }
    
    if (!time.trim()) {
      newErrors.time = '시간을 입력해주세요';
    }
    
    if (!location.trim()) {
      newErrors.location = '장소를 입력해주세요';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 저장 처리
  const handleSave = () => {
    if (validateForm()) {
      // TODO: 실제 저장 로직 구현
      console.log('일정 저장:', {
        title,
        eventType,
        status,
        date,
        time,
        location,
        memo,
      });
      
      router.back();
    }
  };
  
  // 날짜 변경 처리
  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  return (
    <MobileLayout currentPage="add-schedule">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
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
            <Text style={styles.title}>일정 추가</Text>
            <View style={styles.placeholder} />
          </View>
          <Text style={styles.subtitle}>새로운 경조사 일정을 추가하세요</Text>
        </View>

        {/* 폼 섹션 */}
        <View style={styles.formSection}>
          <View style={styles.formCard}>
        {/* 일정명 */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldLabel}>
              일정명 <Text style={styles.required}>*</Text>
            </Text>
          </View>
          <TextInput
            style={[
              styles.textInput,
              errors.title && styles.inputError
            ]}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (errors.title) {
                setErrors({...errors, title: ''});
              }
            }}
            placeholder="예: 김철수 ♥ 이영희 결혼식"
            placeholderTextColor="#999"
          />
          {errors.title && (
            <Text style={styles.errorText}>{errors.title}</Text>
          )}
        </View>

        {/* 경조사 타입 */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
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
                    eventType === type && styles.selectedOption
                  ]}
                  onPress={() => {
                    setEventType(type);
                    if (errors.eventType) {
                      setErrors({...errors, eventType: ''});
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.optionText,
                    eventType === type && styles.selectedOptionText
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

        {/* 상태 */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldLabel}>
              상태 <Text style={styles.required}>*</Text>
            </Text>
          </View>
          <View style={styles.statusContainer}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.statusButton,
                  status === option && styles.selectedStatusButton
                ]}
                onPress={() => {
                  setStatus(option);
                  if (errors.status) {
                    setErrors({...errors, status: ''});
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.statusText,
                  status === option && styles.selectedStatusText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.status && (
            <Text style={styles.errorText}>{errors.status}</Text>
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
              {date.toLocaleDateString('ko-KR', {
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
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  textColor="#000000"
                  accentColor="#4a5568"
                  style={styles.datePicker}
                  locale="ko-KR"
                />
              </View>
            </View>
          )}
        </View>

        {/* 시간 */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldLabel}>
              시간 <Text style={styles.required}>*</Text>
            </Text>
          </View>
          <TextInput
            style={[
              styles.textInput,
              errors.time && styles.inputError
            ]}
            value={time}
            onChangeText={(text) => {
              setTime(text);
              if (errors.time) {
                setErrors({...errors, time: ''});
              }
            }}
            placeholder="예: 12:00"
            placeholderTextColor="#999"
          />
          {errors.time && (
            <Text style={styles.errorText}>{errors.time}</Text>
          )}
        </View>

        {/* 장소 */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldLabel}>
              장소 <Text style={styles.required}>*</Text>
            </Text>
          </View>
          <TextInput
            style={[
              styles.textInput,
              errors.location && styles.inputError
            ]}
            value={location}
            onChangeText={(text) => {
              setLocation(text);
              if (errors.location) {
                setErrors({...errors, location: ''});
              }
            }}
            placeholder="예: 롯데호텔 크리스탈볼룸"
            placeholderTextColor="#999"
          />
          {errors.location && (
            <Text style={styles.errorText}>{errors.location}</Text>
          )}
        </View>

        {/* 메모 */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldLabel}>메모</Text>
          </View>
          <TextInput
            style={[styles.textInput, styles.memoInput]}
            value={memo}
            onChangeText={setMemo}
            placeholder="추가 정보나 메모를 입력해주세요"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
          </View>
        </View>
      </ScrollView>

      {/* 저장 버튼 */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#f8f9fa',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  placeholder: {
    width: 40,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

  // 폼 섹션 스타일
  formSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  section: {
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },

  // AddLedger.tsx와 동일한 필드 스타일
  fieldContainer: {
    marginBottom: 24,
  },
  fieldHeader: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  required: {
    color: '#e53e3e',
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    fontSize: 16,
    color: '#1a1a1a',
    minHeight: 56,
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  memoInput: {
    height: 160,
    paddingTop: 12,
    textAlignVertical: 'top',
  },

  // 옵션 관련 스타일
  optionsScrollContainer: {
    maxHeight: 240,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    padding: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
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

  // 상태 관련 스타일
  statusContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedStatusButton: {
    backgroundColor: '#ffffff',
    borderColor: '#000000',
  },
  statusText: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
  },
  selectedStatusText: {
    color: '#000000',
    fontWeight: '600',
  },

  // 날짜 관련 스타일
  dateFieldContainer: {
    position: 'relative',
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
  errorText: {
    fontSize: 14,
    color: '#ff6b6b',
    marginTop: 6,
  },
  typeScrollView: {
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  typeOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: 'white',
  },
  typeOptionSelected: {
    backgroundColor: '#4a5568',
    borderColor: '#4a5568',
  },
  typeOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  typeOptionTextSelected: {
    color: 'white',
  },
  bottomSection: {
    paddingHorizontal: 20,
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
});

export default AddSchedule;
