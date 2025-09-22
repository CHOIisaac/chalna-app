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
  View
} from 'react-native';
import MobileLayout from '../components/layout/MobileLayout';
import { handleApiError, ledgerService } from '../services/api';
import { EventType, RelationshipType } from '../types';

const EditField: React.FC = () => {
  const router = useRouter();
  const { id, field, currentValue } = useLocalSearchParams<{
    id: string;
    field: string;
    currentValue: string;
  }>();

  const [value, setValue] = useState(currentValue);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 날짜 필드인 경우 Date 객체로 변환
  const getInitialDate = () => {
    if (field === 'event_date') {
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
      case 'counterparty_name':
        return { label: '이름' };
      case 'relationship_type':
        return { label: '관계' };
      case 'event_type':
        return { label: '경조사' };
      case 'event_date':
        return { label: '날짜' };
      case 'entry_type':
        return { label: '구분' };
      case 'amount':
        return { label: '금액' };
      case 'memo':
        return { label: '메모' };
      // 이전 필드명 지원 (하위 호환성)
      case 'name':
        return { label: '이름' };
      case 'relationship':
        return { label: '관계' };
      case 'eventType':
        return { label: '경조사' };
      case 'date':
        return { label: '날짜' };
      case 'type':
        return { label: '구분' };
      default:
        return { label: '정보' };
    }
  };

  const fieldInfo = getFieldInfo();

  const validateAndSave = () => {
    // 메모 필드는 선택사항이므로 빈 값 허용
    if (field === 'memo') {
      handleSave();
      return;
    }

    if (!value.trim()) {
      setError(`${fieldInfo.label}을(를) 입력해주세요`);
      return;
    }

    setError('');
    handleSave();
  };

  const handleSave = async () => {
    if (!id) {
      setError('ID가 없습니다.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // API 필드명 매핑
      const apiFieldMap: Record<string, string> = {
        'counterparty_name': 'counterparty_name',
        'relationship_type': 'relationship_type',
        'event_type': 'event_type',
        'event_date': 'event_date',
        'entry_type': 'entry_type',
        'amount': 'amount',
        'memo': 'memo'
      };

      const apiField = apiFieldMap[field] || field;
      const updateData = { [apiField]: value };

      const response = await ledgerService.updateLedger(parseInt(id), updateData);

      if (response.success) {
        // 성공 시 수정된 데이터를 가져와서 상세 페이지로 전달
        try {
          const updatedLedgerResponse = await ledgerService.getLedger(parseInt(id));
          if (updatedLedgerResponse.success && updatedLedgerResponse.data) {
            // 수정된 데이터와 함께 상세 페이지로 이동 (이전 화면들 모두 제거)
            router.dismissAll();
            router.push({
              pathname: '/ledger-detail',
              params: {
                id: id,
                data: JSON.stringify(updatedLedgerResponse.data)
              }
            });
          } else {
            // 데이터 가져오기 실패 시 이전 페이지로 돌아가기
            router.back();
          }
        } catch (error) {
          console.error('수정된 데이터 가져오기 실패:', error);
          router.back();
        }
      } else {
        setError(response.error || '수정에 실패했습니다.');
      }
    } catch (err) {
      console.error('장부 수정 실패:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDateValue(selectedDate);
      // 로컬 시간대를 기준으로 날짜 포맷팅 (UTC 변환 방지)
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      setValue(`${year}-${month}-${day}`);
      setError(''); // 날짜 선택 시 에러 제거
    }
  };


  const handleCancel = () => {
    router.back();
  };

  return (
    <MobileLayout currentPage="edit-field">
      <View style={styles.container}>
        {/* 고정 헤더 */}
        <View style={styles.fixedHeader}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <View style={styles.placeholder} />
          </View>
        </View>

        {/* 스크롤 가능한 컨텐츠 */}
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 수정 폼 */}
        <View style={styles.formSection}>
          <View style={styles.formCard}>
            <View style={styles.fieldHeader}>
              <View style={styles.fieldInfo}>
                <Text style={styles.fieldLabel}>
                  {fieldInfo.label}
                  {field !== 'memo' && <Text style={styles.required}> *</Text>}
                </Text>
                {/*{(field === 'eventType' || field === 'relationship' || field === 'type') && (*/}
                {/*  <Text style={styles.fieldDescription}>*/}
                {/*    {field === 'eventType' */}
                {/*      ? '경조사 타입을 선택하세요' */}
                {/*      : field === 'relationship'*/}
                {/*      ? '관계를 선택하세요'*/}
                {/*      : '나눔 또는 받음을 선택하세요'*/}
                {/*    }*/}
                {/*  </Text>*/}
                {/*)}*/}
              </View>
            </View>

            {(field === 'eventType' || field === 'event_type') ? (
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
                      onPress={() => {
                        setValue(option);
                        setError(''); // 값 선택 시 에러 제거
                      }}
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
            ) : (field === 'relationship' || field === 'relationship_type') ? (
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
                      onPress={() => {
                        setValue(option);
                        setError(''); // 값 선택 시 에러 제거
                      }}
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
            ) : (field === 'type' || field === 'entry_type') ? (
              <ScrollView 
                style={styles.optionsScrollContainer}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                <View style={styles.typeOptionsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.typeOptionButton,
                      value === 'given' && styles.selectedOption
                    ]}
                    onPress={() => {
                      setValue('given');
                      setError(''); // 값 선택 시 에러 제거
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.optionText,
                      value === 'given' && styles.selectedOptionText
                    ]}>
                      나눔
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.typeOptionButton,
                      value === 'received' && styles.selectedOption
                    ]}
                    onPress={() => {
                      setValue('received');
                      setError(''); // 값 선택 시 에러 제거
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.optionText,
                      value === 'received' && styles.selectedOptionText
                    ]}>
                      받음
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            ) : (field === 'date' || field === 'event_date') ? (
              <View>
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
            ) : (
              <View>
                <TextInput
                  style={[
                    styles.textInput, 
                    field === 'memo' && styles.memoInput,
                    error && styles.inputError
                  ]}
                  value={value}
                  onChangeText={(text) => {
                    setValue(text);
                    setError(''); // 입력 시 에러 제거
                  }}
                  keyboardType={field === 'amount' ? 'numeric' : 'default'}
                  multiline={(field === 'relationship' || field === 'relationship_type') || field === 'memo'}
                  numberOfLines={(field === 'relationship' || field === 'relationship_type') ? 2 : field === 'memo' ? 3 : 1}
                  textAlignVertical={field === 'memo' ? 'top' : 'center'}
                />
                {error && (
                  <Text style={styles.errorText}>{error}</Text>
                )}
              </View>
            )}
          </View>
        </View>

        {/* 액션 버튼들 */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.confirmButton, loading && styles.confirmButtonDisabled]}
            onPress={validateAndSave}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={styles.confirmButtonText}>
              {loading ? '저장 중...' : '확인'}
            </Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
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
    marginBottom: 16,
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
  memoInput: {
    height: 160,
    paddingTop: 12,
    textAlignVertical: 'top',
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
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#000000',
    fontWeight: '600',
  },
  typeOptionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOptionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
  },

  // 액션 버튼들
  actionButtons: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  confirmButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  confirmButtonDisabled: {
    backgroundColor: '#cbd5e0',
    opacity: 0.6,
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

export default EditField;