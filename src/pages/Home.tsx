import React, { useState } from 'react';
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import FloatingActionButton from '../components/common/FloatingActionButton';
import QuickStats from '../components/dashboard/QuickStats';
import RecentEvents from '../components/dashboard/RecentEvents';
import WelcomeHeader from '../components/dashboard/WelcomeHeader';
import MobileLayout from '../components/layout/MobileLayout';

const Home: React.FC = () => {
  const [scrollOffset, setScrollOffset] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    setScrollOffset(currentScrollY);
  };

  return (
    <MobileLayout currentPage="home">
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* 헤더 */}
          <WelcomeHeader />

          {/* 통계 카드 */}
          <QuickStats />

          {/* 최근 경조사 */}
          <RecentEvents />
        </ScrollView>

        {/* 플로팅 액션 버튼 - 스크롤을 따라 움직임 */}
        <FloatingActionButton/>
      </View>
    </MobileLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});

export default Home;