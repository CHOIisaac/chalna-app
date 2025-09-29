import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import FloatingActionButton from '../components/common/FloatingActionButton';
import MobileLayout from '../components/layout/MobileLayout';
import { colors } from '../lib/utils';
import { handleApiError, LedgerItem, ledgerService } from '../services/api';

const Ledgers: React.FC = () => {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // 현재 열린 Swipeable ID (단일 관리로 성능 최적화)
  const [openSwipeableId, setOpenSwipeableId] = useState<number | null>(null);
  
  // 필터 상태
  const [filterType, setFilterType] = useState<'all' | 'given' | 'received'>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');
  
  // 드롭다운 상태
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // API 상태 관리
  const [ledgers, setLedgers] = useState<LedgerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 삭제된 항목과 되돌리기 상태
  const [deletedLedger, setDeletedLedger] = useState<LedgerItem | null>(null);
  const [showUndoToast, setShowUndoToast] = useState(false);

  // 페이드인 애니메이션
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // API 함수들 (메모이제이션)
  const loadLedgers = useCallback(async (filterParams?: {
    search?: string;
    entry_type?: 'given' | 'received';
    sort_by?: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
  }) => {
    console.log('📝 loadLedgers 함수 시작됨', { filterParams });
    try {
      setLoading(true);
      setError(null);
      
      // API 응답 시간 측정
      console.log('📝 API 호출 시작...');
      const startTime = Date.now();
      const response = await ledgerService.getLedgers(filterParams);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      console.log(`📝 장부 API 응답 시간: ${responseTime}ms`);
      console.log('📝 API 응답 받음:', response);
      
      if (response.success) {
        setLedgers(response.data);
        console.log('📝 장부 데이터 개수:', response.data.length);
      } else {
        console.log('📝 API 응답 실패:', response.error);
        setError(response.error || '장부 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('📝 장부 목록 로드 실패:', err);
      setError(handleApiError(err));
    } finally {
      console.log('📝 loadLedgers 함수 완료');
      setLoading(false);
    }
  }, []);

  // 검색어 전용 파라미터 빌드 함수 (검색어만 의존성으로 가짐)
  const buildSearchParams = useCallback(() => {
    const searchParams: {
      search?: string;
      entry_type?: 'given' | 'received';
      sort_by?: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
    } = {};

    // 검색어만 추가 (현재 적용된 필터 상태 유지)
    if (searchTerm.trim()) {
      searchParams.search = searchTerm.trim();
    }

    // 현재 적용된 타입 필터 유지
    if (filterType !== 'all') {
      searchParams.entry_type = filterType;
    }

    // 현재 적용된 정렬 유지
    searchParams.sort_by = sortBy;

    return searchParams;
  }, [searchTerm]); // 검색어만 의존성으로 가짐

  // 전체 필터 파라미터 빌드 함수 (적용 버튼용)
  const buildFilterParams = useCallback(() => {
    const filterParams: {
      search?: string;
      entry_type?: 'given' | 'received';
      sort_by?: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
    } = {};

    // 검색어 추가
    if (searchTerm.trim()) {
      filterParams.search = searchTerm.trim();
    }

    // 타입 필터 추가
    if (filterType !== 'all') {
      filterParams.entry_type = filterType;
    }

    // 정렬 추가
    filterParams.sort_by = sortBy;

    return filterParams;
  }, [searchTerm, filterType, sortBy]);

  // 필터 적용 함수 (메모이제이션)
  const applyFilter = useCallback(async () => {
    const filterParams = buildFilterParams();
    
    // API 호출
    await loadLedgers(filterParams);
    
    // 모달 닫기
    setShowFilterModal(false);
  }, [buildFilterParams, loadLedgers]);

  // 검색어 변경 시 실시간 필터링 (디바운싱 적용, 메모이제이션)
  const handleSearchChange = useCallback((text: string) => {
    setSearchTerm(text);
  }, []);


  // 검색어 변경 시 디바운싱된 API 호출 (검색어만 실시간 적용)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const searchParams = buildSearchParams();
      loadLedgers(searchParams);
    }, 200); // 200ms로 최적화 (반응성 향상)

    return () => clearTimeout(timeoutId);
  }, [searchTerm, buildSearchParams, loadLedgers]); // 검색어만 의존성 배열에 포함

  // 탭이 포커스될 때 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      // Swipeable 제거로 인한 성능 최적화
      // 데이터 새로고침
      loadLedgers();
    }, [loadLedgers])
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

  // 삭제 함수 (API 연동)
  const handleDeleteLedger = async (ledgerId: number) => {
    const ledgerToDelete = ledgers.find(ledger => ledger.id === ledgerId);
    if (!ledgerToDelete) return;

    try {
      // UI에서 먼저 제거 (낙관적 업데이트)
      setLedgers(prevLedgers => prevLedgers.filter(ledger => ledger.id !== ledgerId));
      
      // 되돌리기를 위해 삭제된 항목 저장
      setDeletedLedger(ledgerToDelete);
      setShowUndoToast(true);
      
      // API 호출로 실제 삭제
      const response = await ledgerService.deleteLedger(ledgerId);
      
      if (!response.success) {
        // API 삭제 실패 시 UI 복원
        setLedgers(prevLedgers => [...prevLedgers, ledgerToDelete].sort((a, b) => a.id - b.id));
        setDeletedLedger(null);
        setShowUndoToast(false);
        Alert.alert('삭제 실패', response.error || '장부 삭제에 실패했습니다.');
        return;
      }
      
      // 5초 후에 되돌리기 토스트 자동 사라짐
      setTimeout(() => {
        setShowUndoToast(false);
        setDeletedLedger(null);
      }, 5000);
      
    } catch (error) {
      console.error('장부 삭제 실패:', error);
      // API 삭제 실패 시 UI 복원
      setLedgers(prevLedgers => [...prevLedgers, ledgerToDelete].sort((a, b) => a.id - b.id));
      setDeletedLedger(null);
      setShowUndoToast(false);
      Alert.alert('삭제 실패', handleApiError(error));
    }
  };

  // 되돌리기 함수 (API 연동)
  const handleUndoDelete = async () => {
    if (!deletedLedger) return;

    try {
      // UI에서 먼저 복원
      setLedgers(prevLedgers => [...prevLedgers, deletedLedger].sort((a, b) => a.id - b.id));
      setDeletedLedger(null);
      setShowUndoToast(false);

      // API 호출로 복원 (새로 생성)
      const { id, ...ledgerData } = deletedLedger;
      const response = await ledgerService.createLedger(ledgerData);
      
      if (!response.success) {
        // API 복원 실패 시 다시 데이터 로드
        await loadLedgers();
        Alert.alert('복원 실패', response.error || '장부 복원에 실패했습니다.');
      } else {
        // 성공 시 새로운 ID로 업데이트
        setLedgers(prevLedgers => 
          prevLedgers.map(ledger => 
            ledger.id === deletedLedger.id ? response.data : ledger
          )
        );
      }
    } catch (error) {
      console.error('장부 복원 실패:', error);
      // API 복원 실패 시 다시 데이터 로드
      await loadLedgers();
      Alert.alert('복원 실패', handleApiError(error));
    }
  };

  // Swipeable 관리 (단순화된 버전)
  const handleSwipeableOpen = (id: number) => {
    setOpenSwipeableId(id);
  };

  const handleSwipeableClose = () => {
    setOpenSwipeableId(null);
  };

  // 스와이프 삭제 버튼 렌더링
  const renderRightActions = (ledgerId: number) => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => handleDeleteLedger(ledgerId)}
        activeOpacity={0.8}
      >
        <Text style={styles.deleteActionText}>삭제</Text>
      </TouchableOpacity>
    );
  };

  // 서버에서 이미 필터링 및 정렬된 데이터 사용
  const filteredAndSortedLedgers = ledgers || [];

  // 통계 계산을 useMemo로 최적화
  const { totalGiven, totalReceived } = useMemo(() => {
    const given = ledgers.filter(ledger => ledger.entry_type === 'given').reduce((sum, ledger) => sum + ledger.amount, 0);
    const received = ledgers.filter(ledger => ledger.entry_type === 'received').reduce((sum, ledger) => sum + ledger.amount, 0);
    return { totalGiven: given, totalReceived: received };
  }, [ledgers]);

  return (
    <MobileLayout currentPage="ledgers">
      {/* 고정 헤더 */}
      <View style={styles.header} onTouchStart={handleSwipeableClose}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>장부 기록</Text>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => {
              handleSwipeableClose();
              setShowFilterModal(true);
            }}
          >
            <Ionicons name="options-outline" size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 고정 검색바 */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            // placeholder="이름이나 관계로 검름색..."
            // placeholderTextColor="#999"
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
      </View>

      <ScrollView 
        ref={scrollViewRef} 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        onTouchStart={handleSwipeableClose}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* 에러 상태 */}
          {error && !loading && (
            <View style={styles.errorContainer}>
              <Ionicons name="warning-outline" size={48} color="#FF3B30" />
              <Text style={styles.errorTitle}>오류가 발생했습니다</Text>
              <Text style={styles.errorMessage}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => loadLedgers()}
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
                  <Text style={styles.statsTitle}>이번 달</Text>
                  <View style={styles.statsBadge}>
                    <Text style={styles.statsBadgeText}>{ledgers.length}명</Text>
                  </View>
                </View>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{totalGiven.toLocaleString()}</Text>
                    <Text style={styles.statLabel}>나눈 마음</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{totalReceived.toLocaleString()}</Text>
                    <Text style={styles.statLabel}>받은 마음</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 경조사 내역 목록 */}
            <View style={styles.ledgersSection}>
              <View style={styles.ledgersList}>
                {filteredAndSortedLedgers.map((ledger) => {
                  return (
                    <Swipeable 
                      key={ledger.id}
                      renderRightActions={() => renderRightActions(ledger.id)}
                      rightThreshold={40}
                      onSwipeableWillOpen={() => handleSwipeableOpen(ledger.id)}
                      onSwipeableWillClose={handleSwipeableClose}
                    >
                      <TouchableOpacity
                        style={styles.ledgerCard}
                        activeOpacity={0.8}
                        onPress={() => {
                          if (openSwipeableId !== ledger.id) {
                            router.push({
                              pathname: '/ledger-detail',
                              params: {
                                id: ledger.id.toString(),
                                data: JSON.stringify(ledger)
                              }
                            });
                          }
                        }}
                      >
                        {/* 메모 표시 - 카드 모서리 */}
                        {ledger.memo && ledger.memo.trim() !== '' && (
                          <View style={styles.memoCorner} />
                        )}

                        {/* 정보 영역 */}
                        <View style={styles.ledgerInfo}>
                          <View style={styles.ledgerHeader}>
                            <Text style={styles.ledgerName}>{ledger.counterparty_name}</Text>
                          </View>
                          
                          <View style={styles.ledgerDetails}>
                            <Text style={styles.relationshipText}>{ledger.relationship_type}</Text>
                            <Text style={styles.separator}>•</Text>
                            <Text style={styles.eventTypeText}>{ledger.event_type}</Text>
                          </View>
                          
                          <View style={styles.ledgerMeta}>
                            <Text style={styles.dateText}>{ledger.event_date}</Text>
                          </View>
                        </View>

                        {/* 금액 영역 */}
                        <View style={styles.amountSection}>
                          <Text style={[styles.amountText, { color: '#4a5568' }]}>
                            {ledger.amount.toLocaleString()}원
                          </Text>
                          <Text style={[styles.typeLabel, { color: ledger.entry_type === 'given' ? '#4a5568' : '#718096' }]}>
                            {ledger.entry_type === 'given' ? '나눔' : '받음'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </Swipeable>
                  );
                })}
              </View>
            </View>

            {/* 빈 상태 */}
            {filteredAndSortedLedgers.length === 0 && (
              <View style={styles.emptyState}>
                {/*<View style={styles.emptyIcon}>*/}
                {/*  <Ionicons name="pencil-outline" size={48} color="#ddd" />*/}
                {/*</View>*/}
                {/*<Text style={styles.emptyTitle}>검색 결과가 없습니다</Text>*/}
                <Text style={styles.emptyDescription}>기록이 없습니다</Text>
              </View>
            )}
          </>
          )}
        </Animated.View>
      </ScrollView>

      {/* 플로팅 액션 버튼 */}
      <FloatingActionButton />

      {/* 되돌리기 토스트 */}
      {showUndoToast && (
        <View style={styles.undoToast}>
          <View style={styles.undoToastContent}>
            <Text style={styles.undoToastText}>
              {deletedLedger?.counterparty_name} 기록이 삭제되었습니다
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
          <View style={styles.modalContent}>
            {/* 하단 시트 핸들 */}
            <View style={styles.sheetHandle} />

            {/* 기본 필터 드롭다운 */}
            <View style={styles.dropdownSection}>
              <Text style={styles.dropdownSectionTitle}>기본 필터</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => {
                  setShowFilterDropdown(!showFilterDropdown);
                  setShowSortDropdown(false);
                }}
              >
                <Text style={styles.dropdownButtonText}>
                  {filterType === 'all' ? '전체' : filterType === 'given' ? '나눔' : '받음'}
                </Text>
                <Ionicons 
                  name={showFilterDropdown ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
              
              {showFilterDropdown && (
                <View style={styles.dropdownOptions}>
                  <TouchableOpacity
                    style={[
                      styles.dropdownOption,
                      filterType === 'all' && styles.dropdownOptionSelected
                    ]}
                    onPress={() => {
                      setFilterType('all');
                      setShowFilterDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      filterType === 'all' && styles.dropdownOptionTextSelected
                    ]}>
                      전체
                    </Text>
                    {filterType === 'all' && (
                      <Ionicons name="checkmark" size={16} color="#4a5568" />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.dropdownOption,
                      filterType === 'given' && styles.dropdownOptionSelected
                    ]}
                    onPress={() => {
                      setFilterType('given');
                      setShowFilterDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      filterType === 'given' && styles.dropdownOptionTextSelected
                    ]}>
                      나눔
                    </Text>
                    {filterType === 'given' && (
                      <Ionicons name="checkmark" size={16} color="#4a5568" />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.dropdownOption,
                      filterType === 'received' && styles.dropdownOptionSelected
                    ]}
                    onPress={() => {
                      setFilterType('received');
                      setShowFilterDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      filterType === 'received' && styles.dropdownOptionTextSelected
                    ]}>
                      받음
                    </Text>
                    {filterType === 'received' && (
                      <Ionicons name="checkmark" size={16} color="#4a5568" />
                    )}
                  </TouchableOpacity>
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
                  setShowFilterDropdown(false);
                }}
              >
                <Text style={styles.dropdownButtonText}>
                  {sortBy === 'date_desc' ? '최신순' :
                   sortBy === 'date_asc' ? '오래된순' :
                   sortBy === 'amount_desc' ? '높은금액순' : '낮은금액순'}
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
                      최신순
                    </Text>
                    {sortBy === 'date_desc' && (
                      <Ionicons name="checkmark" size={16} color="#4a5568" />
                    )}
                  </TouchableOpacity>
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
                      오래된순
                    </Text>
                    {sortBy === 'date_asc' && (
                      <Ionicons name="checkmark" size={16} color="#4a5568" />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.dropdownOption,
                      sortBy === 'amount_desc' && styles.dropdownOptionSelected
                    ]}
                    onPress={() => {
                      setSortBy('amount_desc');
                      setShowSortDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      sortBy === 'amount_desc' && styles.dropdownOptionTextSelected
                    ]}>
                      높은금액순
                    </Text>
                    {sortBy === 'amount_desc' && (
                      <Ionicons name="checkmark" size={16} color="#4a5568" />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.dropdownOption,
                      sortBy === 'amount_asc' && styles.dropdownOptionSelected
                    ]}
                    onPress={() => {
                      setSortBy('amount_asc');
                      setShowSortDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      sortBy === 'amount_asc' && styles.dropdownOptionTextSelected
                    ]}>
                      낮은금액순
                    </Text>
                    {sortBy === 'amount_asc' && (
                      <Ionicons name="checkmark" size={16} color="#4a5568" />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* 적용 버튼 */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.applyButton, loading && styles.applyButtonDisabled]}
                onPress={applyFilter}
                disabled={loading}
              >
                <Text style={styles.applyButtonText}>
                  {loading ? '적용 중...' : '적용'}
                </Text>
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 20,
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

  // 장부 섹션
  ledgersSection: {
    paddingHorizontal: 24,
    paddingBottom: 20, // 하단 네비게이션과의 충분한 간격 확보
  },
  ledgersList: {
    gap: 12,
  },
  ledgerCard: {
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

  // 장부 정보 섹션
  ledgerInfo: {
    flex: 1,
  },
  ledgerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ledgerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  ledgerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  relationshipText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  separator: {
    fontSize: 13,
    color: '#999',
    marginHorizontal: 6,
  },
  eventTypeText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  ledgerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },

  // 금액 섹션
  amountSection: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  typeLabel: {
    fontSize: 12,
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

  // 빈 상태
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
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
  modalContent: {
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
    backgroundColor: 'black',
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
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
  },

  // 에러 상태 스타일
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
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
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Ledgers;
