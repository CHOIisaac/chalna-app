import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useRef } from 'react';
import {
    ScrollView,
    StyleSheet
} from 'react-native';
import QuickStats from '../../src/components/dashboard/QuickStats';
import RecentEvents from '../../src/components/dashboard/RecentEvents';
import WelcomeHeader from '../../src/components/dashboard/WelcomeHeader';
import MobileLayout from '../../src/components/layout/MobileLayout';

export default function HomeScreen() {
  const scrollViewRef = useRef<ScrollView>(null);

  // 탭이 포커스될 때마다 스크롤을 맨 위로 이동
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
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
        <WelcomeHeader />

        {/* 통계 카드 */}
        <QuickStats />

        {/* 최근 경조사 */}
        <RecentEvents />

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