import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useRef, useState } from 'react';
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MobileLayout from '../components/layout/MobileLayout';
import { colors } from '../lib/utils';

const Stats: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'wedding' | 'condolence'>('wedding');
  const [selectedTab, setSelectedTab] = useState<'total' | 'items' | 'network' | 'events'>('total');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // 탭이 포커스될 때마다 스크롤을 맨 위로 이동
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, [])
  );

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Mock data for charts
  const weddingMonthlyData = [
    { month: '1월', amount: 1200000 },
    { month: '2월', amount: 1500000 },
    { month: '3월', amount: 1800000 },
    { month: '4월', amount: 2200000 },
    { month: '5월', amount: 1900000 },
    { month: '6월', amount: 2500000 },
  ];

  const condolenceMonthlyData = [
    { month: '1월', amount: 80000 },
    { month: '2월', amount: 120000 },
    { month: '3월', amount: 90000 },
    { month: '4월', amount: 150000 },
    { month: '5월', amount: 110000 },
    { month: '6월', amount: 180000 },
  ];

  const topItems = [
    { name: '김민수 결혼식', amount: 500000, type: '축의금' },
    { name: '박지영 출산', amount: 300000, type: '축의금' },
    { name: '이철수 장례식', amount: 200000, type: '조의금' },
    { name: '최영희 결혼식', amount: 400000, type: '축의금' },
    { name: '정민호 출산', amount: 250000, type: '축의금' },
  ];

  const networkData = [
    { name: '김민수', total: 300000, count: 2, avg: 150000, relationship: '친구' },
    { name: '박지영', total: 250000, count: 1, avg: 250000, relationship: '직장동료' },
    { name: '이철수', total: 200000, count: 1, avg: 200000, relationship: '지인' },
    { name: '최영희', total: 400000, count: 2, avg: 200000, relationship: '가족' },
    { name: '정민호', total: 180000, count: 1, avg: 180000, relationship: '친구' },
  ];

  // 관계별 통계 데이터 (상위 4개만)
  const relationshipStats = [
    { relationship: '가족', count: 3, totalAmount: 1200000, avgAmount: 400000, color: '#1F2937' },
    { relationship: '친구', count: 8, totalAmount: 1400000, avgAmount: 175000, color: '#9CA3AF' },
    { relationship: '직장동료', count: 5, totalAmount: 750000, avgAmount: 150000, color: '#1E40AF' },
    { relationship: '친척', count: 4, totalAmount: 600000, avgAmount: 150000, color: '#6B7280' },
  ];

  const eventData = [
    { type: '결혼식', count: 8, avgAmount: 350000 },
    { type: '출산', count: 3, avgAmount: 200000 },
    { type: '장례식', count: 2, avgAmount: 150000 },
    { type: '기타', count: 1, avgAmount: 100000 },
  ];

  const amountDistribution = [
    { range: '5만원 미만', count: 2, percentage: 14.3 },
    { range: '5-10만원', count: 4, percentage: 28.6 },
    { range: '10-20만원', count: 5, percentage: 35.7 },
    { range: '20만원 이상', count: 3, percentage: 21.4 },
  ];

  const chartColors = ['#1F2937', '#9CA3AF', '#1E3A8A', '#374151', '#111827', '#6B7280', '#9CA3AF', '#D1D5DB'];

  const renderTotalAnalysis = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>총액 및 추세 분석</Text>
        </View>
        <View style={styles.periodToggle}>
          <TouchableOpacity
            style={[styles.periodToggleButton, selectedType === 'wedding' && styles.periodToggleButtonActive]}
            onPress={() => setSelectedType('wedding')}
          >
            <Text style={[styles.periodToggleText, selectedType === 'wedding' && styles.periodToggleTextActive]}>
              축의
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodToggleButton, selectedType === 'condolence' && styles.periodToggleButtonActive]}
            onPress={() => setSelectedType('condolence')}
          >
            <Text style={[styles.periodToggleText, selectedType === 'condolence' && styles.periodToggleTextActive]}>
              조의
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.summaryCards}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryCardContent}>
            <Text style={styles.summaryLabel}>총 축의금</Text>
            <Text style={styles.summaryAmount}>8,050,000원</Text>
          </View>
        </View>
        
        <View style={styles.summaryCard}>
          <View style={styles.summaryCardContent}>
            <Text style={styles.summaryLabel}>총 조의금</Text>
            <Text style={styles.summaryAmount}>320,000원</Text>
          </View>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>
            {selectedType === 'wedding' ? '월별 축의금 추세' : '월별 조의금 추세'}
          </Text>
        </View>
        <View style={styles.lineChartContainer}>
          {(selectedType === 'wedding' ? weddingMonthlyData : condolenceMonthlyData).map((item, index) => {
            const currentData = selectedType === 'wedding' ? weddingMonthlyData : condolenceMonthlyData;
            return (
              <View key={index} style={styles.monthBar}>
                <View style={styles.monthInfo}>
                  <View style={styles.monthInfoLeft}>
                    <View style={[styles.monthDot, { backgroundColor: chartColors[index % chartColors.length] }]} />
                    <Text style={styles.monthLabel}>{item.month}</Text>
                  </View>
                  <Text style={styles.monthAmount}>{item.amount.toLocaleString()}원</Text>
                </View>
                <View style={styles.monthBarContainer}>
                  <View 
                    style={[
                      styles.monthBarFill, 
                      { 
                        backgroundColor: chartColors[index % chartColors.length],
                        width: `${(item.amount / Math.max(...currentData.map(m => m.amount))) * 100}%` 
                      }
                    ]} 
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );

  const renderItemsAnalysis = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>항목별 상세 분석</Text>
        </View>
      </View>

      <View style={styles.topItemsContainer}>
        <View style={styles.subsectionTitleContainer}>
          <Text style={styles.subsectionTitle}>TOP 5 항목</Text>
        </View>
        {topItems.map((item, index) => (
          <View key={index} style={styles.topItemCard}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankNumber}>{index + 1}</Text>
            </View>
            <View style={styles.topItemInfo}>
              <Text style={styles.topItemName}>{item.name}</Text>
              <Text style={styles.topItemType}>{item.type}</Text>
            </View>
            <Text style={styles.topItemAmount}>{item.amount.toLocaleString()}원</Text>
          </View>
        ))}
      </View>

      <View style={styles.distributionContainer}>
        <View style={styles.subsectionTitleContainer}>
          <Text style={styles.subsectionTitle}>금액 구간별 분포</Text>
        </View>
        <View style={styles.distributionLegend}>
          {amountDistribution.map((item, index) => (
            <View key={index} style={styles.distributionItem}>
              <View style={styles.distributionHeader}>
                <View style={[styles.distributionColor, { backgroundColor: chartColors[index % chartColors.length] }]} />
                <Text style={styles.distributionRange}>{item.range}</Text>
                <Text style={styles.distributionPercentage}>{item.percentage}%</Text>
              </View>
              <View style={styles.distributionBar}>
                <View 
                  style={[
                    styles.distributionBarFill, 
                    { 
                      backgroundColor: chartColors[index % chartColors.length],
                      width: `${item.percentage}%` 
                    }
                  ]} 
                />
              </View>
              <Text style={styles.distributionCount}>{item.count}건</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderNetworkAnalysis = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>관계별 분석</Text>
        </View>
      </View>

      {/* 관계별 분석 */}
      <View style={styles.relationshipContainer}>
        {relationshipStats.map((stat, index) => (
          <View key={index} style={styles.relationshipItem}>
            <View style={styles.relationshipLeft}>
              <Text style={styles.relationshipName}>{stat.relationship}</Text>
              <Text style={styles.relationshipCount}>{stat.count}회 참여</Text>
            </View>
            <View style={styles.relationshipRight}>
              <Text style={styles.relationshipAmount}>{stat.totalAmount.toLocaleString()}원</Text>
              <View style={styles.relationshipBar}>
                <View 
                  style={[
                    styles.relationshipBarFill, 
                    { 
                      backgroundColor: stat.color,
                      width: `${(stat.totalAmount / Math.max(...relationshipStats.map(s => s.totalAmount))) * 100}%`
                    }
                  ]} 
                />
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* 개인별 상세 분석 */}
      <View style={styles.subsectionTitleContainer}>
        <Text style={styles.subsectionTitle}>개인별 상세</Text>
      </View>

      {networkData.map((person, index) => (
        <View key={index} style={styles.networkCard}>
          <View style={styles.networkHeader}>
            <View style={styles.networkInfo}>
              <Text style={styles.networkName}>{person.name}</Text>
              <Text style={styles.networkRelationship}>{person.relationship}</Text>
            </View>
            <View style={styles.networkStats}>
              <Text style={styles.networkTotal}>{person.total.toLocaleString()}원</Text>
              <Text style={styles.networkCount}>({person.count}회)</Text>
            </View>
          </View>
          <View style={styles.networkProgressContainer}>
            <Text style={styles.networkAvg}>평균: {person.avg.toLocaleString()}원</Text>
            <View style={styles.networkBar}>
              <View 
                style={[
                  styles.networkBarFill, 
                  { 
                    backgroundColor: chartColors[index % chartColors.length],
                    width: `${(person.total / Math.max(...networkData.map(p => p.total))) * 100}%` 
                  }
                ]} 
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderEventsAnalysis = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>함께한 순간</Text>
        </View>
      </View>

      <View style={styles.eventStatsContainer}>
        <View style={styles.subsectionTitleContainer}>
          <Text style={styles.subsectionTitle}>이벤트별 기록</Text>
        </View>
        {eventData.map((event, index) => (
          <View key={index} style={styles.eventCard}>
            <View style={styles.eventInfo}>
              <Text style={styles.eventType}>{event.type}</Text>
              <Text style={styles.eventCount}>{event.count}회</Text>
            </View>
            <Text style={styles.eventAvg}>평균 {event.avgAmount.toLocaleString()}원</Text>
          </View>
        ))}
      </View>

      <View style={styles.eventTrendContainer}>
        <View style={styles.subsectionTitleContainer}>
          <Text style={styles.subsectionTitle}>이벤트 건수 추세</Text>
        </View>
        <View style={styles.barChartContainer}>
          {eventData.map((event, index) => (
            <View key={index} style={styles.eventBar}>
              <Text style={styles.eventBarLabel}>{event.type}</Text>
              <View style={styles.eventBarContainer}>
                <View 
                  style={[
                    styles.eventBarFill, 
                    { 
                      backgroundColor: chartColors[index % chartColors.length],
                      width: `${(event.count / Math.max(...eventData.map(e => e.count))) * 100}%` 
                    }
                  ]} 
                />
              </View>
              <Text style={styles.eventBarCount}>{event.count}건</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'total':
        return renderTotalAnalysis();
      case 'items':
        return renderItemsAnalysis();
      case 'network':
        return renderNetworkAnalysis();
      case 'events':
        return renderEventsAnalysis();
      default:
        return renderTotalAnalysis();
    }
  };

  return (
    <MobileLayout currentPage="stats">
      <LinearGradient
        colors={['#f8f9fa', '#f8f9fa']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>활동 분석</Text>
        </View>
      </LinearGradient>

      <View style={styles.tabContainer}>
        {[
          { key: 'total', label: '총액' },
          { key: 'items', label: '항목' },
          { key: 'network', label: '관계' },
          { key: 'events', label: '순간' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, selectedTab === tab.key && styles.tabActive]}
            onPress={() => setSelectedTab(tab.key as any)}
          >
            <Text style={[styles.tabText, selectedTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
          {renderTabContent()}
        </ScrollView>
      </Animated.View>
    </MobileLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: colors.foreground,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 2,
  },
  periodToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  periodToggleButtonActive: {
    backgroundColor: colors.foreground,
  },
  periodToggleText: {
    fontSize: 12,
    color: '#666666',
  },
  periodToggleTextActive: {
    color: '#FFFFFF',
  },
  summaryCards: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  summaryCardContent: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 4,
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  lineChartContainer: {
    // 자동 높이 조정
  },
  monthBar: {
    marginBottom: 8,
  },
  monthInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  monthLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  monthAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
  },
  monthBarContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
  },
  monthInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  monthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  monthBarFill: {
    height: 8,
    borderRadius: 4,
  },
  topItemsContainer: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
  },
  subsectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  topItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  topItemInfo: {
    flex: 1,
  },
  topItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 4,
  },
  topItemType: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  topItemAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  distributionContainer: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pieChartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  distributionLegend: {
    gap: 16,
  },
  distributionItem: {
    marginBottom: 16,
  },
  distributionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  distributionColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  distributionRange: {
    flex: 1,
    fontSize: 14,
    color: colors.foreground,
    fontWeight: '500',
  },
  distributionPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  distributionBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    marginBottom: 4,
  },
  distributionBarFill: {
    height: 6,
    borderRadius: 3,
  },
  distributionCount: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
  networkCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  networkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  networkInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
    gap: 4,
  },
  networkDetails: {
    flex: 1,
  },
  networkName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 4,
  },
  networkRelationship: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  networkStats: {
    alignItems: 'flex-end',
  },
  networkTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  networkCount: {
    fontSize: 12,
    color: '#666666',
  },
  networkProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  networkAvg: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  networkBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    marginLeft: 12,
  },
  networkBarFill: {
    height: 4,
    borderRadius: 2,
  },
  eventStatsContainer: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventType: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 4,
  },
  eventCount: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  eventAvg: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  eventTrendContainer: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  barChartContainer: {
    // 자동 높이 조정
  },
  eventBar: {
    marginBottom: 10,
  },
  eventBarLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 6,
  },
  eventBarContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    marginBottom: 4,
  },
  eventBarFill: {
    height: 8,
    borderRadius: 4,
  },
  eventBarCount: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'right',
  },

  // 관계별 분석 스타일
  relationshipContainer: {
    marginBottom: 20,
  },
  relationshipItem: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  relationshipLeft: {
    flex: 1,
  },
  relationshipName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 2,
  },
  relationshipCount: {
    fontSize: 13,
    color: '#666666',
  },
  relationshipRight: {
    alignItems: 'flex-end',
    minWidth: 120,
  },
  relationshipAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 6,
  },
  relationshipBar: {
    width: 80,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  relationshipBarFill: {
    height: 4,
    borderRadius: 2,
  },
});

export default Stats;