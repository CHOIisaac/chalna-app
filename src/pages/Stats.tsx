import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors } from '../lib/utils';

const Stats: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year'>('month');
  const [selectedTab, setSelectedTab] = useState<'total' | 'items' | 'network' | 'events'>('total');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Mock data for charts
  const monthlyData = [
    { month: '1월', amount: 1200000 },
    { month: '2월', amount: 1500000 },
    { month: '3월', amount: 1800000 },
    { month: '4월', amount: 2200000 },
    { month: '5월', amount: 1900000 },
    { month: '6월', amount: 2500000 },
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

  const chartColors = ['#4A90E2', '#7ED321', '#F5A623', '#D0021B'];

  const renderTotalAnalysis = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>총액 및 추세 분석</Text>
        <View style={styles.periodToggle}>
          <TouchableOpacity
            style={[styles.periodToggleButton, selectedPeriod === 'month' && styles.periodToggleButtonActive]}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text style={[styles.periodToggleText, selectedPeriod === 'month' && styles.periodToggleTextActive]}>
              월별
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodToggleButton, selectedPeriod === 'year' && styles.periodToggleButtonActive]}
            onPress={() => setSelectedPeriod('year')}
          >
            <Text style={[styles.periodToggleText, selectedPeriod === 'year' && styles.periodToggleTextActive]}>
              연도별
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.summaryCards}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>총 축의금</Text>
          <Text style={styles.summaryAmount}>8,050,000원</Text>
          <Text style={styles.summaryChange}>+12% 전월 대비</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>총 조의금</Text>
          <Text style={styles.summaryAmount}>320,000원</Text>
          <Text style={styles.summaryChange}>-5% 전월 대비</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>월별 금액 추세</Text>
        <View style={styles.lineChartContainer}>
          {monthlyData.map((item, index) => (
            <View key={index} style={styles.monthBar}>
              <View style={styles.monthInfo}>
                <Text style={styles.monthLabel}>{item.month}</Text>
                <Text style={styles.monthAmount}>{item.amount.toLocaleString()}원</Text>
              </View>
              <View style={styles.monthBarContainer}>
                <View 
                  style={[
                    styles.monthBarFill, 
                    { 
                      width: `${(item.amount / Math.max(...monthlyData.map(m => m.amount))) * 100}%` 
                    }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderItemsAnalysis = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>항목별 상세 분석</Text>
      </View>

      <View style={styles.topItemsContainer}>
        <Text style={styles.subsectionTitle}>TOP 5 항목</Text>
        {topItems.map((item, index) => (
          <View key={index} style={styles.topItemCard}>
            <View style={styles.topItemInfo}>
              <Text style={styles.topItemName}>{item.name}</Text>
              <Text style={styles.topItemType}>{item.type}</Text>
            </View>
            <Text style={styles.topItemAmount}>{item.amount.toLocaleString()}원</Text>
          </View>
        ))}
      </View>

      <View style={styles.distributionContainer}>
        <Text style={styles.subsectionTitle}>금액 구간별 분포</Text>
        <View style={styles.distributionLegend}>
          {amountDistribution.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: chartColors[index] }]} />
              <Text style={styles.legendText}>{item.range}</Text>
              <Text style={styles.legendPercentage}>{item.percentage}%</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderNetworkAnalysis = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>인맥 네트워크 분석</Text>
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
          <View style={styles.networkDetails}>
            <Text style={styles.networkAvg}>평균: {person.avg.toLocaleString()}원</Text>
            <View style={styles.networkBar}>
              <View 
                style={[
                  styles.networkBarFill, 
                  { width: `${(person.total / Math.max(...networkData.map(p => p.total))) * 100}%` }
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
        <Text style={styles.sectionTitle}>함께한 순간</Text>
      </View>

      <View style={styles.eventStatsContainer}>
        <Text style={styles.subsectionTitle}>이벤트별 기록</Text>
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
        <Text style={styles.subsectionTitle}>이벤트 건수 추세</Text>
        <View style={styles.barChartContainer}>
          {eventData.map((event, index) => (
            <View key={index} style={styles.eventBar}>
              <Text style={styles.eventBarLabel}>{event.type}</Text>
              <View style={styles.eventBarContainer}>
                <View 
                  style={[
                    styles.eventBarFill, 
                    { 
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
    <View style={styles.container}>
      <LinearGradient
        colors={['#F8F9FA', '#FFFFFF']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>활동 분석</Text>
          <Text style={styles.headerSubtitle}>참석 패턴 및 통계</Text>
          <TouchableOpacity style={styles.periodButton}>
            <Text style={styles.periodButtonText}>최근 6개월</Text>
            <Ionicons name="chevron-down" size={16} color="#666666" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.tabContainer}>
        {[
          { key: 'total', label: '총액', icon: 'trending-up' },
          { key: 'items', label: '항목', icon: 'list' },
          { key: 'network', label: '인맥', icon: 'people' },
          { key: 'events', label: '순간', icon: 'calendar' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, selectedTab === tab.key && styles.tabActive]}
            onPress={() => setSelectedTab(tab.key as any)}
          >
            <Ionicons 
              name={tab.icon as any} 
              size={20} 
              color={selectedTab === tab.key ? '#FFFFFF' : '#666666'} 
            />
            <Text style={[styles.tabText, selectedTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderTabContent()}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
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
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  periodButtonText: {
    fontSize: 14,
    color: '#666666',
    marginRight: 4,
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
    flexDirection: 'row',
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
    marginLeft: 6,
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
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 4,
  },
  summaryChange: {
    fontSize: 12,
    color: '#4A90E2',
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
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 16,
  },
  lineChartContainer: {
    height: 200,
  },
  monthBar: {
    marginBottom: 16,
  },
  monthInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  monthLabel: {
    fontSize: 14,
    color: '#666666',
  },
  monthAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
  monthBarContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
  },
  monthBarFill: {
    height: 8,
    backgroundColor: '#4A90E2',
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
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 16,
  },
  topItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  topItemInfo: {
    flex: 1,
  },
  topItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 2,
  },
  topItemType: {
    fontSize: 12,
    color: '#666666',
  },
  topItemAmount: {
    fontSize: 14,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#666666',
    flex: 1,
  },
  legendPercentage: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.foreground,
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
    flex: 1,
  },
  networkName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 2,
  },
  networkRelationship: {
    fontSize: 12,
    color: '#666666',
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
  networkDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  networkAvg: {
    fontSize: 12,
    color: '#666666',
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
    backgroundColor: '#4A90E2',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  eventInfo: {
    flex: 1,
  },
  eventType: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 2,
  },
  eventCount: {
    fontSize: 12,
    color: '#666666',
  },
  eventAvg: {
    fontSize: 14,
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
    height: 200,
  },
  eventBar: {
    marginBottom: 16,
  },
  eventBarLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  eventBarContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    marginBottom: 4,
  },
  eventBarFill: {
    height: 8,
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  eventBarCount: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'right',
  },
});

export default Stats;