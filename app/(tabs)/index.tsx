import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import QuickStats from '../../src/components/dashboard/QuickStats';
import RecentEvents from '../../src/components/dashboard/RecentEvents';
import WelcomeHeader from '../../src/components/dashboard/WelcomeHeader';
import MobileLayout from '../../src/components/layout/MobileLayout';

export default function HomeScreen() {
  const handleShowSplash = () => {
    // 개발 모드에서만 스플래시 다시 보기
    if (__DEV__) {
      (global as any).resetSplash?.();
    }
  };

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

        {/* 개발용 스플래시 버튼 */}
        {__DEV__ && (
          <TouchableOpacity style={styles.devSplashButton} onPress={handleShowSplash}>
            <Text style={styles.devSplashButtonText}>스플래시 다시 보기</Text>
          </TouchableOpacity>
        )}
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
  devSplashButton: {
    backgroundColor: '#f0f0f0',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  devSplashButtonText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '500',
  },
});
