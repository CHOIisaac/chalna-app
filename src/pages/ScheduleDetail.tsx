import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MobileLayout from '../components/layout/MobileLayout';

const ScheduleDetail: React.FC = () => {
  const router = useRouter();
  const { id, data } = useLocalSearchParams<{ id: string; data: string }>();

  // 시간 포맷팅 함수 (초 제거)
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    // HH:MM:SS 형식을 HH:MM으로 변환
    return timeString.substring(0, 5);
  };

  // 상태 텍스트 변환 함수
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '완료';
      case 'upcoming': return '예정';
      case 'cancelled': return '취소';
      default: return status;
    }
  };
  
  // 전달받은 데이터 파싱 및 상태 관리
  const [scheduleDetail, setScheduleDetail] = useState(data ? JSON.parse(data) : null);

  // 페이지가 포커스될 때 파라미터 확인하여 데이터 업데이트
  useFocusEffect(
    useCallback(() => {
      // 파라미터가 변경되었는지 확인하고 데이터 업데이트
      if (data) {
        try {
          const parsedData = JSON.parse(data);
          setScheduleDetail(parsedData);
        } catch (error) {
          console.error('데이터 파싱 실패:', error);
        }
      }
    }, [data])
  );

  // 데이터가 없으면 뒤로 가기
  if (!scheduleDetail) {
    return (
      <MobileLayout currentPage="schedules">
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>데이터를 불러올 수 없습니다.</Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>뒤로 가기</Text>
          </TouchableOpacity>
        </View>
      </MobileLayout>
    );
  }

  // 개별 항목 수정 핸들러
  const handleEditItem = (field: string, currentValue: string) => {
    router.push({
      pathname: '/edit-schedule-field',
      params: {
        id: id,
        field: field,
        currentValue: currentValue,
        title: scheduleDetail.title
      }
    });
  };

  // 삭제 핸들러
  const handleDelete = () => {
    Alert.alert(
      "",
      `'${scheduleDetail.title}' 일정을 삭제하시겠습니까?`,
      [
        {
          text: "취소",
          style: "cancel"
        },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => {
            // 실제로는 API 호출로 삭제
            console.log(`일정 ${id} 삭제됨`);
            router.back(); // 목록으로 돌아가기
          }
        }
      ]
    );
  };


  return (
    <MobileLayout currentPage="schedule-detail">
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
            <Text style={styles.title}>상세 정보</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 스크롤 가능한 컨텐츠 */}
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>


        {/* 일정 정보 수정 섹션 */}
        <View style={styles.editSection}>
          <View style={styles.editCard}>
            <TouchableOpacity 
              style={styles.editItem} 
              activeOpacity={0.7}
              onPress={() => handleEditItem('title', scheduleDetail.title)}
            >
              <View style={styles.editItemLeft}>
                <View style={styles.editItemContent}>
                  <Text style={styles.editLabel}>일정명</Text>
                  <Text style={styles.editValue}>{scheduleDetail.title}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.editItem} 
              activeOpacity={0.7}
              onPress={() => handleEditItem('event_type', scheduleDetail.event_type)}
            >
              <View style={styles.editItemLeft}>
                <View style={styles.editItemContent}>
                  <Text style={styles.editLabel}>경조사 타입</Text>
                  <Text style={styles.editValue}>{scheduleDetail.event_type}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.editItem} 
              activeOpacity={0.7}
              onPress={() => handleEditItem('event_date', scheduleDetail.event_date)}
            >
              <View style={styles.editItemLeft}>
                <View style={styles.editItemContent}>
                  <Text style={styles.editLabel}>날짜</Text>
                  <Text style={styles.editValue}>{scheduleDetail.event_date}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.editItem} 
              activeOpacity={0.7}
              onPress={() => handleEditItem('event_time', scheduleDetail.event_time)}
            >
              <View style={styles.editItemLeft}>
                <View style={styles.editItemContent}>
                  <Text style={styles.editLabel}>시간</Text>
                  <Text style={styles.editValue}>{formatTime(scheduleDetail.event_time)}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.editItem} 
              activeOpacity={0.7}
              onPress={() => handleEditItem('location', scheduleDetail.location)}
            >
              <View style={styles.editItemLeft}>
                <View style={styles.editItemContent}>
                  <Text style={styles.editLabel}>장소</Text>
                  <Text style={styles.editValue}>{scheduleDetail.location}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.editItem} 
              activeOpacity={0.7}
              onPress={() => handleEditItem('status', scheduleDetail.status)}
            >
              <View style={styles.editItemLeft}>
                <View style={styles.editItemContent}>
                  <Text style={styles.editLabel}>상태</Text>
                  <Text style={styles.editValue}>{getStatusText(scheduleDetail.status)}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>

            {/* 메모 */}
            <TouchableOpacity
              style={styles.memoItem}
              activeOpacity={0.7}
              onPress={() => handleEditItem('memo', scheduleDetail.memo)}
            >
              <View style={styles.memoHeader}>
                <View style={styles.memoInfo}>
                  <Text style={styles.memoLabel}>메모</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </View>
              
              <View style={styles.memoContent}>
                <Text style={styles.memoText} numberOfLines={3}>
                  {scheduleDetail.memo || '메모가 없습니다'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 액션 버튼들 */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.secondaryActionButton}
            onPress={() => router.push('/(tabs)/schedules')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryActionText}>일정 보기</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
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
  deleteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },

  // 수정 섹션 스타일
  editSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  editCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  // 수정 아이템 스타일
  editItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  lastEditItem: {
    borderBottomWidth: 0,
  },
  editItemLeft: {
    flex: 1,
  },
  editItemContent: {
    flex: 1,
  },
  editLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  editValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },

  // 메모 아이템 스타일
  memoItem: {
    paddingTop: 16,
    // borderTopWidth: 1,
    // borderTopColor: '#f1f5f9',
  },
  memoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  memoInfo: {
    flex: 1,
  },
  memoLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  memoContent: {
    paddingLeft: 0,
  },
  memoText: {
    fontSize: 16,
    color: '#1e293b',
    lineHeight: 24,
  },

  // 액션 버튼 스타일
  actionButtons: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: 'f8f9fa',
  },
  secondaryActionButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryActionText: {
    color: '#4a5568',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ScheduleDetail;
