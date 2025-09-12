import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePathname, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { shadows } from '../../lib/utils';

const FloatingActionButton: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handlePress = useCallback(() => {
    // 현재 페이지에 따라 다른 동작
    if (pathname.includes('/ledgers')) {
      router.push('/add-ledger');
    } else if (pathname.includes('/schedules')) {
      router.push('/add-event');
    }
  }, [router, pathname]);

  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['black', '#2d3748']}
        style={styles.fabGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name="add" size={24} color="white" />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 100, // 하단 탭 위에 고정 위치
    width: 48,
    height: 48,
    borderRadius: 24,
    ...shadows.strong,
  },
  fabGradient: {
    flex: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FloatingActionButton;
