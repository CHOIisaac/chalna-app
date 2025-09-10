import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import MobileLayout from '../components/layout/MobileLayout';
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
  }, []);
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
  }, []);
  
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
  const chartSize = 200;
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;
  const radius = 80;
  
  const total = data.reduce((sum, item) => sum + item.value, 0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);
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
  const [selectedData, setSelectedData] = useState<{
    title: string;
    value: string;
    description: string;
    position: { x: number; y: number };
  } | null>(null);

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

  // 터치 핸들러 함수들
  const handleLineChartPointPress = (index: number, value: number, label: string) => {
    const monthData = monthlyData[index];
    setSelectedData({
      title: `${label} 월별 통계`,
      value: `${(value * 10000).toLocaleString()}원`,
      description: `이벤트 ${monthData.events}건, 순수익 ${monthData.net.toLocaleString()}원`,
      position: { x: 50 + (index * 50), y: 100 }
    });
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

  return (
    <MobileLayout currentPage="stats">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 무신사 스타일 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>마음의 통계</Text>
            <TouchableOpacity
              style={styles.periodButton}
              onPress={() => {
                // Period selection logic here
              }}
            >
              <Text style={styles.periodText}>{selectedPeriod}년</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>따뜻한 마음의 흐름을 한눈에</Text>
        </View>

        {/* 무신사 스타일 핵심 지표 */}
        <View style={styles.metricsSection}>
          <View style={styles.metricsCard}>
            <View style={styles.metricsHeader}>
              <Text style={styles.metricsTitle}>핵심 지표</Text>
              <View style={styles.metricsBadge}>
                <Text style={styles.metricsBadgeText}>2025년</Text>
              </View>
            </View>
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <View style={styles.metricIcon}>
                  <Ionicons name="heart" size={20} color="#4a5568" />
                </View>
                <Text style={styles.metricValue}>{totalIncome.toLocaleString()}</Text>
                <Text style={styles.metricLabel}>받은 마음</Text>
                <Text style={styles.metricChange}>+12% vs 전월</Text>
              </View>
              
              <View style={styles.metricDivider} />
              
              <View style={styles.metricItem}>
                <View style={styles.metricIcon}>
                  <Ionicons name="trending-up" size={20} color="#4a5568" />
                </View>
                <Text style={styles.metricValue}>{totalExpense.toLocaleString()}</Text>
                <Text style={styles.metricLabel}>나눈 마음</Text>
                <Text style={styles.metricChange}>+8% vs 전월</Text>
              </View>
              
              <View style={styles.metricDivider} />
              
              <View style={styles.metricItem}>
                <View style={styles.metricIcon}>
                  <Ionicons name="trending-up" size={20} color="#4a5568" />
                </View>
                <Text style={[styles.metricValue, { color: netBalance >= 0 ? '#4a5568' : '#718096' }]}>
                  {netBalance >= 0 ? '+' : ''}{netBalance.toLocaleString()}
                </Text>
                <Text style={styles.metricLabel}>마음의 수지</Text>
                <Text style={styles.metricChange}>
                  {netBalance >= 0 ? '여유로운 상태' : '적극적인 나눔'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 월별 수입/지출 추이 차트 */}
        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>월별 수입/지출 추이</Text>
            <Text style={styles.sectionCount}>8개월</Text>
          </View>
          
          <View style={styles.chartCard}>
            <InteractiveLineChart 
              data={lineChartData.income} 
              labels={lineChartData.labels} 
              colors={lineChartData.colors}
              onPointPress={handleLineChartPointPress}
            />
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#4a5568' }]} />
                <Text style={styles.legendText}>받은 마음 (만원)</Text>
              </View>
            </View>
            {selectedData && selectedData.title.includes('월별') && (
              <View style={[styles.tooltip, { 
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

        {/* 경조사 종류별 분포 */}
        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>경조사 종류별 분포</Text>
            <Text style={styles.sectionCount}>4종류</Text>
          </View>
          
          <View style={styles.chartCard}>
            <View style={styles.pieChartContainer}>
              <InteractivePieChart 
                data={pieChartData}
                onSlicePress={handlePieChartPress}
              />
              <View style={styles.pieChartLegend}>
                {pieChartData.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.pieLegendItem}
                    onPress={() => handlePieChartPress(index, item.name, item.value, item.value / pieChartData.reduce((sum, i) => sum + i.value, 0))}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.pieLegendDot, { backgroundColor: item.color }]} />
                    <Text style={styles.pieLegendText}>{item.name} ({item.value}개)</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {selectedData && selectedData.title.includes('통계') && !selectedData.title.includes('관계') && (
              <View style={[styles.tooltip, { 
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

        {/* 관계별 통계 */}
        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>관계별 마음 나눔</Text>
            <Text style={styles.sectionCount}>4그룹</Text>
          </View>
          
          <View style={styles.chartCard}>
            <InteractiveBarChart 
              data={barChartData.data} 
              labels={barChartData.labels} 
              colors={barChartData.colors}
              onBarPress={handleBarChartPress}
            />
            <View style={styles.relationshipLegend}>
              {relationshipStats.map((stat, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.relationshipLegendItem}
                  onPress={() => handleBarChartPress(index, stat.amount / 10000, stat.relation)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.relationshipLegendDot, { backgroundColor: stat.color }]} />
                  <Text style={styles.relationshipLegendText}>
                    {stat.relation} ({stat.count}명, {Math.round(stat.amount / 10000)}만원)
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {selectedData && selectedData.title.includes('관계') && (
              <View style={[styles.tooltip, { 
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
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4a5568',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 20,
  },

  // 핵심 지표 섹션
  metricsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  metricsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  metricsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  metricsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  metricsBadge: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  metricsBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a5568',
  },
  metricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 11,
    color: '#999',
  },
  metricDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#e9ecef',
    marginHorizontal: 20,
  },

  // 차트 섹션
  chartSection: {
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
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chart: {
    borderRadius: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  relationshipLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  relationshipLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  relationshipLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  relationshipLegendText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },

  // 인사이트 섹션
  insightsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  insightsGrid: {
    gap: 12,
  },
  insightCard: {
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
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
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
    color: '#1a1a1a',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 13,
    color: '#666',
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
    fontSize: 12,
    color: '#4a5568',
    fontWeight: '500',
  },

  // 툴팁 스타일
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 8,
    padding: 8,
    minWidth: 120,
    zIndex: 1000,
  },
  tooltipTitle: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 2,
  },
  tooltipValue: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 2,
  },
  tooltipDescription: {
    fontSize: 10,
    color: '#d1d5db',
    lineHeight: 12,
  },
});

export default Stats;
