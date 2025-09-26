import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationTest from '../src/components/NotificationTest';
import MobileLayout from '../src/components/layout/MobileLayout';

const NotificationTestPage: React.FC = () => {
  return (
    <MobileLayout>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <NotificationTest />
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

export default NotificationTestPage;
