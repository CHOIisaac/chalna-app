import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
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
  
  // API 데이터 상태
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStatsType | null>(null);
  const [recentLedgers, setRecentLedgers] = useState<RecentLedger[]>([]);
  const [loading, setLoading] = useState(true);

  // 홈 화면 데이터 로드
  const loadHomeData = async () => {
    try {
      setLoading(true);
      
      // 3개 API를 병렬로 호출
      const [monthlyResponse, quickResponse, recentResponse] = await Promise.all([
        homeService.getMonthlyStats(),
        homeService.getQuickStats(),
        homeService.getRecentLedgers()
      ]);

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
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadHomeData();
  }, []);

  // 탭이 포커스될 때마다 스크롤을 맨 위로 이동하고 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      loadHomeData(); // 탭 포커스 시 데이터 새로고침
    }, [])
  );


  return (
    <MobileLayout currentPage="home">
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
      >
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
});