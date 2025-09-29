import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors } from '../../lib/utils';
import { QuickStats as QuickStatsType, StatItem } from '../../types';

interface QuickStatsProps {
  quickStats: QuickStatsType | null;
  loading: boolean;
}

const QuickStats: React.FC<QuickStatsProps> = ({ quickStats, loading }) => {
  // 금액 포맷팅 함수
  const formatAmount = (amount: number) => {
    return amount.toLocaleString();
  };

  // 증감률 표시 함수
  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change}%`;
  };

  // 퍼센트 배지 색상 결정 함수
  const getBadgeColor = (change: number) => {
    if (change === 0) {
      return {
        backgroundColor: '#F3F4F6', // 연한 회색
        textColor: '#9CA3AF',
      };
    } else if (change < 0) {
      return {
        backgroundColor: '#FEF3F2', // 연한 주황색 (같은 감도)
        textColor: '#F87171',
      };
    } else {
      return {
        backgroundColor: '#F0FDF4', // 연한 초록색 (같은 감도)
        textColor: '#22C55E',
      };
    }
  };

  // API 데이터를 StatItem 형태로 변환
  const getStatsFromApi = (): StatItem[] => {
    if (!quickStats) return [];
    
    return [
      {
        title: '축의금',
        amount: `${formatAmount(quickStats.wedding_amount)}원`,
        change: formatChange(quickStats.wedding_change),
        changeLabel: '전월 대비',
        trend: quickStats.wedding_change >= 0 ? 'up' : 'down',
        icon: 'trending-up',
        bgColor: '#FFFFFF',
        iconColor: '#666666',
        border: '#e0e0e0',
      },
      {
        title: '조의금',
        amount: `${formatAmount(quickStats.funeral_amount)}원`,
        change: formatChange(quickStats.funeral_change),
        changeLabel: '전월 대비',
        trend: quickStats.funeral_change >= 0 ? 'up' : 'down',
        icon: 'trending-down',
        bgColor: '#FFFFFF',
        iconColor: '#666666',
        border: '#e0e0e0',
      },
      {
        title: '모든 순간',
        amount: `${quickStats.total_events}건`,
        change: `+${quickStats.total_events_change}건`,
        changeLabel: '전월 대비',
        trend: 'up',
        icon: 'calendar-outline',
        bgColor: '#FFFFFF',
        iconColor: '#666666',
        border: '#e0e0e0',
      },
      {
        title: '평균 축의금',
        amount: `${formatAmount(quickStats.avg_wedding_amount)}원`,
        change: formatChange(quickStats.avg_wedding_change),
        changeLabel: '전월 대비',
        trend: quickStats.avg_wedding_change >= 0 ? 'up' : 'down',
        icon: 'analytics',
        bgColor: '#FFFFFF',
        iconColor: '#666666',
        border: '#e0e0e0',
      },
    ];
  };

  const stats = getStatsFromApi();

  const getIconName = (icon: string, changeValue?: number): keyof typeof Ionicons.glyphMap => {
    // 변화량에 따른 아이콘 우선 적용
    if (changeValue !== undefined) {
      if (changeValue > 0) {
        return 'trending-up-outline';
      } else if (changeValue < 0) {
        return 'trending-down';
      } else {
        return 'remove-outline';
      }
    }
    
    // 기본 아이콘 매핑
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
        {!loading && (
          stats.map((stat, index) => {
            // 배지 색상 적용
            let badgeColor = { backgroundColor: colors.success + '20', textColor: colors.success };
            let changeValue = 0;
            
            if (stat.title === '축의금' || stat.title === '조의금' || stat.title === '평균 축의금') {
              // 퍼센트 값 추출 (예: "+5%" -> 5, "-3%" -> -3)
              changeValue = parseFloat(stat.change.replace(/[%]/g, ''));
              badgeColor = getBadgeColor(changeValue);
            } else if (stat.title === '모든 순간') {
              // 건수 변화값 추출 (예: "+5건" -> 5, "-3건" -> -3)
              changeValue = parseFloat(stat.change.replace(/[건]/g, ''));
              badgeColor = getBadgeColor(changeValue);
            }
            
            const IconName = getIconName(stat.icon, changeValue);
            
            return (
              <TouchableOpacity
                key={index}
                style={styles.statCard}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FFFFFF', '#F8F9FA']}
                  style={styles.cardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
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
                            backgroundColor: badgeColor.backgroundColor,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.trendText,
                            {
                              color: badgeColor.textColor,
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
                </LinearGradient>
              </TouchableOpacity>
            );
          })
        )}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardGradient: {
    padding: 20,
    borderRadius: 16,
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