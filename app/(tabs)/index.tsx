import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    ScrollView,
    StyleSheet
} from 'react-native';
import QuickStats from '../../src/components/dashboard/QuickStats';
import RecentEvents from '../../src/components/dashboard/RecentEvents';
import WelcomeHeader from '../../src/components/dashboard/WelcomeHeader';
import MobileLayout from '../../src/components/layout/MobileLayout';
import { homeService } from '../../src/services/api';
import { MonthlyStats, QuickStats as QuickStatsType, RecentLedger } from '../../src/types';

export default function HomeScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // API 데이터 상태
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStatsType | null>(null);
  const [recentLedgers, setRecentLedgers] = useState<RecentLedger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 홈 화면 데이터 로드 (메모이제이션)
  const loadHomeData = useCallback(async () => {
    console.log('🏠 loadHomeData 함수 시작됨');
    try {
      setLoading(true);
      setError(null);
      
             // 3개 API를 병렬로 호출
             console.log('🏠 홈 API 호출 시작...');
             const startTime = Date.now();
             const [monthlyResponse, quickResponse, recentResponse] = await Promise.all([
               homeService.getMonthlyStats(),
               homeService.getQuickStats(),
               homeService.getRecentLedgers()
             ]);
             const endTime = Date.now();
             const responseTime = endTime - startTime;
             console.log(`🏠 홈 API 응답 시간: ${responseTime}ms`);
             console.log('🏠 홈 API 응답 받음:', { monthlyResponse, quickResponse, recentResponse });

      if (monthlyResponse.success) {
        setMonthlyStats(monthlyResponse.data);
      }
      
      if (quickResponse.success) {
        setQuickStats(quickResponse.data);
      }
      
      if (recentResponse.success) {
        setRecentLedgers(recentResponse.data);
      }
    } catch (error) {
      console.error('홈 화면 데이터 로드 실패:', error);
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  // 탭이 포커스될 때마다 스크롤을 맨 위로 이동하고 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      loadHomeData(); // 탭 포커스 시 데이터 새로고침
    }, [loadHomeData])
  );

  // 페이드인 애니메이션 효과 (다른 화면과 동일하게 로딩 완료 후 실행)
  React.useEffect(() => {
    console.log('🏠 홈 화면 페이드인 애니메이션:', { loading, error });
    if (!loading && !error) {
      console.log('🏠 페이드인 애니메이션 시작');
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    } else {
      console.log('🏠 페이드인 애니메이션 초기화');
      fadeAnim.setValue(0);
    }
  }, [loading, error, fadeAnim]);


  return (
    <MobileLayout currentPage="home">
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* 헤더 */}
          <WelcomeHeader 
            monthlyStats={monthlyStats}
            loading={loading}
          />

          {/* 통계 카드 */}
          <QuickStats 
            quickStats={quickStats}
            loading={loading}
          />

          {/* 최근 경조사 */}
          <RecentEvents 
            recentLedgers={recentLedgers}
            loading={loading}
          />
        </Animated.View>

      </ScrollView>

      {/*/!* 플로팅 액션 버튼 *!/*/}
      {/*<FloatingActionButton />*/}
    </MobileLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});