import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
import { colors } from '../lib/utils';

const Ledgers: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // 필터 상태
  const [filterType, setFilterType] = useState<'all' | 'given' | 'received'>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');
  
  // 드롭다운 상태
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Mock data for ledgers - 경조사 내역 목록
  const ledgers = [
    {
      id: 1,
      name: "김철수",
      relationship: "친구",
      amount: 100000,
      eventType: "결혼식",
      date: "2024-03-15",
      type: "given" // given: 준 금액, received: 받은 금액
    },
    {
      id: 2,
      name: "박영희",
      relationship: "직장동료",
      amount: 50000,
      eventType: "돌잔치",
      date: "2024-02-20",
      type: "received"
    },
    {
      id: 3,
      name: "이민수",
      relationship: "가족",
      amount: 200000,
      eventType: "장례식",
      date: "2024-01-10",
      type: "given"
    },
    {
      id: 4,
      name: "정수정",
      relationship: "지인",
      amount: 30000,
      eventType: "개업식",
      date: "2023-12-25",
      type: "received"
    },
    {
      id: 5,
      name: "최민호",
      relationship: "친구",
      amount: 150000,
      eventType: "결혼식",
      date: "2023-11-10",
      type: "given"
    },
    {
      id: 6,
      name: "한지영",
      relationship: "가족",
      amount: 80000,
      eventType: "돌잔치",
      date: "2023-10-05",
      type: "received"
    }
  ];

  // 필터링 및 정렬 로직
  const filteredAndSortedLedgers = ledgers
    .filter(ledger => {
      // 검색어 필터
      const matchesSearch = ledger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ledger.relationship.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ledger.eventType.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 타입 필터
      const matchesType = filterType === 'all' || ledger.type === filterType;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date_asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount_desc':
          return b.amount - a.amount;
        case 'amount_asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

  const totalGiven = ledgers.filter(ledger => ledger.type === 'given').reduce((sum, ledger) => sum + ledger.amount, 0);
  const totalReceived = ledgers.filter(ledger => ledger.type === 'received').reduce((sum, ledger) => sum + ledger.amount, 0);

  return (
    <MobileLayout currentPage="contacts">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 무신사 스타일 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>인연 장부</Text>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilterModal(true)}
            >
              <Ionicons name="options-outline" size={20} color={colors.foreground} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 무신사 스타일 검색바 */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="이름이나 관계로 검색..."
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
              <Text style={styles.statsTitle}>전체 요약</Text>
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
                <TouchableOpacity 
                  key={ledger.id} 
                  style={styles.ledgerCard}
                  activeOpacity={0.8}
                  onPress={() => router.push(`/ledger-detail?id=${ledger.id}`)}
                >
                  {/* 정보 영역 */}
                  <View style={styles.ledgerInfo}>
                    <View style={styles.ledgerHeader}>
                      <Text style={styles.ledgerName}>{ledger.name}</Text>
                    </View>
                    
                    <View style={styles.ledgerDetails}>
                      <Text style={styles.relationshipText}>{ledger.relationship}</Text>
                      <Text style={styles.separator}>•</Text>
                      <Text style={styles.eventTypeText}>{ledger.eventType}</Text>
                    </View>
                    
                    <View style={styles.ledgerMeta}>
                      <Text style={styles.dateText}>{ledger.date}</Text>
                    </View>
                  </View>

                  {/* 금액 영역 */}
                  <View style={styles.amountSection}>
                    <Text style={[styles.amountText, { color: '#4a5568' }]}>
                      {ledger.amount.toLocaleString()}원
                    </Text>
                    <Text style={[styles.typeLabel, { color: ledger.type === 'given' ? '#4a5568' : '#718096' }]}>
                      {ledger.type === 'given' ? '나눔' : '받음'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 빈 상태 */}
        {filteredAndSortedLedgers.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="people-outline" size={48} color="#ddd" />
            </View>
            <Text style={styles.emptyTitle}>검색 결과가 없습니다</Text>
            <Text style={styles.emptyDescription}>다른 검색어를 시도해보세요</Text>
          </View>
        )}
      </ScrollView>

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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    paddingHorizontal: 20,
    paddingVertical: 20,
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

  // 장부 섹션
  ledgersSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  },

  // 장부 정보 섹션
  ledgerInfo: {
    flex: 1,
  },
  ledgerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  ledgerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
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
});

export default Ledgers;
