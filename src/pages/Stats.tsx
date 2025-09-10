import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import MobileLayout from '../components/layout/MobileLayout';
import { colors } from '../lib/utils';
import { EventTypeStat, MonthlyData, RelationshipStat } from '../types';

const screenWidth = Dimensions.get('window').width;

// 터치 인터랙션이 있는 라인 차트 컴포넌트
const InteractiveLineChart: React.FC<{ 
  data: number[], 
  labels: string[], 
  colors: string[],
  onPointPress: (index: number, value: number, label: string) => void 
}> = ({ data, labels, colors, onPointPress }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const chartWidth = screenWidth - 80;
  const chartHeight = 200;
  const padding = 40;
  
  const maxValue = Math.max(...data);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [animatedValue]);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  
  const points = data.map((value, index) => {
    const x = padding + (index * (chartWidth - 2 * padding)) / (data.length - 1);
    const y = padding + ((maxValue - value) / range) * (chartHeight - 2 * padding);
    return { x, y, value, label: labels[index] };
  });
  
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');
  
  return (
    <Animated.View style={{ opacity: animatedValue }}>
      <Svg width={chartWidth} height={chartHeight}>
        {/* 그리드 라인 */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
          <Line
            key={index}
            x1={padding}
            y1={padding + ratio * (chartHeight - 2 * padding)}
            x2={chartWidth - padding}
            y2={padding + ratio * (chartHeight - 2 * padding)}
            stroke="#f1f5f9"
            strokeWidth="1"
          />
        ))}
        
        {/* 데이터 라인 */}
        <Path
          d={pathData}
          stroke={colors[0]}
          strokeWidth="3"
          fill="none"
        />
        
        {/* 터치 가능한 데이터 포인트 */}
        {points.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="6"
            fill={colors[0]}
            stroke="#fff"
            strokeWidth="2"
            onPress={() => onPointPress(index, point.value, point.label)}
          />
        ))}
        
        {/* 라벨 */}
        {labels.map((label, index) => (
          <SvgText
            key={index}
            x={padding + (index * (chartWidth - 2 * padding)) / (data.length - 1)}
            y={chartHeight - 10}
            fontSize="12"
            fill="#64748b"
            textAnchor="middle"
          >
            {label}
          </SvgText>
        ))}
      </Svg>
    </Animated.View>
  );
};

// 터치 인터랙션이 있는 바 차트 컴포넌트
const InteractiveBarChart: React.FC<{ 
  data: number[], 
  labels: string[], 
  colors: string[],
  onBarPress: (index: number, value: number, label: string) => void 
}> = ({ data, labels, colors, onBarPress }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const chartWidth = screenWidth - 80;
  const chartHeight = 200;
  const padding = 40;
  const barWidth = (chartWidth - 2 * padding) / data.length * 0.6;
  
  const maxValue = Math.max(...data);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [animatedValue]);
  
  return (
    <Animated.View style={{ opacity: animatedValue }}>
      <Svg width={chartWidth} height={chartHeight}>
      {/* 그리드 라인 */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
        <Line
          key={index}
          x1={padding}
          y1={padding + ratio * (chartHeight - 2 * padding)}
          x2={chartWidth - padding}
          y2={padding + ratio * (chartHeight - 2 * padding)}
          stroke="#f1f5f9"
          strokeWidth="1"
        />
      ))}
      
      {/* 터치 가능한 바 */}
      {data.map((value, index) => {
        const barHeight = (value / maxValue) * (chartHeight - 2 * padding);
        const x = padding + (index * (chartWidth - 2 * padding)) / data.length + (chartWidth - 2 * padding) / data.length * 0.2;
        const y = padding + (chartHeight - 2 * padding) - barHeight;
        
        return (
          <Rect
            key={index}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            fill={colors[index % colors.length]}
            rx="4"
            onPress={() => onBarPress(index, value, labels[index])}
          />
        );
      })}
      
      {/* 라벨 */}
      {labels.map((label, index) => (
        <SvgText
          key={index}
          x={padding + (index * (chartWidth - 2 * padding)) / data.length + (chartWidth - 2 * padding) / data.length * 0.5}
          y={chartHeight - 10}
          fontSize="12"
          fill="#64748b"
          textAnchor="middle"
        >
          {label}
        </SvgText>
      ))}
      </Svg>
    </Animated.View>
  );
};

