import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { colors, shadows } from '../../lib/utils';

const FloatingActionButton: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const handlePress = useCallback(() => {
    // 현재 페이지에 따라 다른 페이지로 이동
    if (route.name === 'events') {
      navigation.navigate('AddSchedule' as never);
    } else {
      navigation.navigate('AddEvent' as never);
    }
  }, [navigation, route.name]);

  // 일정 페이지에서는 다른 색상 사용
  const isEventsPage = route.name === 'events';
  const fabColors: string[] = isEventsPage ? ['#4a5568', '#2d3748'] : ['#1A1A1A', '#2A2A2A'];
  const iconColor: string = isEventsPage ? 'white' : colors.primaryForeground;

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
