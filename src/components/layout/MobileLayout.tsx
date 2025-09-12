import React from 'react';
import {
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  currentPage = 'home' 
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* 메인 콘텐츠 */}
      <View style={styles.content}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    maxWidth: 448, // 모바일 최대 너비 (기존 웹 프로젝트와 동일)
    alignSelf: 'center',
    width: '100%',
  },
  content: {
    flex: 1,
    paddingBottom: 40, // 하단 네비게이션 공간 확보
  },
});

export default MobileLayout;
