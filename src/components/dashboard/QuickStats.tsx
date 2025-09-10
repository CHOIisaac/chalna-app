import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors } from '../../lib/utils';
import { StatItem } from '../../types';

const QuickStats: React.FC = () => {
  const stats: StatItem[] = [
    {
      title: '축의금',
      amount: '850,000원',
      change: '+12%',
      changeLabel: '전월 대비',
      trend: 'up',
      icon: 'trending-up',
      bgColor: '#f1f8e9',
      iconColor: '#4caf50',
      border: '#dcedc8',
    },
    {
      title: '조의금',
      amount: '320,000원',
      change: '-5%',
      changeLabel: '전월 대비',
      trend: 'down',
      icon: 'trending-down',
      bgColor: '#fff8e1',
      iconColor: '#ff9800',
      border: '#ffecb3',
    },
    {
      title: '연간 총 경조사',
      amount: '24건',
      change: '+3건',
      changeLabel: '작년 대비',
      trend: 'up',
      icon: 'calendar-outline',
      bgColor: '#f5f5f5',
      iconColor: '#666666',
      border: '#e0e0e0',
    },
    {
      title: '평균 축의금',
      amount: '85,000원',
      change: '+5%',
      changeLabel: '전월 대비',
      trend: 'up',
      icon: 'analytics',
      bgColor: '#f3f8ff',
      iconColor: '#1976d2',
      border: '#e1ecf7',
    },
  ];

  const getIconName = (icon: string): keyof typeof Ionicons.glyphMap => {
    switch (icon) {
      case 'trending-up':
        return 'trending-up';
      case 'trending-down':
        return 'trending-down';
      case 'calendar':
        return 'calendar';
      case 'calendar-outline':
        return 'calendar-outline';
      case 'people':
        return 'people';
      case 'wallet':
        return 'wallet';
      case 'analytics':
        return 'analytics';
      default:
        return 'help';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {stats.map((stat, index) => {
          const IconName = getIconName(stat.icon);
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.statCard,
                {
                  backgroundColor: stat.bgColor,
                  borderColor: stat.border,
                },
              ]}
              activeOpacity={0.8}
            >
              <View style={styles.statHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name={IconName} size={16} color={stat.iconColor} />
                </View>
                {stat.trend !== 'neutral' && (
                  <View
                    style={[
                      styles.trendBadge,
                      {
                        backgroundColor: stat.trend === 'up' 
                          ? colors.success + '20' 
                          : colors.warning + '20',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.trendText,
                        {
                          color: stat.trend === 'up' ? colors.success : colors.warning,
                        },
                      ]}
                    >
                      {stat.change}
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.statContent}>
                <Text style={styles.statAmount}>{stat.amount}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
                {stat.trend === 'neutral' ? (
                  <Text style={styles.statDescription}>
                    {stat.change} {stat.changeLabel}
                  </Text>
                ) : (
                  <Text style={styles.statDescription}>{stat.changeLabel}</Text>
                )}
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
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statContent: {
    gap: 6,
    alignItems: 'center',
  },
  statAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.foreground,
    letterSpacing: -0.5,
    textAlign: 'center',
    lineHeight: 22,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 16,
  },
  statDescription: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default QuickStats;
