import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { shadows } from '../../lib/utils';

const FloatingActionButton: React.FC = () => {
  const router = useRouter();

  const handlePress = useCallback(() => {
    // 장부 페이지에서 장부 추가 페이지로 이동
    router.push('/add-ledger');
  }, [router]);

  // 장부 추가용 색상
  const fabColors: string[] = ['black', '#2d3748'];
  const iconColor: string = 'white';

  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={fabColors}
        style={styles.fabGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name="add" size={24} color={iconColor} />
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
