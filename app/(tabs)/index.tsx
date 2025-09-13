import React from 'react';
import {
    ScrollView,
    StyleSheet
} from 'react-native';
import FloatingActionButton from '../../src/components/common/FloatingActionButton';
import QuickStats from '../../src/components/dashboard/QuickStats';
import RecentEvents from '../../src/components/dashboard/RecentEvents';
import WelcomeHeader from '../../src/components/dashboard/WelcomeHeader';
import MobileLayout from '../../src/components/layout/MobileLayout';

export default function HomeScreen() {
  return (
    <MobileLayout currentPage="home">
      <ScrollView 
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
