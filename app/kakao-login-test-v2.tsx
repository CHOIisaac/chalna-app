import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import KakaoLoginTestV2 from '../src/components/KakaoLoginTestV2';
import MobileLayout from '../src/components/layout/MobileLayout';

const KakaoLoginTestV2Page: React.FC = () => {
  return (
    <MobileLayout>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <KakaoLoginTestV2 />
        </ScrollView>
      </SafeAreaView>
    </MobileLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
});

export default KakaoLoginTestV2Page;
