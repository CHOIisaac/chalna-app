import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import FloatingActionButton from '../components/common/FloatingActionButton';
import MobileLayout from '../components/layout/MobileLayout';

const Events: React.FC = () => {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // 탭이 포커스될 때마다 스크롤을 맨 위로 이동
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, [])
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
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

  // Mock data for events
  const events = [
    {
      id: "1",
      title: "김철수 결혼식",
      type: "결혼식",
      date: new Date(),
      location: "롯데호텔 크리스탈볼룸",
      time: "12:00",
      status: "completed", // completed, upcoming
      memo: "신랑과 대학 동기입니다. 축가 부를 예정입니다.",
    },
    {
      id: "2",
      title: "박영희 어머님 장례식",
      type: "장례식",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      location: "서울추모공원",
      time: "14:00",
      status: "upcoming",
      memo: "",
    },
    {
      id: "3",
      title: "이민수 아들 돌잔치",
      type: "돌잔치",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      location: "강남구청 웨딩홀",
      time: "11:30",
      status: "upcoming",
      memo: "아이 돌선물 준비하기",
    },
    {
      id: "4",
      title: "최민호 개업식",
      type: "개업식",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      location: "강남구 상가",
      time: "10:00",
      status: "upcoming",
      memo: "",
    },
    {
      id: "5",
      title: "한지영 결혼식",
      type: "결혼식",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      location: "웨딩홀",
      time: "15:00",
      status: "completed",
      memo: "헌금 10만원 전달 완료",
    }
  ];

  // 필터링 및 정렬 로직
  const filteredAndSortedEvents = events
    .filter(event => {
      // 검색어 필터
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 상태 필터
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      
      // 경조사 타입 필터
      const matchesEventType = eventTypeFilter === 'all' || event.type === eventTypeFilter;
      
      return matchesSearch && matchesStatus && matchesEventType;
    })
    .sort((a, b) => {
      if (sortBy === 'date_asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

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

  // 날짜 클릭 핸들러
  const handleDatePress = (day: number) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const selectedDateObj = new Date(year, month, day);

    setSelectedDate(selectedDateObj);
    setIsModalVisible(true);
  };

  // 선택된 날짜의 이벤트 필터링
  const getEventsForDate = (date: Date) => {
    return events.filter(event =>
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  // 달력 렌더링 함수
  const renderCalendarDays = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 이번 달 첫째 날
    const firstDay = new Date(year, month, 1);
    // 이번 달 마지막 날
    const lastDay = new Date(year, month + 1, 0);
    // 첫째 날의 요일 (0=일요일)
    const firstDayOfWeek = firstDay.getDay();
    // 이번 달 총 일수
    const daysInMonth = lastDay.getDate();

    const days = [];

    // 이전 달 빈 칸들
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.calendarDay}>
          <Text style={styles.emptyDayText}></Text>
        </View>
      );
    }

    // 이번 달 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const hasEvent = events.some(event =>
        event.date.getDate() === day &&
        event.date.getMonth() === month &&
        event.date.getFullYear() === year
      );
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            isToday && styles.todayDay
          ]}
          activeOpacity={0.7}
          onPress={() => handleDatePress(day)}
        >
          <Text style={[
            styles.dayText,
            isToday && styles.todayText
          ]}>
            {day}
          </Text>
          {hasEvent && <View style={styles.eventDot} />}
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <MobileLayout currentPage="schedules">
      <ScrollView ref={scrollViewRef} style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 무신사 스타일 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>함께할 순간</Text>
            <View style={styles.headerActions}>
              <View style={styles.viewToggleCompact}>
                <TouchableOpacity
                  style={[
                    styles.toggleButtonCompact,
                    viewMode === 'list' && styles.activeToggleButtonCompact,
                  ]}
                  onPress={() => setViewMode('list')}
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
                  onPress={() => setViewMode('calendar')}
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
                onPress={() => setShowFilterModal(true)}
              >
                <Ionicons name="options-outline" size={20} color="#1a1a1a" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 검색 섹션 */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="일정명, 장소, 경조사 타입으로 검색..."
              placeholderTextColor="#999"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={() => setSearchTerm('')} style={styles.clearButton}>
                <Ionicons name="close-circle" size={18} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 무신사 스타일 통계 카드 */}
        <View style={styles.statsSection}>
          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>
                {new Date().getFullYear()}년 {new Date().getMonth() + 1}월
              </Text>
              <View style={styles.statsBadge}>
                <Text style={styles.statsBadgeText}>{events.length}개</Text>
              </View>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{filteredAndSortedEvents.length}</Text>
                <Text style={styles.statLabel}>총 일정</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{filteredAndSortedEvents.filter(e => e.status === 'upcoming').length}</Text>
                <Text style={styles.statLabel}>다가오는 일정</Text>
              </View>
            </View>
          </View>
        </View>


        {/* 뷰 모드에 따른 콘텐츠 */}
        {viewMode === 'list' ? (
          /* 무신사 스타일 일정 목록 */
          <View style={styles.eventsSection}>
            <View style={styles.eventsGrid}>
              {filteredAndSortedEvents.map((event) => {
                const typeStyle = getEventTypeColor(event.type);
                const isToday = event.date.toDateString() === new Date().toDateString();
                const isTomorrow = event.date.toDateString() === new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString();

                return (
                  <TouchableOpacity
                    key={event.id}
                    style={styles.eventCard}
                    activeOpacity={0.8}
                    onPress={() => router.push(`/schedule-detail?id=${event.id}`)}
                  >
                    {/* 메모 표시 - 카드 모서리 */}
                    {event.memo && event.memo.trim() !== '' && (
                      <View style={styles.memoCorner} />
                    )}

                    {/* 날짜 표시 */}
                    <View style={styles.dateSection}>
                      <View style={styles.dateContainer}>
                        <Text style={styles.dateNumber}>{event.date.getDate()}</Text>
                        <Text style={styles.dateMonth}>{event.date.getMonth() + 1}월</Text>
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
                          <Text style={styles.detailText}>{event.time}</Text>
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
                          {event.type}
                        </Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status).bg }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(event.status).text }]}>
                          {getStatusText(event.status)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          /* 달력 뷰 */
          <View style={styles.calendarSection}>

            <View style={styles.calendarContainer}>
              {/* 달력 헤더 */}
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarTitle}>
                  {new Date().getFullYear()}년 {new Date().getMonth() + 1}월
                </Text>
              </View>

              {/* 요일 헤더 */}
              <View style={styles.weekdayHeader}>
                {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                  <View key={day} style={styles.weekday}>
                    <Text style={[
                      styles.weekdayText,
                      index === 0 && styles.sundayText,
                      index === 6 && styles.saturdayText
                    ]}>
                      {day}
                    </Text>
                  </View>
                ))}
              </View>

              {/* 달력 그리드 */}
              <View style={styles.calendarGrid}>
                {renderCalendarDays()}
              </View>
            </View>
          </View>
        )}

        {/* 무신사 스타일 추천 섹션 */}
        <View style={styles.recommendationsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>추천 서비스</Text>
          </View>

          <View style={styles.recommendationsGrid}>
            <TouchableOpacity style={styles.recommendationCard} activeOpacity={0.8}>
              <View style={styles.recommendationIcon}>
                <Ionicons name="heart-outline" size={24} color="#ff6b6b" />
              </View>
              <View style={styles.recommendationInfo}>
                <Text style={styles.recommendationTitle}>웨딩홀 검색</Text>
                <Text style={styles.recommendationDescription}>지역별 웨딩홀 정보</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.recommendationCard} activeOpacity={0.8}>
              <View style={styles.recommendationIcon}>
                <Ionicons name="flower-outline" size={24} color="#4ecdc4" />
              </View>
              <View style={styles.recommendationInfo}>
                <Text style={styles.recommendationTitle}>장례식장 안내</Text>
                <Text style={styles.recommendationDescription}>24시간 운영 장례식장</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.recommendationCard} activeOpacity={0.8}>
              <View style={styles.recommendationIcon}>
                <Ionicons name="gift-outline" size={24} color="#ffa726" />
              </View>
              <View style={styles.recommendationInfo}>
                <Text style={styles.recommendationTitle}>연회장 예약</Text>
                <Text style={styles.recommendationDescription}>돌잔치, 회갑연 장소</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
          </View>
        </View>
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
                  const typeStyle = getEventTypeColor(event.type);

                  return (
                    <TouchableOpacity
                      key={event.id}
                      style={styles.modalEventCard}
                      activeOpacity={0.8}
                      onPress={() => {
                        setIsModalVisible(false);
                        router.push(`/schedule-detail?id=${event.id}`);
                      }}
                    >
                      {/* 메모 표시 - 카드 모서리 */}
                      {event.memo && event.memo.trim() !== '' && (
                        <View style={styles.memoCorner} />
                      )}

                      {/* 날짜 표시 */}
                      <View style={styles.modalDateSection}>
                        <View style={styles.modalDateContainer}>
                          <Text style={styles.modalDateNumber}>{event.date.getDate()}</Text>
                          <Text style={styles.modalDateMonth}>{event.date.getMonth() + 1}월</Text>
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
                            <Text style={styles.modalDetailText}>{event.time}</Text>
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
                            {event.type}
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
              <Text style={styles.dropdownSectionTitle}>경조사 타입</Text>
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
                  {['결혼식', '장례식', '돌잔치', '개업식'].map((type) => (
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
                onPress={() => setShowFilterModal(false)}
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

  // 헤더 스타일
  header: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
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
    fontSize: 28,
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
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
    fontSize: 18,
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
    fontSize: 24,
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
    paddingHorizontal: 20,
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

  // 추천 섹션
  recommendationsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  recommendationsGrid: {
    gap: 12,
  },
  recommendationCard: {
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
  },
  recommendationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 13,
    color: '#666',
  },

  // 달력 스타일
  calendarSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    alignItems: 'center',
    marginBottom: 20,
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
    paddingVertical: 16,
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
});

export default Events;
