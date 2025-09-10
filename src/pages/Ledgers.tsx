import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
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
import { Contact } from '../types';

const Ledgers: React.FC = () => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for ledgers
  const ledgers: Contact[] = [
    {
      id: 1,
      name: "김철수",
      relationship: "친구",
      phone: "010-1234-5678",
      email: "kimcs@email.com",
      totalGiven: 250000,
      totalReceived: 180000,
      balance: 70000,
      lastEvent: "2024-03-15",
      eventCount: 5
    },
    {
      id: 2,
      name: "박영희",
      relationship: "직장동료",
      phone: "010-9876-5432",
      email: "parkyh@email.com",
      totalGiven: 150000,
      totalReceived: 200000,
      balance: -50000,
      lastEvent: "2024-02-20",
      eventCount: 3
    },
    {
      id: 3,
      name: "이민수",
      relationship: "가족",
      phone: "010-5555-1111",
      email: "leems@email.com",
      totalGiven: 500000,
      totalReceived: 300000,
      balance: 200000,
      lastEvent: "2024-01-10",
      eventCount: 8
    },
    {
      id: 4,
      name: "정수정",
      relationship: "지인",
      phone: "010-7777-9999",
      email: "jungsj@email.com",
      totalGiven: 100000,
      totalReceived: 100000,
      balance: 0,
      lastEvent: "2023-12-25",
      eventCount: 2
    }
  ];

  const filteredLedgers = ledgers.filter(ledger =>
    ledger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ledger.relationship.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return '#4a5568'; // 내가 더 줌 (따뜻한 회색)
    if (balance < 0) return '#718096'; // 더 받음 (중간 회색)
    return '#a0aec0'; // 균형 (연한 회색)
  };

  const getBalanceIcon = (balance: number): keyof typeof Ionicons.glyphMap => {
    if (balance > 0) return 'trending-up';
    if (balance < 0) return 'trending-down';
    return 'remove';
  };

  const getBalanceText = (balance: number) => {
    if (balance > 0) return `더 많은 사랑을 나눴어요 (${balance.toLocaleString()}원)`;
    if (balance < 0) return `따뜻함을 더 받았어요 (${Math.abs(balance).toLocaleString()}원)`;
    return '서로 같은 마음';
  };

  const totalGiven = ledgers.reduce((sum, ledger) => sum + ledger.totalGiven, 0);
  const totalReceived = ledgers.reduce((sum, ledger) => sum + ledger.totalReceived, 0);

  return (
    <MobileLayout currentPage="contacts">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 무신사 스타일 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>인연 장부</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={20} color={colors.foreground} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>경조사 주고받은 내역을 한눈에 확인하세요</Text>
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

        {/* 무신사 스타일 장부 그리드 */}
        <View style={styles.contactsSection}>
          
          <View style={styles.contactsGrid}>
            {filteredLedgers.map((ledger) => {
              const balanceColor = getBalanceColor(ledger.balance);
              const balanceIcon = getBalanceIcon(ledger.balance);
              
              return (
                <TouchableOpacity 
                  key={ledger.id} 
                  style={styles.contactCard}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('LedgerDetail' as never, { id: ledger.id.toString() })}
                >
                  {/* 프로필 이미지 영역 */}
                  <View style={styles.profileSection}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{ledger.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.statusIndicator}>
                      <View style={[styles.statusDot, { backgroundColor: balanceColor }]} />
                    </View>
                  </View>

                  {/* 정보 영역 */}
                  <View style={styles.infoSection}>
                    <View style={styles.nameRow}>
                      <Text style={styles.contactName}>{ledger.name}</Text>
                      <View style={styles.relationshipTag}>
                        <Text style={styles.relationshipText}>{ledger.relationship}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.balanceRow}>
                      <Ionicons name={balanceIcon} size={14} color={balanceColor} />
                      <Text style={[styles.balanceText, { color: balanceColor }]}>
                        {Math.abs(ledger.balance).toLocaleString()}원
                      </Text>
                    </View>
                    
                    <View style={styles.metaRow}>
                      <Text style={styles.metaText}>경조사 {ledger.eventCount}회</Text>
                      <Text style={styles.metaText}>•</Text>
                      <Text style={styles.metaText}>{ledger.lastEvent}</Text>
                    </View>
                  </View>

                  {/* 액션 버튼 */}
                  <View style={styles.actionSection}>
                    <TouchableOpacity style={styles.quickAction} activeOpacity={0.7}>
                      <Ionicons name="call-outline" size={16} color="#666" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 빈 상태 */}
        {filteredLedgers.length === 0 && (
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
    backgroundColor: 'white',
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
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
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
    backgroundColor: '#e2e8f0',
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
  contactsSection: {
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
  contactsGrid: {
    gap: 12,
  },
  contactCard: {
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
  
  // 프로필 섹션
  profileSection: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4a5568',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // 정보 섹션
  infoSection: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginRight: 8,
  },
  relationshipTag: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  relationshipText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  balanceText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#999',
    marginRight: 6,
  },

  // 액션 섹션
  actionSection: {
    marginLeft: 12,
  },
  quickAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
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
});

export default Ledgers;
