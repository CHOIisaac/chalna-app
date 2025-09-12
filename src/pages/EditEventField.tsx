import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { EventType } from '../types';

const EditEventField: React.FC = () => {
  const router = useRouter();
  const { field, currentValue } = useLocalSearchParams<{
    field: string;
    currentValue: string;
  }>();

  const [value, setValue] = useState(currentValue);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');
  
  // 날짜 필드인 경우 Date 객체로 변환
  const getInitialDate = () => {
    if (field === 'date') {
      try {
        // YYYY-MM-DD 형식의 문자열을 Date 객체로 변환
        const dateParts = currentValue.split('-');
        if (dateParts.length === 3) {
          return new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
        }
      } catch (error) {
        console.error('날짜 파싱 오류:', error);
      }
      return new Date();
    }
    return new Date();
  };
  
  const [dateValue, setDateValue] = useState(getInitialDate());

  const getFieldInfo = () => {
    switch (field) {
      case 'title':
        return { label: '일정명', icon: 'person' };
      case 'type':
        return { label: '경조사 타입', icon: 'calendar' };
      case 'date':
        return { label: '날짜', icon: 'calendar-outline' };
      case 'time':
        return { label: '시간', icon: 'time' };
      case 'location':
        return { label: '장소', icon: 'location' };
      case 'amount':
        return { label: '금액', icon: 'cash' };
      case 'status':
        return { label: '상태', icon: 'checkmark-circle' };
      case 'memo':
        return { label: '메모', icon: 'document-text' };
      default:
        return { label: '정보', icon: 'information' };
    }
  };

  const fieldInfo = getFieldInfo();

  const handleSave = () => {
    // 유효성 검사
    if (!value.trim() && field !== 'memo') {
      setError(`${fieldInfo.label}을(를) 입력해주세요.`);
      return;
    }

    // 여기서 실제 저장 로직을 구현
    console.log(`Saving ${field}:`, field === 'date' ? dateValue : value);
    
    // 상세 페이지로 돌아가기
    router.back();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateValue(selectedDate);
      // 날짜를 YYYY-MM-DD 형식으로 변환하여 value에 저장
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setValue(formattedDate);
    }
  };

  const isDateField = field === 'date';
  const isSelectField = field === 'type' || field === 'status';
  const isMemoField = field === 'memo';

  const eventTypes = Object.values(EventType);
  const statusOptions = ['예정', '진행중', '완료'];

  return (
    <MobileLayout currentPage="edit-event-field">
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
            <Text style={styles.title}>{fieldInfo.label} 수정</Text>
            <View style={styles.placeholder} />
          </View>
        </View>

        {/* 폼 섹션 */}
        <View style={styles.formSection}>
          <View style={styles.formCard}>
            {/* 필드 헤더 */}
            <View style={styles.fieldHeader}>
              <View style={styles.fieldIconContainer}>
                <Ionicons name={fieldInfo.icon as any} size={20} color="#4a5568" />
              </View>
              <Text style={styles.fieldLabel}>{fieldInfo.label}</Text>
            </View>

            {/* 입력 필드 */}
            {isDateField ? (
              <View style={styles.dateFieldContainer}>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                  <Text style={styles.dateButtonText}>
                    {dateValue.toLocaleDateString('ko-KR', {
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
                        value={dateValue}
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
            ) : isSelectField ? (
              <ScrollView style={styles.optionsScrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.optionsContainer}>
                  {(field === 'type' ? eventTypes : statusOptions).map((option, index) => (
                    <TouchableOpacity
                      key={index}
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
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <TextInput
                style={[
                  styles.textInput,
                  isMemoField && styles.memoInput,
                  error && styles.inputError
                ]}
                value={value}
                onChangeText={(text) => {
                  setValue(text);
                  if (error) {
                    setError('');
                  }
                }}
                placeholder={`${fieldInfo.label}을(를) 입력하세요`}
                placeholderTextColor="#999"
                multiline={isMemoField}
                numberOfLines={isMemoField ? 4 : 1}
                textAlignVertical={isMemoField ? 'top' : 'center'}
              />
            )}

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </View>
        </View>

        {/* 확인 버튼 */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleSave}
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: 'white',
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

  // 폼 섹션 스타일
  formSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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

  // 필드 헤더 스타일
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fieldIconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
  },

  // 입력 필드 스타일
  textInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2d3748',
    backgroundColor: 'white',
  },
  memoInput: {
    height: 160,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#e53e3e',
  },

  // 옵션 선택 스타일
  optionsScrollContainer: {
    maxHeight: 300,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flex: 1,
    minWidth: '30%',
    maxWidth: '31%',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: '#4a5568',
    borderColor: '#4a5568',
  },
  optionText: {
    fontSize: 14,
    color: '#4a5568',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: '600',
  },

  // 날짜 선택 스타일
  dateFieldContainer: {
    position: 'relative',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#2d3748',
    flex: 1,
  },
  datePickerContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
    marginTop: 4,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  datePickerHeaderText: {
    fontSize: 16,
    color: '#4a5568',
    fontWeight: '600',
  },
  datePickerWrapper: {
    padding: 16,
  },
  datePicker: {
    width: '100%',
  },

  // 에러 메시지 스타일
  errorText: {
    color: '#e53e3e',
    fontSize: 14,
    marginTop: 8,
  },

  // 하단 버튼 스타일
  bottomSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: 'f8f9fa',
  },
  confirmButton: {
    backgroundColor: 'black',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditEventField;
