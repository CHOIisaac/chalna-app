import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MobileLayout from '../components/layout/MobileLayout';
import { colors } from '../lib/utils';
import {
  AmountDistributionData,
  EventData,
  handleApiError,
  MonthlyTrendData,
  NetworkDataByType,
  RelationshipStatsData,
  statsService,
  TopItemsData,
  TotalAmountsData
} from '../services/api';

// 로컬 타입 정의 (API 타입과 중복되지 않는 것들)

// 유틸리티 함수들
const formatAmount = (amount: number): string => {
  return amount.toLocaleString();
};


const Stats: React.FC = (): React.ReactElement => {
  const [selectedType, setSelectedType] = useState<'given' | 'received'>('given');
  const [selectedTab, setSelectedTab] = useState<'total' | 'items' | 'network' | 'events'>('total');
  const [weddingYear, setWeddingYear] = useState(new Date().getFullYear());
  const [condolenceYear, setCondolenceYear] = useState(new Date().getFullYear());
  
  // API 상태 관리
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // 통합 월별 데이터
  const [monthlyTrendsData, setMonthlyTrendsData] = useState<MonthlyTrendData | null>(null);
  
  // 총액 데이터 (통합)
  const [totalAmountsData, setTotalAmountsData] = useState<TotalAmountsData | null>(null);
  
  // TOP 5 항목 데이터 (통합)
  const [topItemsData, setTopItemsData] = useState<TopItemsData | null>(null);
  
  // 금액대별 분포 데이터 (통합)
  const [amountDistributionData, setAmountDistributionData] = useState<AmountDistributionData | null>(null);
  
  // 관계별 분석 데이터 (통합)
  const [relationshipStatsData, setRelationshipStatsData] = useState<RelationshipStatsData | null>(null);
  
  // 개인별 상세 데이터 (통합)
  const [networkData, setNetworkData] = useState<NetworkDataByType | null>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // API 호출 함수들
  const loadMonthlyTrends = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 실제 데이터가 있는 연도와 월만 받아옴
      const response = await statsService.getMonthlyTrends();
      
      if (response.success) {
        setMonthlyTrendsData(response.data);
      } else {
        setError(response.error || '월별 추세 데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('월별 추세 데이터 로드 실패:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // 총액 데이터 로드 (given/received 모두 한 번에)
  const loadTotalAmounts = useCallback(async () => {
    try {
      const response = await statsService.getTotalAmounts();
      
      if (response.success) {
        setTotalAmountsData(response.data);
      } else {
        setError(response.error || '총액 데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('총액 데이터 로드 실패:', err);
      setError(handleApiError(err));
    }
  }, []);

  // TOP 5 항목 데이터 로드 (given/received 모두 한 번에)
  const loadTopItems = useCallback(async () => {
    try {
      const response = await statsService.getTopItems({ limit: 5 });
      
      if (response.success) {
        setTopItemsData(response.data);
      } else {
        setError(response.error || 'TOP 5 항목 데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('TOP 5 항목 데이터 로드 실패:', err);
      setError(handleApiError(err));
    }
  }, []);

  // 금액대별 분포 데이터 로드 (given/received 모두 한 번에)
  const loadAmountDistribution = useCallback(async () => {
    try {
      const response = await statsService.getAmountDistribution();
      
      if (response.success) {
        setAmountDistributionData(response.data);
      } else {
        setError(response.error || '금액대별 분포 데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('금액대별 분포 데이터 로드 실패:', err);
      setError(handleApiError(err));
    }
  }, []);

  // 관계별 분석 데이터 로드 (given/received 모두 한 번에)
  const loadRelationshipStats = useCallback(async () => {
    try {
      const response = await statsService.getRelationshipBreakdown();
      
      if (response.success) {
        setRelationshipStatsData(response.data);
      } else {
        setError(response.error || '관계별 분석 데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('관계별 분석 데이터 로드 실패:', err);
      setError(handleApiError(err));
    }
  }, []);

  // 개인별 상세 데이터 로드 (given/received 모두 한 번에)
  const loadNetworkData = useCallback(async () => {
    try {
      const response = await statsService.getPersonalDetails();
      
      if (response.success) {
        setNetworkData(response.data);
      } else {
        setError(response.error || '개인별 상세 데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('개인별 상세 데이터 로드 실패:', err);
      setError(handleApiError(err));
    }
  }, []);

  // 년도 변경 시 데이터 로드 (이제 월별 추세는 한 번에 로드되므로 년도만 업데이트)
  const handleYearChange = useCallback((year: number, type: 'wedding' | 'condolence') => {
    if (type === 'wedding') {
      setWeddingYear(year);
    } else {
      setCondolenceYear(year);
    }
  }, []);

  // 탭이 포커스될 때마다 스크롤을 맨 위로 이동하고 데이터 로드
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      
      // 초기 데이터 로드 (총액 탭의 월별 데이터와 총액 데이터)
      if (selectedTab === 'total') {
        // 월별 추세 데이터 한 번에 로드
        loadMonthlyTrends();
        
        // 총액 데이터 로드 (나눈/받은 모두 한 번에)
        loadTotalAmounts();
      } else if (selectedTab === 'items') {
        // TOP 5 항목 데이터 로드
        loadTopItems();
        // 금액대별 분포 데이터 로드
        loadAmountDistribution();
      } else if (selectedTab === 'network') {
        // 관계별 분석 데이터 로드
        loadRelationshipStats();
        // 개인별 상세 데이터 로드
        loadNetworkData();
      }
    }, [selectedTab, loadMonthlyTrends, loadTotalAmounts, loadTopItems, loadAmountDistribution, loadRelationshipStats, loadNetworkData])
  );

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // 타입 변경 시 월별 데이터 로드 (이제 월별 데이터는 한 번에 로드되므로 필요없음)
  // React.useEffect(() => {
  //   if (selectedTab === 'total') {
  //     loadMonthlyData(weddingYear, 'wedding');
  //     loadMonthlyData(condolenceYear, 'condolence');
  //   }
  // }, [selectedType, selectedTab, weddingYear, condolenceYear, loadMonthlyData]);

  // Mock 데이터 - useMemo로 최적화 (다른 탭용, 월별 데이터는 API에서 가져옴)
  const mockData = useMemo(() => {


    const eventData: EventData[] = [
      { type: '결혼식', count: 8, avgAmount: 350000 },
      { type: '출산', count: 3, avgAmount: 200000 },
      { type: '장례식', count: 2, avgAmount: 150000 },
      { type: '기타', count: 1, avgAmount: 100000 },
    ];


    const chartColors = ['#1F2937', '#9CA3AF', '#1E3A8A', '#374151', '#111827', '#6B7280', '#9CA3AF', '#D1D5DB'];

    return {
      eventData,
      chartColors,
    };
  }, []);

  // 계산된 데이터들
  const { eventData, chartColors } = mockData;
  
  // 선택된 년도와 타입에 따른 데이터 선택 (새로운 API 구조)
  const weddingMonthlyData = useMemo(() => {
    if (!monthlyTrendsData?.wedding) return [];
    
    return selectedType === 'given' ? monthlyTrendsData.wedding.given : monthlyTrendsData.wedding.received;
  }, [monthlyTrendsData, selectedType]);
    
  const condolenceMonthlyData = useMemo(() => {
    if (!monthlyTrendsData?.condolence) return [];
    
    return selectedType === 'given' ? monthlyTrendsData.condolence.given : monthlyTrendsData.condolence.received;
  }, [monthlyTrendsData, selectedType]);

  // 월별 차트 렌더링 함수 (중복 제거)

  // 계산된 통계 데이터
  const calculatedStats = useMemo(() => {
    // 나눈 금액: API에서 받은 실제 데이터 사용
    const givenWedding = totalAmountsData?.given?.wedding?.total || 0;
    const givenCondolence = totalAmountsData?.given?.condolence?.total || 0;
    
    // 받은 금액: API에서 받은 실제 데이터 사용
    const receivedWedding = totalAmountsData?.received?.wedding?.total || 0;
    const receivedCondolence = totalAmountsData?.received?.condolence?.total || 0;
    
    return {
      given: {
        wedding: givenWedding,
        condolence: givenCondolence,
        total: givenWedding + givenCondolence,
      },
      received: {
        wedding: receivedWedding,
        condolence: receivedCondolence,
        total: receivedWedding + receivedCondolence,
      }
    };
  }, [totalAmountsData]);

  const renderTotalAnalysis = () => {
    const currentStats = selectedType === 'given' ? calculatedStats.given : calculatedStats.received;
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>총액 및 추세 분석</Text>
          </View>
          <View style={styles.periodToggle}>
            <TouchableOpacity
              style={[styles.periodToggleButton, selectedType === 'given' && styles.periodToggleButtonActive]}
              onPress={() => setSelectedType('given')}
              accessibilityRole="button"
              accessibilityLabel={`나눔 통계 보기, ${selectedType === 'given' ? '현재 선택됨' : '선택되지 않음'}`}
            >
              <Text style={[styles.periodToggleText, selectedType === 'given' && styles.periodToggleTextActive]}>
                나눔
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodToggleButton, selectedType === 'received' && styles.periodToggleButtonActive]}
              onPress={() => setSelectedType('received')}
              accessibilityRole="button"
              accessibilityLabel={`받음 통계 보기, ${selectedType === 'received' ? '현재 선택됨' : '선택되지 않음'}`}
            >
              <Text style={[styles.periodToggleText, selectedType === 'received' && styles.periodToggleTextActive]}>
                받음
              </Text>
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryCardContent}>
              <Text style={styles.summaryLabel}>
                {selectedType === 'given' ? '나눈 축의금' : '받은 축의금'}
              </Text>
              <Text style={styles.summaryAmount}>
                {formatAmount(currentStats.wedding)}원
              </Text>
            </View>
          </View>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryCardContent}>
              <Text style={styles.summaryLabel}>
                {selectedType === 'given' ? '나눈 조의금' : '받은 조의금'}
              </Text>
              <Text style={styles.summaryAmount}>
                {formatAmount(currentStats.condolence)}원
              </Text>
            </View>
          </View>
        </View>

        {/* 월별 축의금 추세 - 2줄 그리드 차트 */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>월별 축의금 추세</Text>
            <View style={styles.arrowYearSelector}>
              <TouchableOpacity
                style={styles.arrowButton}
                onPress={() => handleYearChange(weddingYear === 2024 ? 2025 : 2024, 'wedding')}
                disabled={loading}
              >
                <Text style={styles.arrowText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.yearText}>{weddingYear}</Text>
              <TouchableOpacity
                style={styles.arrowButton}
                onPress={() => handleYearChange(weddingYear === 2024 ? 2025 : 2024, 'wedding')}
                disabled={loading}
              >
                <Text style={styles.arrowText}>›</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#1F2937" />
              <Text style={styles.loadingText}>데이터를 불러오는 중...</Text>
            </View>
          )}
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => {
                  loadMonthlyTrends();
                }}
              >
                <Text style={styles.retryButtonText}>다시 시도</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {!loading && !error && (
            <View style={styles.chartGrid}>
              {weddingMonthlyData.length > 0 ? weddingMonthlyData.map((item, index) => {
              const maxAmount = Math.max(...weddingMonthlyData.map(i => i.amount));
              const percentage = (item.amount / maxAmount) * 100;
              const isHighest = item.amount === maxAmount;
              
              return (
                <View key={index} style={styles.monthBarGrid}>
                  <View style={styles.monthBarHeaderGrid}>
                    <Text style={[styles.monthLabel, isHighest && styles.monthLabelHighlighted]}>{item.month}</Text>
                    <View style={styles.monthBarValuesGrid}>
                      <Text style={[styles.monthAmount, isHighest && styles.monthAmountHighlighted]}>
                        {item.amount.toLocaleString()}원
                      </Text>
                    </View>
                  </View>
                  <View style={styles.monthBarContainerGrid}>
                    <View 
                      style={[
                        styles.monthBarFillGrid, 
                        { 
                          backgroundColor: chartColors[index % chartColors.length],
                          width: `${percentage}%`,
                          opacity: isHighest ? 1 : 0.8
                        }
                      ]} 
                    />
                  </View>
                </View>
              );
            }) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>
                  {selectedType === 'received' ? '받은 축의금 월별 데이터가 없습니다.' : '월별 데이터가 없습니다.'}
                </Text>
              </View>
            )}
            </View>
          )}
        </View>

        {/* 차트 간격 */}
        <View style={styles.chartSpacing} />

        {/* 월별 조의금 추세 - 2줄 그리드 차트 */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>월별 조의금 추세</Text>
            <View style={styles.arrowYearSelector}>
              <TouchableOpacity
                style={styles.arrowButton}
                onPress={() => handleYearChange(condolenceYear === 2024 ? 2025 : 2024, 'condolence')}
                disabled={loading}
              >
                <Text style={styles.arrowText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.yearText}>{condolenceYear}</Text>
              <TouchableOpacity
                style={styles.arrowButton}
                onPress={() => handleYearChange(condolenceYear === 2024 ? 2025 : 2024, 'condolence')}
                disabled={loading}
              >
                <Text style={styles.arrowText}>›</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#1F2937" />
              <Text style={styles.loadingText}>데이터를 불러오는 중...</Text>
            </View>
          )}
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => {
                  loadMonthlyTrends();
                }}
              >
                <Text style={styles.retryButtonText}>다시 시도</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {!loading && !error && (
            <View style={styles.chartGrid}>
              {condolenceMonthlyData.length > 0 ? condolenceMonthlyData.map((item, index) => {
              const maxAmount = Math.max(...condolenceMonthlyData.map(i => i.amount));
              const percentage = (item.amount / maxAmount) * 100;
              const isHighest = item.amount === maxAmount;
              
              return (
                <View key={index} style={styles.monthBarGrid}>
                  <View style={styles.monthBarHeaderGrid}>
                    <Text style={[styles.monthLabel, isHighest && styles.monthLabelHighlighted]}>{item.month}</Text>
                    <View style={styles.monthBarValuesGrid}>
                      <Text style={[styles.monthAmount, isHighest && styles.monthAmountHighlighted]}>
                        {item.amount.toLocaleString()}원
                      </Text>
                    </View>
                  </View>
                  <View style={styles.monthBarContainerGrid}>
                    <View 
                      style={[
                        styles.monthBarFillGrid, 
                        { 
                          backgroundColor: chartColors[index % chartColors.length],
                          width: `${percentage}%`,
                          opacity: isHighest ? 1 : 0.8
                        }
                      ]} 
                    />
                  </View>
                </View>
              );
            }) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>
                  {selectedType === 'received' ? '받은 조의금 월별 데이터가 없습니다.' : '월별 데이터가 없습니다.'}
                </Text>
              </View>
            )}
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderItemsAnalysis = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>항목별 분석</Text>
        </View>
        <View style={styles.periodToggle}>
          <TouchableOpacity
            style={[styles.periodToggleButton, selectedType === 'given' && styles.periodToggleButtonActive]}
            onPress={() => setSelectedType('given')}
            accessibilityRole="button"
            accessibilityLabel={`나눔 통계 보기, ${selectedType === 'given' ? '현재 선택됨' : '선택되지 않음'}`}
          >
            <Text style={[styles.periodToggleText, selectedType === 'given' && styles.periodToggleTextActive]}>
              나눔
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodToggleButton, selectedType === 'received' && styles.periodToggleButtonActive]}
            onPress={() => setSelectedType('received')}
            accessibilityRole="button"
            accessibilityLabel={`받음 통계 보기, ${selectedType === 'received' ? '현재 선택됨' : '선택되지 않음'}`}
          >
            <Text style={[styles.periodToggleText, selectedType === 'received' && styles.periodToggleTextActive]}>
              받음
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TOP 5 항목 - 랭킹 스타일 */}
      <View style={styles.topItemsContainer}>
        <View style={styles.subsectionTitleContainer}>
          <Text style={styles.subsectionTitle}>TOP 5 항목</Text>
        </View>
        {(topItemsData?.[selectedType] || []).map((item, index) => (
          <View key={index} style={styles.topItemCard}>
            <View style={styles.rankSection}>
              <View style={[styles.rankBadge, { backgroundColor: chartColors[index % chartColors.length] }]}>
                <Text style={styles.rankNumber}>{index + 1}</Text>
              </View>
            </View>
            <View style={styles.topItemInfo}>
              <Text style={styles.topItemName}>{item.name}</Text>
              <Text style={styles.topItemType}>{item.type}</Text>
            </View>
            <View style={styles.topItemAmount}>
              <Text style={styles.topItemAmountText}>
                {item.amount.toLocaleString()}원
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* 금액대별 분포 - 분포 차트 스타일 */}
      <View style={styles.distributionContainer}>
        <View style={styles.subsectionTitleContainer}>
          <Text style={styles.subsectionTitle}>금액대별 분포</Text>
        </View>
        <View style={styles.distributionGrid}>
          {(amountDistributionData?.[selectedType] || []).map((item, index) => (
            <View key={index} style={styles.distributionItem}>
              <View style={styles.distributionHeader}>
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
        <View style={styles.periodToggle}>
          <TouchableOpacity
            style={[styles.periodToggleButton, selectedType === 'given' && styles.periodToggleButtonActive]}
            onPress={() => setSelectedType('given')}
            accessibilityRole="button"
            accessibilityLabel={`나눔 통계 보기, ${selectedType === 'given' ? '현재 선택됨' : '선택되지 않음'}`}
          >
            <Text style={[styles.periodToggleText, selectedType === 'given' && styles.periodToggleTextActive]}>
              나눔
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodToggleButton, selectedType === 'received' && styles.periodToggleButtonActive]}
            onPress={() => setSelectedType('received')}
            accessibilityRole="button"
            accessibilityLabel={`받음 통계 보기, ${selectedType === 'received' ? '현재 선택됨' : '선택되지 않음'}`}
          >
            <Text style={[styles.periodToggleText, selectedType === 'received' && styles.periodToggleTextActive]}>
              받음
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 관계별 분석 */}
      <View style={styles.relationshipContainer}>
        {(relationshipStatsData?.[selectedType] || []).map((stat, index) => {
          // color를 추가 (API에서는 color가 없으므로 프론트엔드에서 추가)
          const statWithColor = { ...stat, color: chartColors[index % chartColors.length] };
          return (
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
                      backgroundColor: statWithColor.color,
                      width: `${(stat.totalAmount / Math.max(...(relationshipStatsData?.[selectedType] || []).map(s => s.totalAmount), 1)) * 100}%`
                    }
                  ]} 
                />
              </View>
            </View>
          </View>
          );
        })}
      </View>

      {/* 개인별 상세 분석 */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>개인별 상세</Text>
        </View>
      </View>

      {(networkData?.[selectedType] || []).map((person, index) => (
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
                    width: `${(person.total / Math.max(...(networkData?.[selectedType] || []).map(p => p.total), 1)) * 100}%` 
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
      </View>

      {/* 이벤트별 기록 - 통계 카드 스타일 */}
      <View style={styles.eventStatsContainer}>
        <View style={styles.subsectionTitleContainer}>
          <Text style={styles.subsectionTitle}>이벤트별 기록</Text>
        </View>
        <View style={styles.eventStatsGrid}>
          {eventData.map((event, index) => (
            <View key={index} style={styles.eventStatCard}>
              <View style={styles.eventStatInfo}>
                <Text style={styles.eventStatType}>{event.type}</Text>
                <Text style={styles.eventStatCount}>{event.count}회</Text>
              </View>
              <View style={styles.eventStatAmount}>
                <Text style={styles.eventStatAvgAmount}>평균</Text>
                <Text style={styles.eventStatAmountText}>{event.avgAmount.toLocaleString()}원</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 이벤트 건수 추세 - 타임라인 스타일 */}
      <View style={styles.eventTrendContainer}>
        <View style={styles.subsectionTitleContainer}>
          <Text style={styles.subsectionTitle}>이벤트 건수 추세</Text>
        </View>
        <View style={styles.timelineContainer}>
          {eventData.map((event, index) => {
            const maxCount = Math.max(...eventData.map(e => e.count));
            const percentage = (event.count / maxCount) * 100;
            const isHighest = event.count === maxCount;
            
            return (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineContent}>
                  <View style={styles.timelineHeader}>
                    <Text style={[styles.timelineEventType, isHighest && styles.timelineEventTypeHighlighted]}>
                      {event.type}
                    </Text>
                    <View style={styles.timelineBadge}>
                      <Text style={[styles.timelineCount, isHighest && styles.timelineCountHighlighted]}>
                        {event.count}건
                      </Text>
                      {isHighest && <Text style={styles.timelineHighest}>최고</Text>}
                    </View>
                  </View>
                  <View style={styles.timelineBar}>
                    <View 
                      style={[
                        styles.timelineBarFill, 
                        { 
                          backgroundColor: chartColors[index % chartColors.length],
                          width: `${percentage}%`,
                          opacity: isHighest ? 1 : 0.7
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.timelineAvg}>평균 {event.avgAmount.toLocaleString()}원</Text>
                </View>
              </View>
            );
          })}
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
      {/* 고정 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>찰나 통계</Text>
        </View>
      </View>

      {/* 고정 탭 컨테이너 */}
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
            accessibilityRole="tab"
            accessibilityLabel={`${tab.label} 탭, ${selectedTab === tab.key ? '현재 선택됨' : '선택되지 않음'}`}
            accessibilityState={{ selected: selectedTab === tab.key }}
          >
            <Text style={[styles.tabText, selectedTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView ref={scrollViewRef} style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {renderTabContent()}
        </Animated.View>
      </ScrollView>
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
  header: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: 23,
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
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
    // flex: 1 제거
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
    fontSize: 16,
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
    alignItems: 'stretch',
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
    minHeight: 120,
    height: 120,
    width: '48%',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  arrowYearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  arrowButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 24,
  },
  arrowText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  yearText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
    paddingHorizontal: 8,
    minWidth: 40,
    textAlign: 'center',
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
    flexShrink: 0,
  },
  monthAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
  },
  monthBarContainer: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
  },
  monthInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  monthBarFill: {
    height: 4,
    borderRadius: 2,
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
    alignItems: 'flex-end',
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
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    marginBottom: 4,
  },
  distributionBarFill: {
    height: 4,
    borderRadius: 2,
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
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 16,
    minWidth: 150,
  },
  relationshipAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 6,
  },
  relationshipBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  relationshipBarFill: {
    height: 4,
    borderRadius: 2,
  },
  chartSpacing: {
    height: 15,
  },


  // 2줄 그리드 차트 스타일
  chartGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  monthBarGrid: {
    width: '48%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    marginBottom: 8,
  },
  monthBarHeaderGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    minHeight: 24,
  },
  monthBarValuesGrid: {
    flex: 1,
    marginLeft: 8,
    alignItems: 'flex-end',
  },
  monthBarContainerGrid: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  monthBarFillGrid: {
    height: 4,
    borderRadius: 2,
  },
  
  // 새로운 고유 스타일들
  
  // 항목 탭 - 랭킹 스타일
  rankSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topItemAmountText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
  },
  
  // 분포 차트 스타일
  distributionGrid: {
    gap: 12,
  },
  
  // 순간 탭 - 통계 카드 스타일
  eventStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  eventStatCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  eventStatInfo: {
    alignItems: 'center',
    marginBottom: 8,
  },
  eventStatType: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 4,
  },
  eventStatCount: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  eventStatAmount: {
    alignItems: 'center',
  },
  eventStatAvgAmount: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  eventStatAmountText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.foreground,
  },
  
  // 타임라인 스타일
  timelineContainer: {
  },
  timelineItem: {
    marginBottom: 20,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 2,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineEventType: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.foreground,
  },
  timelineEventTypeHighlighted: {
    color: '#FF6B6B',
    fontWeight: '700',
  },
  timelineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timelineCount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.foreground,
  },
  timelineCountHighlighted: {
    color: '#FF6B6B',
  },
  timelineHighest: {
    fontSize: 10,
    color: '#FF6B6B',
    fontWeight: '600',
    backgroundColor: '#FFE0E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  timelineBar: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    marginBottom: 6,
    overflow: 'hidden',
  },
  timelineBarFill: {
    height: 4,
    borderRadius: 2,
  },
  timelineAvg: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  
  // 차트 스타일 (누락된 것들)
  chartBars: {
    gap: 8,
  },
  monthBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    minHeight: 24,
  },
  monthLabelHighlighted: {
    color: '#FF6B6B',
    fontWeight: '700',
  },
  monthBarValues: {
    alignItems: 'flex-end',
    flex: 1,
    marginLeft: 12,
  },
  monthAmountHighlighted: {
    color: '#FF6B6B',
    fontWeight: '700',
  },
  
  // 로딩 및 에러 상태 스타일
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // 데이터 없음 상태 스타일
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noDataText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default Stats;