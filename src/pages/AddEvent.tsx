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
// eslint-disable-next-line @typescript-eslint/no-var-requires
const DateTimePicker = require('@react-native-community/datetimepicker').default;

const AddEvent: React.FC = () => {
  const router = useRouter();
  
  // 폼 상태
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('');
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
  
  // 폼 검증
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!title.trim()) {
      newErrors.title = '일정명을 입력해주세요';
    }
    
    if (!eventType) {
      newErrors.eventType = '경조사 타입을 선택해주세요';
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
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일정 추가</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 일정명 */}
        <View style={styles.section}>
          <Text style={styles.label}>일정명 *</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (errors.title) {
                setErrors({...errors, title: ''});
              }
            }}
            placeholder="예: 김철수 ♥ 이영희 결혼식"
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        {/* 경조사 타입 */}
        <View style={styles.section}>
          <Text style={styles.label}>경조사 타입 *</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.typeScrollView}
          >
            <View style={styles.typeContainer}>
              {eventTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeOption,
                    eventType === type && styles.typeOptionSelected
                  ]}
                  onPress={() => {
                    setEventType(type);
                    if (errors.eventType) {
                      setErrors({...errors, eventType: ''});
                    }
                  }}
                >
                  <Text style={[
                    styles.typeOptionText,
                    eventType === type && styles.typeOptionTextSelected
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          {errors.eventType && <Text style={styles.errorText}>{errors.eventType}</Text>}
        </View>

        {/* 날짜 */}
        <View style={styles.section}>
          <Text style={styles.label}>날짜 *</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.dateButtonText}>
              {date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'short'
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
                />
              </View>
            </View>
          )}
        </View>

        {/* 시간 */}
        <View style={styles.section}>
          <Text style={styles.label}>시간 *</Text>
          <TextInput
            style={[styles.input, errors.time && styles.inputError]}
            value={time}
            onChangeText={(text) => {
              setTime(text);
              if (errors.time) {
                setErrors({...errors, time: ''});
              }
            }}
            placeholder="예: 12:00"
          />
          {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}
        </View>

        {/* 장소 */}
        <View style={styles.section}>
          <Text style={styles.label}>장소 *</Text>
          <TextInput
            style={[styles.input, errors.location && styles.inputError]}
            value={location}
            onChangeText={(text) => {
              setLocation(text);
              if (errors.location) {
                setErrors({...errors, location: ''});
              }
            }}
            placeholder="예: 롯데호텔 크리스탈볼룸"
          />
          {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
        </View>

        {/* 메모 */}
        <View style={styles.section}>
          <Text style={styles.label}>메모</Text>
          <TextInput
            style={[styles.input, styles.memoInput]}
            value={memo}
            onChangeText={setMemo}
            placeholder="추가 정보나 메모를 입력해주세요"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* 저장 버튼 */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>일정 추가</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
  inputError: {
    borderColor: '#ff6b6b',
  },
  memoInput: {
    height: 100,
    textAlignVertical: 'top',
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
    marginTop: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    overflow: 'hidden',
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
  bottomSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#4a5568',
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

export default AddEvent;
