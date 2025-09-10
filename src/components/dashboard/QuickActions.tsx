import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../lib/utils';
import { useNavigation } from '@react-navigation/native';

const QuickActions: React.FC = () => {
  const navigation = useNavigation();
  
  const actions = [
    {
      icon: 'add-circle' as keyof typeof Ionicons.glyphMap,
      label: '경조사 추가',
      description: '새로운 행사 등록',
      variant: 'default' as const,
      gradient: true,
      path: 'AddEvent',
    },
    {
      icon: 'calendar' as keyof typeof Ionicons.glyphMap,
      label: '일정 확인',
      description: '예정된 행사 보기',
      variant: 'outline' as const,
      gradient: false,
      path: 'Events',
    },
    {
      icon: 'people' as keyof typeof Ionicons.glyphMap,
      label: '연락처 관리',
      description: '지인 정보 관리',
      variant: 'outline' as const,
      gradient: false,
      path: 'Contacts',
    },
    {
      icon: 'bar-chart' as keyof typeof Ionicons.glyphMap,
      label: '통계 보기',
      description: '내역 분석하기',
      variant: 'outline' as const,
      gradient: false,
      path: 'Stats',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>빠른 작업</Text>
      
      <View style={styles.actionsGrid}>
        {actions.map((action, index) => {
          if (action.gradient) {
            return (
              <TouchableOpacity
                key={index}
                style={styles.actionButton}
                onPress={() => navigation.navigate(action.path as never)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#1A1A1A', '#2A2A2A']}
                  style={styles.gradientButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={action.icon} size={24} color={colors.primaryForeground} />
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionLabel}>{action.label}</Text>
                    <Text style={styles.actionDescription}>{action.description}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={index}
              style={[styles.actionButton, styles.outlineButton]}
              onPress={() => navigation.navigate(action.path as never)}
              activeOpacity={0.8}
            >
              <Ionicons name={action.icon} size={24} color={colors.foreground} />
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionLabel}>{action.label}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  actionTextContainer: {
    alignItems: 'center',
    gap: 4,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    color: colors.mutedForeground,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default QuickActions;
