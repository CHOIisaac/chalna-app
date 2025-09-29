import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Swipeable } from 'react-native-gesture-handler';
import FloatingActionButton from '../components/common/FloatingActionButton';
import MobileLayout from '../components/layout/MobileLayout';
import { handleApiError, ScheduleItem, scheduleService } from '../services/api';
import { EventType } from '../types';

// 한국어 locale 설정
LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ],
  monthNamesShort: [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘'
};
LocaleConfig.defaultLocale = 'ko';

const Schedules: React.FC = () => {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // 시간 포맷팅 함수 (초 제거)
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    // HH:MM:SS 형식을 HH:MM으로 변환
    return timeString.substring(0, 5);
  };


  
  // 현재 열린 Swipeable ID (단일 관리로 성능 최적화)
  const [openSwipeableId, setOpenSwipeableId] = useState<number | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // 달력 월 네비게이션 상태
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  
  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_asc' | 'date_desc'>('date_asc');
  
  // 드롭다운 상태
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showEventTypeDropdown, setShowEventTypeDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // API 상태 관리
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 삭제된 항목과 되돌리기 상태
  const [deletedSchedule, setDeletedSchedule] = useState<ScheduleItem | null>(null);
  const [showUndoToast, setShowUndoToast] = useState(false);

  // 페이드인 애니메이션
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // API 함수들 (메모이제이션)
  const loadSchedules = useCallback(async (filterParams?: {
    search?: string;
    status?: 'upcoming' | 'completed';
    event_type?: string;
    sort_by?: 'date_asc' | 'date_desc';
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await scheduleService.getSchedules(filterParams);
      
      if (response.success) {
        setSchedules(response.data);
      } else {
        setError(response.error || '일정 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('일정 목록 로드 실패:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // 필터 파라미터 빌드 함수 (메모이제이션)
  const buildFilterParams = useCallback(() => {
    const filterParams: {
      search?: string;
      status?: 'upcoming' | 'completed';
      event_type?: string;
      sort_by?: 'date_asc' | 'date_desc';
    } = {};

    // 검색어 추가
    if (searchTerm.trim()) {
      filterParams.search = searchTerm.trim();
    }

    // 상태 필터 추가
    if (statusFilter !== 'all') {
      filterParams.status = statusFilter;
    }

    // 경조사 타입 필터 추가
    if (eventTypeFilter !== 'all') {
      filterParams.event_type = eventTypeFilter;
    }

    // 정렬 추가
    filterParams.sort_by = sortBy;

    return filterParams;
  }, [searchTerm, statusFilter, eventTypeFilter, sortBy]);

  // 필터 적용 함수 (메모이제이션)
  const applyFilter = useCallback(async () => {
    const filterParams = buildFilterParams();
    
    // API 호출
    await loadSchedules(filterParams);
    
    // 모달 닫기
    setShowFilterModal(false);
  }, [buildFilterParams, loadSchedules]);

  // 검색어 변경 시 실시간 필터링 (디바운싱 적용, 메모이제이션)
  const handleSearchChange = useCallback((text: string) => {
    setSearchTerm(text);
  }, []);

  // 삭제 함수 (API 연동)
  const handleDeleteEvent = async (scheduleId: number) => {
    const scheduleToDelete = schedules.find(schedule => schedule.id === scheduleId);
    if (scheduleToDelete) {
      try {
        // API 호출로 삭제
        const response = await scheduleService.deleteSchedule(scheduleId);
        
        if (response.success) {
          // UI에서 즉시 제거
          setSchedules(prevSchedules => prevSchedules.filter(schedule => schedule.id !== scheduleId));
          
          // 되돌리기를 위해 삭제된 항목 저장
          setDeletedSchedule(scheduleToDelete);
          setShowUndoToast(true);
          
          // 5초 후에 되돌리기 토스트 자동 사라짐
          setTimeout(() => {
            setShowUndoToast(false);
            setDeletedSchedule(null);
          }, 5000);
        } else {
          console.error('일정 삭제 실패:', response.error);
        }
      } catch (error) {
        console.error('일정 삭제 실패:', error);
      }
    }
  };

  // 되돌리기 함수 (API 연동)
  const handleUndoDelete = async () => {
    if (deletedSchedule) {
      try {
        // API 호출로 복원
        const response = await scheduleService.createSchedule({
          title: deletedSchedule.title,
          event_type: deletedSchedule.event_type,
          event_date: deletedSchedule.event_date,
          event_time: deletedSchedule.event_time,
          location: deletedSchedule.location,
          memo: deletedSchedule.memo,
          status: deletedSchedule.status
        });

        if (response.success) {
          // UI에 복원된 항목 추가
          setSchedules(prevSchedules => [...prevSchedules, response.data].sort((a, b) => a.id - b.id));
          setDeletedSchedule(null);
          setShowUndoToast(false);
        } else {
          console.error('일정 복원 실패:', response.error);
        }
      } catch (error) {
        console.error('일정 복원 실패:', error);
        // API 복원 실패 시 다시 데이터 로드
        await loadSchedules();
      }
    }
  };

  // 컴포넌트 마운트 시 데이터 로드 제거 (useFocusEffect에서 처리)

  // 검색어 변경 시 디바운싱된 API 호출
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filterParams = buildFilterParams();
      loadSchedules(filterParams);
    }, 200); // 200ms로 최적화 (반응성 향상)

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, sortBy, buildFilterParams, loadSchedules]);

  // 탭이 포커스될 때마다 스크롤을 맨 위로 이동 및 스와이프 닫기
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      // Swipeable 제거로 인한 성능 최적화
      // 데이터 새로고침
      loadSchedules();
    }, [loadSchedules])
  );

  // 페이드인 애니메이션 효과
  React.useEffect(() => {
    if (!loading && !error) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [loading, error, fadeAnim]);

  // Swipeable 관리 (단순화된 버전)
  const handleSwipeableOpen = (id: number) => {
    setOpenSwipeableId(id);
  };

  const handleSwipeableClose = () => {
    setOpenSwipeableId(null);
  };

  // 스와이프 삭제 버튼 렌더링
  const renderRightActions = (eventId: number) => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => handleDeleteEvent(eventId)}
        activeOpacity={0.8}
      >
        <Text style={styles.deleteActionText}>삭제</Text>
      </TouchableOpacity>
    );
  };

  // 서버에서 이미 필터링 및 정렬된 데이터 사용
  const filteredAndSortedEvents = schedules || [];

  // 통계 계산을 useMemo로 최적화
  const { totalEvents, upcomingEvents } = useMemo(() => {
    const total = filteredAndSortedEvents.length;
    const upcoming = filteredAndSortedEvents.filter(e => e.status === 'upcoming').length;
    return { totalEvents: total, upcomingEvents: upcoming };
  }, [filteredAndSortedEvents]);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case '결혼식': return { bg: '#f0f0f0', text: '#666666' };
      case '장례식': return { bg: '#f0f0f0', text: '#666666' };
      case '돌잔치': return { bg: '#f0f0f0', text: '#666666' };
      case '개업식': return { bg: '#f0f0f0', text: '#666666' };
      default: return { bg: '#f0f0f0', text: '#666666' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { bg: '#e8f5e8', text: '#2e7d32' };
      case 'upcoming': return { bg: '#fff3e0', text: '#f57c00' };
      default: return { bg: '#f0f0f0', text: '#666666' };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '완료';
      case 'upcoming': return '예정';
      default: return '기타';
    }
  };


  // 선택된 날짜의 이벤트 필터링
  const getEventsForDate = (date: Date) => {
    return schedules.filter(event => {
      const eventDate = new Date(event.event_date);
      return eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear();
    });
  };

  // 달력에서 이벤트가 있는 날짜들을 markedDates 형태로 변환
  const getMarkedDates = () => {
    const marked: any = {};
    
    schedules.forEach(event => {
      const eventDate = event.event_date;
      marked[eventDate] = {
        marked: true,
        dotColor: '#4a5568',
        activeOpacity: 0.7
      };
    });

    // 오늘 날짜 표시 (기존 스타일과 동일하게)
    const today = new Date().toISOString().split('T')[0];
    if (!marked[today]) {
      marked[today] = {
        selected: true,
        selectedColor: '#f0f0f0',
        selectedTextColor: '#1a1a1a'
      };
    } else {
      marked[today] = {
        ...marked[today],
        selected: true,
        selectedColor: '#f0f0f0',
        selectedTextColor: '#1a1a1a'
      };
    }

    return marked;
  };

  // 달력에서 날짜 선택 시 호출
  const onDayPress = (day: any) => {
    const selectedDateObj = new Date(day.dateString);
    setSelectedDate(selectedDateObj);
    setIsModalVisible(true);
  };

  return (
    <MobileLayout currentPage="schedules">
      {/* 고정 헤더 */}
      <View style={styles.header} onTouchStart={handleSwipeableClose}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>함께할 순간</Text>
          <View style={styles.headerActions}>
            <View style={styles.viewToggleCompact}>
              <TouchableOpacity
                style={[
                  styles.toggleButtonCompact,
                  viewMode === 'list' && styles.activeToggleButtonCompact,
                ]}
                onPress={() => {
                  handleSwipeableClose();
                  setViewMode('list');
                }}
              >
                <Ionicons
                  name="list"
                  size={16}
                  color={viewMode === 'list' ? 'white' : '#666'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButtonCompact,
                  viewMode === 'calendar' && styles.activeToggleButtonCompact,
                ]}
                onPress={() => {
                  handleSwipeableClose();
                  setViewMode('calendar');
                }}
              >
                <Ionicons
                  name="calendar"
                  size={16}
                  color={viewMode === 'calendar' ? 'white' : '#666'}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => {
                handleSwipeableClose();
                setShowFilterModal(true);
              }}
            >
              <Ionicons name="options-outline" size={20} color="#1a1a1a" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 고정 검색바 */}
      <Animated.View style={[styles.searchSection, { opacity: fadeAnim }]}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            // placeholder="일정명, 장소, 경조사 타입으로 검색..."
            // placeholderTextColor="#999"명
            value={searchTerm}
            onChangeText={handleSearchChange}
            onFocus={handleSwipeableClose}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      <ScrollView 
        ref={scrollViewRef} 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        onTouchStart={handleSwipeableClose}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* 로딩 상태 */}
          {/*{loading && (*/}
          {/*  <View style={styles.loadingContainer}>*/}
          {/*    <ActivityIndicator size="large" color="#4a5568" />*/}
          {/*    <Text style={styles.loadingText}>일정 목록을 불러오는 중...</Text>*/}
          {/*  </View>*/}
          {/*)}*/}

          {/* 에러 상태 */}
          {error && !loading && (
            <View style={styles.errorContainer}>
              <Ionicons name="warning-outline" size={48} color="#FF3B30" />
              <Text style={styles.errorTitle}>오류가 발생했습니다</Text>
              <Text style={styles.errorMessage}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => loadSchedules()}
                activeOpacity={0.8}
              >
                <Text style={styles.retryButtonText}>다시 시도</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 정상 데이터가 있을 때만 표시 */}
          {!loading && !error && (
          <>
            {/* 무신사 스타일 통계 카드 */}
            <View style={styles.statsSection}>
          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>
                이번 달
              </Text>
              <View style={styles.statsBadge}>
                <Text style={styles.statsBadgeText}>{schedules.length}개</Text>
              </View>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalEvents}</Text>
                <Text style={styles.statLabel}>총 일정</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{upcomingEvents}</Text>
                <Text style={styles.statLabel}>다가오는 일정</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 에러 상태 */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={48} color="#FF3B30" />
            <Text style={styles.errorTitle}>오류가 발생했습니다</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => loadSchedules()}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>다시 시도</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 뷰 모드에 따른 콘텐츠 */}
        {!error && viewMode === 'list' ? (
          <>
            {/* 무신사 스타일 일정 목록 */}
            <View style={styles.eventsSection}>
              <View style={styles.eventsGrid}>
                {filteredAndSortedEvents.map((event) => {
                const typeStyle = getEventTypeColor(event.event_type);
                const eventDate = new Date(event.event_date);
                const isToday = eventDate.toDateString() === new Date().toDateString();
                const isTomorrow = eventDate.toDateString() === new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString();

                return (
                  <Swipeable 
                    key={event.id}
                    renderRightActions={() => renderRightActions(event.id)}
                    rightThreshold={40}
                    onSwipeableWillOpen={() => handleSwipeableOpen(event.id)}
                    onSwipeableWillClose={handleSwipeableClose}
                  >
                    <TouchableOpacity
                      style={styles.eventCard}
                      activeOpacity={0.8}
                      onPress={() => {
                        if (openSwipeableId !== event.id) {
                          router.push({
                            pathname: '/schedule-detail',
                            params: {
                              id: event.id,
                              data: JSON.stringify(event)
                            }
                          });
                        }
                      }}
                    >
                    {/* 메모 표시 - 카드 모서리 */}
                    {event.memo && event.memo.trim() !== '' && (
                      <View style={styles.memoCorner} />
                    )}

                    {/* 날짜 표시 */}
                    <View style={styles.dateSection}>
                      <View style={styles.dateContainer}>
                        <Text style={styles.dateNumber}>{eventDate.getDate()}</Text>
                        <Text style={styles.dateMonth}>{eventDate.getMonth() + 1}월</Text>
                      </View>
                      {(isToday || isTomorrow) && (
                        <View style={styles.urgentBadge}>
                          <Text style={styles.urgentText}>
                            {isToday ? '오늘' : '내일'}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* 이벤트 정보 */}
                    <View style={styles.eventInfo}>
                      <View style={styles.eventHeader}>
                        <Text style={styles.eventTitle}>{event.title}</Text>
                      </View>

                      <View style={styles.eventDetails}>
                        <View style={styles.detailRow}>
                          <Ionicons name="time-outline" size={14} color="#666" />
                          <Text style={styles.detailText}>{formatTime(event.event_time)}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Ionicons name="location-outline" size={14} color="#666" />
                          <Text style={styles.detailText}>{event.location}</Text>
                        </View>
                      </View>
                    </View>

                    {/* 상태 섹션 (이벤트 타입 + 상태) */}
                    <View style={styles.statusSection}>
                        <View style={[styles.typeBadge, { backgroundColor: typeStyle.bg }]}>
                        <Text style={[styles.typeText, { color: typeStyle.text }]}>
                          {event.event_type}
                        </Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status).bg }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(event.status).text }]}>
                          {getStatusText(event.status)}
                        </Text>
                      </View>
                    </View>
                    </TouchableOpacity>
                  </Swipeable>
                );
              })}
            </View>
          </View>

            {/* 빈 상태 */}
            {totalEvents === 0 && (
              <View style={styles.emptyState}>
                {/*<View style={styles.emptyIcon}>*/}
                {/*  <Ionicons name="calendar-outline" size={48} color="#ddd" />*/}
                {/*</View>*/}
                {/*<Text style={styles.emptyTitle}>일정이 없습니다</Text>*/}
                <Text style={styles.emptyDescription}>일정이 없습니다</Text>
              </View>
            )}
          </>
        ) : (
          <>
            {/* 달력 뷰 */}
            <View style={styles.calendarSection}>
            <Calendar
              current={currentMonth.toISOString().split('T')[0]}
              onDayPress={onDayPress}
              markedDates={getMarkedDates()}
              monthFormat={'yyyy년 M월'}
              hideExtraDays={true}
              firstDay={0}
              onMonthChange={(month) => {
                setCurrentMonth(new Date(month.year, month.month - 1));
              }}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#666666',
                selectedDayBackgroundColor: '#f0f0f0',
                selectedDayTextColor: '#1a1a1a',
                todayTextColor: '#1a1a1a',
                dayTextColor: '#1a1a1a',
                textDisabledColor: '#d9e1e8',
                dotColor: '#4a5568',
                selectedDotColor: '#4a5568',
                arrowColor: '#666666',
                disabledArrowColor: '#d9e1e8',
                monthTextColor: '#1a1a1a',
                indicatorColor: '#666666',
                textDayFontWeight: '500',
                textMonthFontWeight: '600',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 16,
                textMonthFontSize: 20,
                textDayHeaderFontSize: 14,
              }}
              style={styles.calendar}
            />
          </View>
          </>
          )}
          </>
          )}
        </Animated.View>
      </ScrollView>

      {/* 날짜별 일정 모달 */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedDate && `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 일정`}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
              <View style={styles.modalEventsList}>
                {getEventsForDate(selectedDate).map((event) => {
                  const typeStyle = getEventTypeColor(event.event_type);

                  return (
                    <TouchableOpacity
                      key={event.id}
                      style={styles.modalEventCard}
                      activeOpacity={0.8}
                      onPress={() => {
                        setIsModalVisible(false);
                        router.push({
                          pathname: '/schedule-detail',
                          params: {
                            id: event.id,
                            data: JSON.stringify(event)
                          }
                        });
                      }}
                    >
                      {/* 메모 표시 - 카드 모서리 */}
                      {event.memo && event.memo.trim() !== '' && (
                        <View style={styles.memoCorner} />
                      )}

                      {/* 날짜 표시 */}
                      <View style={styles.modalDateSection}>
                        <View style={styles.modalDateContainer}>
                          <Text style={styles.modalDateNumber}>{new Date(event.event_date).getDate()}</Text>
                          <Text style={styles.modalDateMonth}>{new Date(event.event_date).getMonth() + 1}월</Text>
                        </View>
                      </View>

                      {/* 이벤트 정보 */}
                      <View style={styles.modalEventInfo}>
                        <View style={styles.modalEventHeader}>
                          <Text style={styles.modalEventTitle}>{event.title}</Text>
                        </View>
                        
                        <View style={styles.modalEventDetails}>
                          <View style={styles.modalDetailRow}>
                            <Ionicons name="time-outline" size={14} color="#666" />
                            <Text style={styles.modalDetailText}>{formatTime(event.event_time)}</Text>
                          </View>
                          <View style={styles.modalDetailRow}>
                            <Ionicons name="location-outline" size={14} color="#666" />
                            <Text style={styles.modalDetailText}>{event.location}</Text>
                          </View>
                        </View>
                      </View>

                      {/* 상태 섹션 (이벤트 타입 + 상태) */}
                      <View style={styles.modalStatusSection}>
                        <View style={[styles.modalTypeBadge, { backgroundColor: typeStyle.bg }]}>
                          <Text style={[styles.modalTypeText, { color: typeStyle.text }]}>
                            {event.event_type}
                          </Text>
                        </View>
                        <View style={[styles.modalStatusBadge, { backgroundColor: getStatusColor(event.status).bg }]}>
                          <Text style={[styles.modalStatusText, { color: getStatusColor(event.status).text }]}>
                            {getStatusText(event.status)}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyDateState}>
                <Ionicons name="calendar-outline" size={48} color="#ddd" />
                <Text style={styles.emptyDateTitle}>일정이 없습니다</Text>
                <Text style={styles.emptyDateDescription}>
                  {selectedDate && `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일에는 예정된 경조사가 없습니다.`}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* 플로팅 액션 버튼 */}
      <FloatingActionButton />

      {/* 되돌리기 토스트 */}
      {showUndoToast && (
        <View style={styles.undoToast}>
          <View style={styles.undoToastContent}>
            <Text style={styles.undoToastText}>
              {deletedSchedule?.title} 일정이 삭제되었습니다
            </Text>
            <TouchableOpacity 
              style={styles.undoButton}
              onPress={handleUndoDelete}
              activeOpacity={0.8}
            >
              <Text style={styles.undoButtonText}>되돌리기</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 필터 모달 */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowFilterModal(false)}
          />
          <View style={styles.filterModalContent}>
            {/* 하단 시트 핸들 */}
            <View style={styles.sheetHandle} />

            {/* 기본 필터 드롭다운 */}
            <View style={styles.dropdownSection}>
              <Text style={styles.dropdownSectionTitle}>기본 필터</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => {
                  setShowStatusDropdown(!showStatusDropdown);
                  setShowEventTypeDropdown(false);
                  setShowSortDropdown(false);
                }}
              >
                <Text style={styles.dropdownButtonText}>
                  {statusFilter === 'all' ? '전체' : statusFilter === 'upcoming' ? '예정' : '완료'}
                </Text>
                <Ionicons 
                  name={showStatusDropdown ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
              
              {showStatusDropdown && (
                <View style={styles.dropdownOptions}>
                  <TouchableOpacity
                    style={[
                      styles.dropdownOption,
                      statusFilter === 'all' && styles.dropdownOptionSelected
                    ]}
                    onPress={() => {
                      setStatusFilter('all');
                      setShowStatusDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      statusFilter === 'all' && styles.dropdownOptionTextSelected
                    ]}>
                      전체
                    </Text>
                    {statusFilter === 'all' && (
                      <Ionicons name="checkmark" size={16} color="#4a5568" />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.dropdownOption,
                      statusFilter === 'upcoming' && styles.dropdownOptionSelected
                    ]}
                    onPress={() => {
                      setStatusFilter('upcoming');
                      setShowStatusDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      statusFilter === 'upcoming' && styles.dropdownOptionTextSelected
                    ]}>
                      예정
                    </Text>
                    {statusFilter === 'upcoming' && (
                      <Ionicons name="checkmark" size={16} color="#4a5568" />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.dropdownOption,
                      statusFilter === 'completed' && styles.dropdownOptionSelected
                    ]}
                    onPress={() => {
                      setStatusFilter('completed');
                      setShowStatusDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      statusFilter === 'completed' && styles.dropdownOptionTextSelected
                    ]}>
                      완료
                    </Text>
                    {statusFilter === 'completed' && (
                      <Ionicons name="checkmark" size={16} color="#4a5568" />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* 경조사 타입별 필터 드롭다운 */}
            <View style={styles.dropdownSection}>
              <Text style={styles.dropdownSectionTitle}>경조사</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => {
                  setShowEventTypeDropdown(!showEventTypeDropdown);
                  setShowStatusDropdown(false);
                  setShowSortDropdown(false);
                }}
              >
                <Text style={styles.dropdownButtonText}>
                  {eventTypeFilter === 'all' ? '전체' : eventTypeFilter}
                </Text>
                <Ionicons 
                  name={showEventTypeDropdown ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
              
              {showEventTypeDropdown && (
                <View style={styles.dropdownOptions}>
                  <TouchableOpacity
                    style={[
                      styles.dropdownOption,
                      eventTypeFilter === 'all' && styles.dropdownOptionSelected
                    ]}
                    onPress={() => {
                      setEventTypeFilter('all');
                      setShowEventTypeDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      eventTypeFilter === 'all' && styles.dropdownOptionTextSelected
                    ]}>
                      전체
                    </Text>
                    {eventTypeFilter === 'all' && (
                      <Ionicons name="checkmark" size={16} color="#4a5568" />
                    )}
                  </TouchableOpacity>
                  {Object.values(EventType).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.dropdownOption,
                        eventTypeFilter === type && styles.dropdownOptionSelected
                      ]}
                      onPress={() => {
                        setEventTypeFilter(type);
                        setShowEventTypeDropdown(false);
                      }}
                    >
                      <Text style={[
                        styles.dropdownOptionText,
                        eventTypeFilter === type && styles.dropdownOptionTextSelected
                      ]}>
                        {type}
                      </Text>
                      {eventTypeFilter === type && (
                        <Ionicons name="checkmark" size={16} color="#4a5568" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* 정렬 드롭다운 */}
            <View style={styles.dropdownSection}>
              <Text style={styles.dropdownSectionTitle}>정렬</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => {
                  setShowSortDropdown(!showSortDropdown);
                  setShowStatusDropdown(false);
                  setShowEventTypeDropdown(false);
                }}
              >
                <Text style={styles.dropdownButtonText}>
                  {sortBy === 'date_asc' ? '최신순' : '오래된순'}
                </Text>
                <Ionicons 
                  name={showSortDropdown ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
              
              {showSortDropdown && (
                <View style={styles.dropdownOptions}>
                  <TouchableOpacity
                    style={[
                      styles.dropdownOption,
                      sortBy === 'date_asc' && styles.dropdownOptionSelected
                    ]}
                    onPress={() => {
                      setSortBy('date_asc');
                      setShowSortDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      sortBy === 'date_asc' && styles.dropdownOptionTextSelected
                    ]}>
                      최신순
                    </Text>
                    {sortBy === 'date_asc' && (
                      <Ionicons name="checkmark" size={16} color="#4a5568" />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.dropdownOption,
                      sortBy === 'date_desc' && styles.dropdownOptionSelected
                    ]}
                    onPress={() => {
                      setSortBy('date_desc');
                      setShowSortDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      sortBy === 'date_desc' && styles.dropdownOptionTextSelected
                    ]}>
                      오래된순
                    </Text>
                    {sortBy === 'date_desc' && (
                      <Ionicons name="checkmark" size={16} color="#4a5568" />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* 적용 버튼 */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={applyFilter}
              >
                <Text style={styles.applyButtonText}>적용</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </MobileLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },

  // 헤더 스타일
  header: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 20,
  },


  // 통계 섹션
  statsSection: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 15,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  statsBadge: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statsBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a5568',
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e9ecef',
    marginHorizontal: 20,
  },

  // 일정 섹션
  eventsSection: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  sectionCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  eventsGrid: {
    gap: 12,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    position: 'relative',
  },

  // 날짜 섹션
  dateSection: {
    marginRight: 16,
    alignItems: 'center',
    minWidth: 30,
  },
  dateContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: 'black',
    lineHeight: 28,
    textAlign: 'center',
  },
  dateMonth: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  urgentBadge: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  urgentText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },

  // 이벤트 정보
  eventInfo: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  eventDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },

  // 상태 섹션
  statusSection: {
    marginLeft: 12,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 4,
    minWidth: 80,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  memoCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderTopWidth: 20,
    borderTopColor: '#E5E5E5',
    borderLeftWidth: 20,
    borderLeftColor: 'transparent',
    borderTopRightRadius: 16,
    zIndex: 1,
  },


  // 달력 스타일
  calendarSection: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    zIndex: 1,
    elevation: 2,
  },
  calendar: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    height: 360, // 고정 높이 설정
    zIndex: 1,
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  monthNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  monthTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  weekdayHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekday: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekdayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  sundayText: {
    color: '#ff6b6b',
  },
  saturdayText: {
    color: '#4a5568',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 15,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  emptyDayText: {
    fontSize: 16,
    color: 'transparent',
  },
  todayDay: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  todayText: {
    color: 'black',
    fontWeight: '700',
  },
  eventDay: {
    backgroundColor: '#e2e8f0',
    borderRadius: 20,
  },
  eventDayText: {
    color: '#4a5568',
    fontWeight: '600',
  },
  eventDot: {
    position: 'absolute',
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4a5568',
  },

  // 모달 스타일
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  modalEventsList: {
    gap: 12,
  },
  modalEventCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    position: 'relative',
  },

  // 모달 날짜 섹션
  modalDateSection: {
    marginRight: 16,
    alignItems: 'center',
    minWidth: 40,
  },
  modalDateContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  modalDateNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: 'black',
    lineHeight: 28,
    textAlign: 'center',
    minWidth: 24,
  },
  modalDateMonth: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },

  // 모달 이벤트 정보
  modalEventInfo: {
    flex: 1,
  },
  modalEventHeader: {
    marginBottom: 6,
  },
  modalEventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  modalEventDetails: {
    gap: 4,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalDetailText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },

  // 모달 상태 섹션
  modalStatusSection: {
    marginLeft: 12,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 4,
    minWidth: 80,
  },
  modalTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  modalTypeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  modalStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalStatusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  emptyDateState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyDateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDateDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },

  // 헤더 액션 스타일
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  viewToggleCompact: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  toggleButtonCompact: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  activeToggleButtonCompact: {
    backgroundColor: 'black',
  },
  filterButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 검색 섹션
  searchSection: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '400',
  },
  clearButton: {
    marginLeft: 8,
  },

  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  filterModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },

  // 드롭다운 스타일
  dropdownSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  dropdownOptions: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownOptionSelected: {
    backgroundColor: '#f8f9fa',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  dropdownOptionTextSelected: {
    color: '#4a5568',
    fontWeight: '600',
  },

  // 모달 액션 버튼
  modalActions: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  applyButton: {
    backgroundColor: '#4a5568',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  applyButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#4a5568',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },

  // 스와이프 삭제 스타일 (현업 표준)
  deleteAction: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 16,
  },
  deleteActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // 되돌리기 토스트 스타일
  undoToast: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  undoToastContent: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  undoToastText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: 16,
  },
  undoButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  undoButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // 로딩 상태 스타일
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },

  // // 에러 상태 스타일
  // errorContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   paddingVertical: 60,
  //   paddingHorizontal: 40,
  // },
  // errorTitle: {
  //   fontSize: 18,
  //   fontWeight: '600',
  //   color: '#1F2937',
  //   marginTop: 16,
  //   marginBottom: 8,
  // },
  // errorMessage: {
  //   fontSize: 14,
  //   color: '#6B7280',
  //   textAlign: 'center',
  //   lineHeight: 20,
  //   marginBottom: 24,
  // },
  // retryButton: {
  //   backgroundColor: '#4F46E5',
  //   paddingHorizontal: 24,
  //   paddingVertical: 12,
  //   borderRadius: 8,
  // },
  // retryButtonText: {
  //   color: 'white',
  //   fontSize: 16,
  //   fontWeight: '600',
  // },

  // 빈 상태 스타일
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default Schedules;