// 터치 인터랙션이 있는 파이 차트 컴포넌트
const InteractivePieChart: React.FC<{ 
  data: { name: string, value: number, color: string }[],
  onSlicePress: (index: number, name: string, value: number, percentage: number) => void 
}> = ({ data, onSlicePress }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const chartSize = 160;
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;
  const radius = 60;
  
  const total = data.reduce((sum, item) => sum + item.value, 0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [animatedValue]);
  let currentAngle = 0;
  
  const paths = data.map((item, index) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    currentAngle += angle;
    
    return { pathData, color: item.color, name: item.name, percentage, value: item.value };
  });
  
  return (
    <Animated.View style={{ opacity: animatedValue }}>
      <Svg width={chartSize} height={chartSize}>
      {paths.map((path, index) => (
        <Path
          key={index}
          d={path.pathData}
          fill={path.color}
          stroke="#fff"
          strokeWidth="2"
          onPress={() => onSlicePress(index, path.name, path.value, path.percentage)}
        />
      ))}
      </Svg>
    </Animated.View>
  );
};

const Stats: React.FC = () => {
  const [selectedPeriod] = useState('2025');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedData, setSelectedData] = useState<{
    title: string;
    value: string;
    description: string;
    position: { x: number; y: number };
  } | null>(null);
  const [showEmptyState] = useState(false);

  // Mock data for statistics
  const monthlyData: MonthlyData[] = [
    { month: '1월', income: 300000, expense: 250000, events: 3, net: 50000 },
    { month: '2월', income: 150000, expense: 180000, events: 2, net: -30000 },
    { month: '3월', income: 200000, expense: 320000, events: 4, net: -120000 },
    { month: '4월', income: 100000, expense: 150000, events: 2, net: -50000 },
    { month: '5월', income: 400000, expense: 200000, events: 5, net: 200000 },
    { month: '6월', income: 250000, expense: 300000, events: 3, net: -50000 },
    { month: '7월', income: 320000, expense: 280000, events: 4, net: 40000 },
    { month: '8월', income: 450000, expense: 220000, events: 6, net: 230000 }
  ];

  const eventTypeStats: EventTypeStat[] = [
    { type: '결혼식', count: 12, amount: 1200000, color: '#FF6B9D', percentage: 48 },
    { type: '장례식', count: 6, amount: 300000, color: '#95A5A6', percentage: 12 },
    { type: '돌잔치', count: 8, amount: 600000, color: '#4ECDC4', percentage: 24 },
    { type: '개업식', count: 4, amount: 400000, color: '#45B7D1', percentage: 16 }
  ];

  const relationshipStats: RelationshipStat[] = [
    { relation: '친구', count: 15, amount: 750000, avgAmount: 50000, color: '#FF6B9D' },
    { relation: '가족', count: 8, amount: 1200000, avgAmount: 150000, color: '#4ECDC4' },
    { relation: '직장동료', count: 10, amount: 500000, avgAmount: 50000, color: '#45B7D1' },
    { relation: '지인', count: 7, amount: 350000, avgAmount: 50000, color: '#96CEB4' }
  ];

  const totalIncome = monthlyData.reduce((sum, month) => sum + month.income, 0);
  const totalExpense = monthlyData.reduce((sum, month) => sum + month.expense, 0);
  const netBalance = totalIncome - totalExpense;

  // 로딩 시뮬레이션
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // 터치 핸들러 함수들
  const handleLineChartPointPress = (index: number, value: number, label: string) => {
    const monthData = monthlyData[index];
    setSelectedData({
      title: `${label} 월별 통계`,
      value: `${(value * 10000).toLocaleString()}원`,
      description: `이벤트 ${monthData.events}건, 순수익 ${monthData.net.toLocaleString()}원`,
      position: { x: 50 + (index * 50), y: 100 }
    });
    
    // 햅틱 피드백 (실제 디바이스에서만 작동)
    if (Platform.OS === 'ios') {
      // HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Light);
    }
  };

  const handleBarChartPress = (index: number, value: number, label: string) => {
    const relationshipData = relationshipStats[index];
    setSelectedData({
      title: `${label} 관계 통계`,
      value: `${(value * 10000).toLocaleString()}원`,
      description: `${relationshipData.count}명, 평균 ${relationshipData.avgAmount.toLocaleString()}원`,
      position: { x: 50 + (index * 60), y: 80 }
    });
  };

  const handlePieChartPress = (index: number, name: string, value: number, percentage: number) => {
    const eventData = eventTypeStats[index];
    setSelectedData({
      title: `${name} 통계`,
      value: `${value}건`,
      description: `총 ${eventData.amount.toLocaleString()}원, 전체의 ${Math.round(percentage * 100)}%`,
      position: { x: 100, y: 100 }
    });
  };


  // 차트 데이터 준비
  const lineChartData = {
    income: monthlyData.map(m => m.income / 10000), // 만원 단위로 변환
    expense: monthlyData.map(m => m.expense / 10000), // 만원 단위로 변환
    labels: monthlyData.map(m => m.month),
    colors: ['#4a5568', '#a0aec0'] // 따뜻한 회색
  };

  const pieChartData = eventTypeStats.map((stat) => ({
    name: stat.type,
    value: stat.count,
    color: stat.color,
  }));

  const barChartData = {
    data: relationshipStats.map(r => r.amount / 10000), // 만원 단위로 변환
    labels: relationshipStats.map(r => r.relation),
    colors: relationshipStats.map(r => r.color),
  };

  // 로딩 상태 UI
  if (isLoading) {
    return (
      <MobileLayout currentPage="stats">
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>마음의 통계를 준비하고 있어요</Text>
            <Text style={styles.loadingSubtext}>잠시만 기다려주세요...</Text>
          </View>
        </View>
      </MobileLayout>
    );
  }

  // 빈 상태 UI
  if (showEmptyState) {
    return (
      <MobileLayout currentPage="stats">
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateContent}>
              <View style={styles.emptyStateIcon}>
                <Ionicons name="analytics-outline" size={64} color={colors.mutedForeground} />
              </View>
              <Text style={styles.emptyStateTitle}>아직 통계 데이터가 없어요</Text>
              <Text style={styles.emptyStateText}>
                경조사를 기록하면{'\n'}마음의 통계를 확인할 수 있어요
              </Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => {
                  // 경조사 추가 페이지로 이동
                  Alert.alert('알림', '경조사 추가 기능은 준비 중입니다.');
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={20} color={colors.background} />
                <Text style={styles.emptyStateButtonText}>첫 경조사 기록하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout currentPage="stats">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 통계 전용 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.titleSection}>
              <View style={styles.titleRow}>
                <Ionicons name="analytics" size={28} color={colors.primary} />
                <Text style={styles.title}>마음의 통계</Text>
              </View>
              <Text style={styles.subtitle}>따뜻한 마음의 흐름을 한눈에</Text>
            </View>
            <TouchableOpacity
              style={styles.periodButton}
              onPress={() => {
                Alert.alert(
                  '기간 선택',
                  '통계를 확인할 기간을 선택해주세요',
                  [
                    { text: '2024년', onPress: () => {} },
                    { text: '2025년', onPress: () => {} },
                    { text: '취소', style: 'cancel' }
                  ]
                );
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.periodText}>{selectedPeriod}년</Text>
              <Ionicons name="chevron-down" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
          
          {/* 통계 요약 바 */}
          <View style={styles.summaryBar}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalIncome.toLocaleString()}</Text>
              <Text style={styles.summaryLabel}>받은 마음</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalExpense.toLocaleString()}</Text>
              <Text style={styles.summaryLabel}>나눈 마음</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: netBalance >= 0 ? colors.success : colors.destructive }]}>
                {netBalance >= 0 ? '+' : ''}{netBalance.toLocaleString()}
              </Text>
              <Text style={styles.summaryLabel}>수지</Text>
            </View>
          </View>
        </View>

        {/* 통계 전용 상세 지표 */}
        <View style={styles.detailedStatsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>상세 분석</Text>
            <View style={styles.analysisBadge}>
              <Ionicons name="trending-up" size={14} color={colors.success} />
              <Text style={styles.analysisBadgeText}>성장세</Text>
            </View>
          </View>
          
          <View style={styles.detailedStatsGrid}>
            <View style={styles.detailedStatCard}>
              <View style={styles.detailedStatHeader}>
                <View style={styles.detailedStatIcon}>
                  <Ionicons name="heart" size={20} color="#FF6B9D" />
                </View>
                <View style={styles.detailedStatTrend}>
                  <Ionicons name="trending-up" size={16} color={colors.success} />
                  <Text style={styles.detailedStatTrendText}>+12%</Text>
                </View>
              </View>
              <Text style={styles.detailedStatValue}>{totalIncome.toLocaleString()}원</Text>
              <Text style={styles.detailedStatLabel}>받은 마음</Text>
              <Text style={styles.detailedStatDescription}>전월 대비 증가</Text>
            </View>

            <View style={styles.detailedStatCard}>
              <View style={styles.detailedStatHeader}>
                <View style={styles.detailedStatIcon}>
                  <Ionicons name="gift" size={20} color="#4ECDC4" />
                </View>
                <View style={styles.detailedStatTrend}>
                  <Ionicons name="trending-up" size={16} color={colors.warning} />
                  <Text style={styles.detailedStatTrendText}>+8%</Text>
                </View>
              </View>
              <Text style={styles.detailedStatValue}>{totalExpense.toLocaleString()}원</Text>
              <Text style={styles.detailedStatLabel}>나눈 마음</Text>
              <Text style={styles.detailedStatDescription}>전월 대비 증가</Text>
            </View>

            <View style={styles.detailedStatCard}>
              <View style={styles.detailedStatHeader}>
                <View style={styles.detailedStatIcon}>
                  <Ionicons name="trending-up" size={20} color={netBalance >= 0 ? colors.success : colors.destructive} />
                </View>
                <View style={styles.detailedStatTrend}>
                  <Ionicons 
                    name={netBalance >= 0 ? "trending-up" : "trending-down"} 
                    size={16} 
                    color={netBalance >= 0 ? colors.success : colors.destructive} 
                  />
                  <Text style={[styles.detailedStatTrendText, { color: netBalance >= 0 ? colors.success : colors.destructive }]}>
                    {netBalance >= 0 ? '+' : ''}{Math.abs(netBalance / 10000).toFixed(0)}만
                  </Text>
                </View>
              </View>
              <Text style={[styles.detailedStatValue, { color: netBalance >= 0 ? colors.success : colors.destructive }]}>
                {netBalance >= 0 ? '+' : ''}{netBalance.toLocaleString()}원
              </Text>
              <Text style={styles.detailedStatLabel}>마음의 수지</Text>
              <Text style={styles.detailedStatDescription}>
                {netBalance >= 0 ? '여유로운 상태' : '적극적인 나눔'}
              </Text>
            </View>

            <View style={styles.detailedStatCard}>
              <View style={styles.detailedStatHeader}>
                <View style={styles.detailedStatIcon}>
                  <Ionicons name="calendar" size={20} color="#45B7D1" />
                </View>
                <View style={styles.detailedStatTrend}>
                  <Ionicons name="trending-up" size={16} color={colors.success} />
                  <Text style={styles.detailedStatTrendText}>+3건</Text>
                </View>
              </View>
              <Text style={styles.detailedStatValue}>24건</Text>
              <Text style={styles.detailedStatLabel}>연간 경조사</Text>
              <Text style={styles.detailedStatDescription}>작년 대비 증가</Text>
            </View>
          </View>
        </View>

        {/* 월별 마음 흐름 분석 */}
        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="trending-up" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>월별 마음 흐름 분석</Text>
            </View>
            <View style={styles.chartBadge}>
              <Text style={styles.chartBadgeText}>8개월</Text>
            </View>
          </View>
          
          {/* 차트 설명 */}
          <View style={styles.chartDescription}>
            <Text style={styles.chartDescriptionText}>
              💡 차트의 점을 터치하면 상세 정보를 확인할 수 있어요
            </Text>
          </View>
          
          <View style={styles.enhancedChartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartSubtitle}>받은 마음 vs 나눈 마음 추이</Text>
              <View style={styles.chartStats}>
                <View style={styles.chartStatItem}>
                  <Text style={styles.chartStatValue}>+{Math.round((totalIncome / 8) / 10000)}만</Text>
                  <Text style={styles.chartStatLabel}>월평균</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.chartContainer}>
              <InteractiveLineChart 
                data={lineChartData.income} 
                labels={lineChartData.labels} 
                colors={['#FF6B9D', '#4ECDC4']}
                onPointPress={handleLineChartPointPress}
              />
            </View>
            
            <View style={styles.enhancedChartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF6B9D' }]} />
                <Text style={styles.legendText}>받은 마음</Text>
                <Text style={styles.legendValue}>{totalIncome.toLocaleString()}원</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#4ECDC4' }]} />
                <Text style={styles.legendText}>나눈 마음</Text>
                <Text style={styles.legendValue}>{totalExpense.toLocaleString()}원</Text>
              </View>
            </View>
            
            {selectedData && selectedData.title.includes('월별') && (
              <View style={[styles.enhancedTooltip, { 
                left: selectedData.position.x, 
                top: selectedData.position.y 
              }]}>
                <Text style={styles.tooltipTitle}>{selectedData.title}</Text>
                <Text style={styles.tooltipValue}>{selectedData.value}</Text>
                <Text style={styles.tooltipDescription}>{selectedData.description}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 경조사 유형별 마음 분포 */}
        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="pie-chart" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>경조사 유형별 마음 분포</Text>
            </View>
            <View style={styles.chartBadge}>
              <Text style={styles.chartBadgeText}>4종류</Text>
            </View>
          </View>
          
          {/* 차트 설명 */}
          <View style={styles.chartDescription}>
            <Text style={styles.chartDescriptionText}>
              🎯 파이 차트와 범례를 터치하면 상세 정보를 확인할 수 있어요
            </Text>
          </View>
          
          <View style={styles.enhancedChartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartSubtitle}>경조사별 참여 현황</Text>
              <View style={styles.chartStats}>
                <View style={styles.chartStatItem}>
                  <Text style={styles.chartStatValue}>{pieChartData.reduce((sum, item) => sum + item.value, 0)}건</Text>
                  <Text style={styles.chartStatLabel}>총 경조사</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.enhancedPieChartContainer}>
              <View style={styles.pieChartWrapper}>
                <InteractivePieChart 
                  data={pieChartData}
                  onSlicePress={handlePieChartPress}
                />
              </View>
              
              <View style={styles.enhancedPieChartLegend}>
                {pieChartData.map((item, index) => {
                  const percentage = Math.round((item.value / pieChartData.reduce((sum, i) => sum + i.value, 0)) * 100);
                  return (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.enhancedPieLegendItem}
                      onPress={() => handlePieChartPress(index, item.name, item.value, item.value / pieChartData.reduce((sum, i) => sum + i.value, 0))}
                      activeOpacity={0.7}
                    >
                      <View style={styles.pieLegendLeft}>
                        <View style={[styles.pieLegendDot, { backgroundColor: item.color }]} />
                        <Text style={styles.pieLegendText}>{item.name}</Text>
                      </View>
                      <View style={styles.pieLegendRight}>
                        <Text style={styles.pieLegendValue}>{item.value}건</Text>
                        <Text style={styles.pieLegendPercentage}>{percentage}%</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            
            {selectedData && selectedData.title.includes('통계') && !selectedData.title.includes('관계') && (
              <View style={[styles.enhancedTooltip, { 
                left: selectedData.position.x, 
                top: selectedData.position.y 
              }]}>
                <Text style={styles.tooltipTitle}>{selectedData.title}</Text>
                <Text style={styles.tooltipValue}>{selectedData.value}</Text>
                <Text style={styles.tooltipDescription}>{selectedData.description}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 관계별 마음 나눔 분석 */}
        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="people" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>관계별 마음 나눔 분석</Text>
            </View>
            <View style={styles.chartBadge}>
              <Text style={styles.chartBadgeText}>4그룹</Text>
            </View>
          </View>
          
          {/* 차트 설명 */}
          <View style={styles.chartDescription}>
            <Text style={styles.chartDescriptionText}>
              📊 바 차트와 하단 목록을 터치하면 상세 정보를 확인할 수 있어요
            </Text>
          </View>
          
          <View style={styles.enhancedChartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartSubtitle}>관계별 마음 나눔 현황</Text>
              <View style={styles.chartStats}>
                <View style={styles.chartStatItem}>
                  <Text style={styles.chartStatValue}>{relationshipStats.reduce((sum, stat) => sum + stat.count, 0)}명</Text>
                  <Text style={styles.chartStatLabel}>총 관계</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.chartContainer}>
              <InteractiveBarChart 
                data={barChartData.data} 
                labels={barChartData.labels} 
                colors={barChartData.colors}
                onBarPress={handleBarChartPress}
              />
            </View>
            
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.enhancedRelationshipLegend}
              decelerationRate="fast"
              nestedScrollEnabled={true}
              scrollEnabled={true}
              style={styles.relationshipScrollContainer}
            >
              {relationshipStats.map((stat, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.enhancedRelationshipLegendItem}
                  onPress={() => handleBarChartPress(index, stat.amount / 10000, stat.relation)}
                  activeOpacity={0.7}
                >
                  <View style={styles.relationshipLegendLeft}>
                    <View style={[styles.relationshipLegendDot, { backgroundColor: stat.color }]} />
                    <Text style={styles.relationshipLegendText}>{stat.relation}</Text>
                  </View>
                  <View style={styles.relationshipLegendRight}>
                    <Text style={styles.relationshipLegendValue}>{stat.count}명</Text>
                    <Text style={styles.relationshipLegendAmount}>{Math.round(stat.amount / 10000)}만원</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {selectedData && selectedData.title.includes('관계') && (
              <View style={[styles.enhancedTooltip, { 
                left: selectedData.position.x, 
                top: selectedData.position.y 
              }]}>
                <Text style={styles.tooltipTitle}>{selectedData.title}</Text>
                <Text style={styles.tooltipValue}>{selectedData.value}</Text>
                <Text style={styles.tooltipDescription}>{selectedData.description}</Text>
              </View>
            )}
          </View>
        </View>


        {/* 인사이트 섹션 */}
        <View style={styles.insightsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>인사이트</Text>
          </View>
          
          <View style={styles.insightsGrid}>
            <View style={styles.insightCard}>
              <View style={styles.insightIcon}>
                <Ionicons name="heart" size={24} color="#4a5568" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>마음 나눔 리포트</Text>
                <Text style={styles.insightText}>
                  이번 달 가족과의 경조사가 많았어요. 소중한 시간들이 늘어나고 있습니다.
                </Text>
              </View>
            </View>
            
            <View style={styles.insightCard}>
              <View style={styles.insightIcon}>
                <Ionicons name="bulb" size={24} color="#4a5568" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>균형 체크</Text>
                <Text style={styles.insightText}>
                  친구들과의 마음 주고받기가 잘 균형을 이루고 있어요.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </MobileLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // 통계 전용 헤더
  header: {
    backgroundColor: colors.card,
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleSection: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.foreground,
    lineHeight: 32,
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
  },
  subtitle: {
    fontSize: 15,
    color: colors.mutedForeground,
    lineHeight: 20,
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },

  // 통계 전용 상세 지표
  detailedStatsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  analysisBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  analysisBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  detailedStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailedStatCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  detailedStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailedStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailedStatTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  detailedStatTrendText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  detailedStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 6,
    lineHeight: 24,
  },
  detailedStatLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 4,
  },
  detailedStatDescription: {
    fontSize: 12,
    color: colors.mutedForeground,
    lineHeight: 16,
  },

  // 차트 섹션 (통계 전용 스타일)
  chartSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
  },
  chartBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chartBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  enhancedChartCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartSubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  chartStats: {
    flexDirection: 'row',
    gap: 16,
  },
  chartStatItem: {
    alignItems: 'center',
  },
  chartStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 2,
  },
  chartStatLabel: {
    fontSize: 11,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  chartContainer: {
    marginVertical: 16,
  },
  chart: {
    borderRadius: 16,
  },
  enhancedChartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 13,
    color: colors.foreground,
    fontWeight: '500',
  },
  legendValue: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontWeight: '600',
    marginLeft: 4,
  },
  // 파이 차트 스타일
    enhancedPieChartContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingHorizontal: 8,
    },
  pieChartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
    height: 160,
  },
    enhancedPieChartLegend: {
      width: 160,
      marginLeft: 12,
    },
  enhancedPieLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pieLegendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pieLegendRight: {
    alignItems: 'flex-end',
  },
  pieLegendValue: {
    fontSize: 12,
    color: colors.foreground,
    fontWeight: 'bold',
  },
  pieLegendPercentage: {
    fontSize: 10,
    color: colors.mutedForeground,
    fontWeight: '600',
  },
  
  // 관계별 차트 스타일
  relationshipScrollContainer: {
    height: 180, // 3개 카드 높이 (56px * 3 + 간격)
  },
  enhancedRelationshipLegend: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 16,
  },
  enhancedRelationshipLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 8,
  },
  relationshipLegendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  relationshipLegendRight: {
    alignItems: 'flex-end',
  },
  relationshipLegendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  relationshipLegendText: {
    fontSize: 14,
    color: colors.foreground,
    fontWeight: '500',
  },
  relationshipLegendValue: {
    fontSize: 12,
    color: colors.foreground,
    fontWeight: '600',
  },
  relationshipLegendAmount: {
    fontSize: 11,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  

  // 인사이트 섹션 (홈 페이지 스타일)
  insightsSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  insightsGrid: {
    gap: 12,
  },
  insightCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 4,
  },
  insightText: {
    fontSize: 13,
    color: colors.mutedForeground,
    lineHeight: 18,
  },

  // 차트 플레이스홀더
  chartPlaceholder: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginVertical: 10,
  },
  chartPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
    marginTop: 12,
    marginBottom: 4,
  },
  chartPlaceholderSubtext: {
    fontSize: 12,
    color: '#999',
  },
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  pieChartLegend: {
    marginLeft: 20,
    flex: 1,
  },
  pieLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pieLegendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  pieLegendText: {
    fontSize: 11,
    color: '#4a5568',
    fontWeight: '500',
  },

  // 툴팁 스타일 (통계 전용)
  enhancedTooltip: {
    position: 'absolute',
    backgroundColor: colors.foreground,
    borderRadius: 12,
    padding: 12,
    minWidth: 140,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tooltipTitle: {
    fontSize: 12,
    color: colors.background,
    fontWeight: '600',
    marginBottom: 4,
  },
  tooltipValue: {
    fontSize: 14,
    color: colors.background,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tooltipDescription: {
    fontSize: 11,
    color: colors.mutedForeground,
    lineHeight: 14,
  },

  // 로딩 상태 스타일
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
  },

  // 빈 상태 스타일
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  emptyStateContent: {
    alignItems: 'center',
  },
  emptyStateIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.border,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },


  // 차트 설명 스타일
  chartDescription: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chartDescriptionText: {
    fontSize: 13,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default Stats;


