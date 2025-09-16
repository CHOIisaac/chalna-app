import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MobileLayout from '../components/layout/MobileLayout';

const LedgerDetail: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // 개별 항목 수정 핸들러
  const handleEditItem = (field: string, currentValue: string) => {
    router.push({
      pathname: '/edit-field',
      params: {
        id: id,
        field: field,
        currentValue: currentValue,
        name: ledgerDetail.name
      }
    });
  };

  // Mock data for ledger detail
  const ledgerDetail = {
    id: parseInt(id),
    name: "김철수",
    relationship: "친구",
    phone: "010-1234-5678",
    email: "kimcs@email.com",
    totalGiven: 250000,
    totalReceived: 180000,
    balance: 70000,
    lastEvent: "2024-03-15",
    eventCount: 5,
    memo: "대학 동기 친구로 10년 넘게 알고 지낸 사이입니다.",
    events: [
      {
        id: 1,
        eventType: "결혼식",
        title: "김철수 결혼식",
        date: "2024-03-15",
        amount: 100000,
        type: "given",
        location: "롯데호텔 크리스탈볼룸",
        time: "12:00"
      },
      {
        id: 2,
        eventType: "돌잔치",
        title: "김철수 아들 돌잔치",
        date: "2023-08-20",
        amount: 50000,
        type: "given",
        location: "강남구청 웨딩홀",
        time: "11:30"
      },
      {
        id: 3,
        eventType: "장례식",
        title: "김철수 어머님 장례식",
        date: "2023-05-10",
        amount: 100000,
        type: "given",
        location: "서울추모공원",
        time: "14:00"
      },
      {
        id: 4,
        eventType: "개업식",
        title: "김철수 사무실 개업",
        date: "2023-02-15",
        amount: 30000,
        type: "received",
        location: "강남구 테헤란로",
        time: "18:00"
      },
      {
        id: 5,
        eventType: "결혼식",
        title: "김철수 동생 결혼식",
        date: "2022-11-20",
        amount: 50000,
        type: "received",
        location: "신라호텔",
        time: "12:30"
      }
    ],
  };


  return (
    <MobileLayout currentPage="ledger-detail">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.title}>상세 정보</Text>
            <View style={styles.placeholder} />
          </View>
        </View>


        {/* 장부 정보 수정 섹션 */}
        <View style={styles.editSection}>
          <View style={styles.editCard}>
            <TouchableOpacity 
              style={styles.editItem} 
              activeOpacity={0.7}
              onPress={() => handleEditItem('name', ledgerDetail.name)}
            >
              <View style={styles.editItemLeft}>
                <View style={styles.editItemContent}>
                  <Text style={styles.editLabel}>이름</Text>
                  <Text style={styles.editValue}>{ledgerDetail.name}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.editItem} 
              activeOpacity={0.7}
              onPress={() => handleEditItem('relationship', ledgerDetail.relationship)}
            >
              <View style={styles.editItemLeft}>
                <View style={styles.editItemContent}>
                  <Text style={styles.editLabel}>관계</Text>
                  <Text style={styles.editValue}>{ledgerDetail.relationship}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.editItem} 
              activeOpacity={0.7}
              onPress={() => handleEditItem('eventType', ledgerDetail.events[0]?.eventType || '결혼식')}
            >
              <View style={styles.editItemLeft}>
                <View style={styles.editItemContent}>
                  <Text style={styles.editLabel}>경조사</Text>
                  <Text style={styles.editValue}>{ledgerDetail.events[0]?.eventType || '결혼식'}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.editItem} 
              activeOpacity={0.7}
              onPress={() => handleEditItem('date', ledgerDetail.events[0]?.date || ledgerDetail.lastEvent)}
            >
              <View style={styles.editItemLeft}>
                <View style={styles.editItemContent}>
                  <Text style={styles.editLabel}>날짜</Text>
                  <Text style={styles.editValue}>{ledgerDetail.events[0]?.date || ledgerDetail.lastEvent}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.editItem} 
              activeOpacity={0.7}
              onPress={() => handleEditItem('type', ledgerDetail.events[0]?.type || 'given')}
            >
              <View style={styles.editItemLeft}>
                <View style={styles.editItemContent}>
                  <Text style={styles.editLabel}>구분</Text>
                  <Text style={styles.editValue}>{ledgerDetail.events[0]?.type === 'given' ? '나눔' : '받음'}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.editItem, styles.lastEditItem]} 
              activeOpacity={0.7}
              onPress={() => handleEditItem('amount', (ledgerDetail.events[0]?.amount || 0).toString())}
            >
              <View style={styles.editItemLeft}>
                <View style={styles.editItemContent}>
                  <Text style={styles.editLabel}>금액</Text>
                  <Text style={styles.editValue}>{ledgerDetail.events[0]?.amount.toLocaleString() || '0'}원</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>

            {/* 메모 */}
            <TouchableOpacity
              style={styles.memoItem}
              activeOpacity={0.7}
              onPress={() => handleEditItem('memo', ledgerDetail.memo)}
            >
              <View style={styles.memoHeader}>
                <View style={styles.memoInfo}>
                  <Text style={styles.memoLabel}>메모</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </View>
              
              <View style={styles.memoContent}>
                <Text style={styles.memoText} numberOfLines={3}>
                  {ledgerDetail.memo || '메모가 없습니다'}
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
    backgroundColor: '8f9fa',
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
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


  // 프로필 섹션
  profileSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileCard: {
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4a5568',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  profileRelationship: {
    fontSize: 16,
    color: '#666',
  },

  // 장부 정보 수정 섹션
  editSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
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
  memoValue: {
    lineHeight: 20,
    marginTop: 2,
  },
  memoItem: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  memoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    paddingTop: 8,
  },
  memoText: {
    fontSize: 16,
    color: '#1e293b',
    lineHeight: 24,
  },

  // 액션 버튼들
  actionButtons: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 12,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a5568',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  secondaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 8,
  },
  secondaryActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
  },
});

export default LedgerDetail;
