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
        {/* 무신사 스타일 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.title}>장부 상세</Text>
            <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
              <Ionicons name="pencil" size={20} color="#4a5568" />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>{ledgerDetail.name}님과의 경조사 내역</Text>
        </View>


        {/* 장부 정보 수정 섹션 */}
        <View style={styles.editSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>장부 정보</Text>
            <TouchableOpacity style={styles.editToggle} activeOpacity={0.7}>
              <Ionicons name="pencil" size={16} color="#4a5568" />
              <Text style={styles.editToggleText}>수정</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.editCard}>
            <View style={styles.editItem}>
              <Text style={styles.editLabel}>이름</Text>
              <Text style={styles.editValue}>{ledgerDetail.name}</Text>
            </View>
            
            <View style={styles.editItem}>
              <Text style={styles.editLabel}>관계</Text>
              <Text style={styles.editValue}>{ledgerDetail.relationship}</Text>
            </View>
            
            <View style={styles.editItem}>
              <Text style={styles.editLabel}>경조사 타입</Text>
              <Text style={styles.editValue}>{ledgerDetail.events[0]?.eventType || '결혼식'}</Text>
            </View>
            
            <View style={styles.editItem}>
              <Text style={styles.editLabel}>날짜</Text>
              <Text style={styles.editValue}>{ledgerDetail.events[0]?.date || ledgerDetail.lastEvent}</Text>
            </View>
            
            <View style={styles.editItem}>
              <Text style={styles.editLabel}>금액</Text>
              <Text style={styles.editValue}>{ledgerDetail.events[0]?.amount.toLocaleString() || '0'}원</Text>
            </View>
          </View>
        </View>

        {/* 액션 버튼들 */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryActionButton}
            onPress={() => {
              // 장부 정보 수정 기능
              console.log('장부 정보 수정');
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="save" size={20} color="white" />
            <Text style={styles.primaryActionText}>저장</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryActionButton}
            onPress={() => router.push('/(tabs)/events')}
            activeOpacity={0.8}
          >
            <Ionicons name="calendar" size={20} color="#4a5568" />
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  editButton: {
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


  // 장부 정보 수정 섹션
  editSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
  editToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  editToggleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4a5568',
  },
  editCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  editItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  editLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  editValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
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
