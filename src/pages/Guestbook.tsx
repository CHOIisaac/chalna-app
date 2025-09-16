import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MobileLayout from '../components/layout/MobileLayout';
import { Avatar } from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { colors } from '../lib/utils';

const Guestbook: React.FC = () => {
  const navigation = useNavigation();

  // Mock data for guestbook entries
  const entries = [
    {
      id: 1,
      name: "김영희",
      relationship: "친구",
      message: "소중한 시간 함께 해서 정말 기뻤어요! 앞으로도 자주 만나요~",
      date: "2024-08-20",
      likes: 5,
    },
    {
      id: 2,
      name: "박민수",
      relationship: "직장동료",
      message: "항상 따뜻한 마음으로 대해주셔서 감사합니다. 좋은 인연이에요!",
      date: "2024-08-18",
      likes: 3,
    },
    {
      id: 3,
      name: "이수정",
      relationship: "가족",
      message: "가족 같은 마음으로 지내고 있어요. 건강하시고 행복하세요!",
      date: "2024-08-15",
      likes: 8,
    },
  ];

  return (
    <MobileLayout currentPage="guestbook">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.title}>방명록</Text>
          <TouchableOpacity
            style={styles.writeButton}
            onPress={() => navigation.navigate('GuestbookWrite' as never)}
            activeOpacity={0.7}
          >
            <Ionicons name="pencil" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* 방명록 통계 */}
        <Card style={styles.statsCard} gradient shadow="soft">
          <CardContent style={styles.statsContent}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{entries.length}</Text>
                <Text style={styles.statLabel}>총 메시지</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {entries.reduce((sum, entry) => sum + entry.likes, 0)}
                </Text>
                <Text style={styles.statLabel}>총 좋아요</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>이번 주</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 방명록 목록 */}
        <View style={styles.entriesList}>
          {entries.map((entry) => (
            <Card key={entry.id} style={styles.entryCard} shadow="soft">
              <CardContent style={styles.entryContent}>
                <View style={styles.entryHeader}>
                  <Avatar size="md" fallback={entry.name} />
                  <View style={styles.entryInfo}>
                    <Text style={styles.entryName}>{entry.name}</Text>
                    <Text style={styles.entryRelationship}>{entry.relationship}</Text>
                    <Text style={styles.entryDate}>{entry.date}</Text>
                  </View>
                  <TouchableOpacity style={styles.likeButton} activeOpacity={0.7}>
                    <Ionicons name="heart" size={16} color={colors.destructive} />
                    <Text style={styles.likeCount}>{entry.likes}</Text>
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.entryMessage}>{entry.message}</Text>
                
                <View style={styles.entryActions}>
                  <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                    <Ionicons name="heart-outline" size={16} color={colors.mutedForeground} />
                    <Text style={styles.actionText}>좋아요</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                    <Ionicons name="chatbubble-outline" size={16} color={colors.mutedForeground} />
                    <Text style={styles.actionText}>답글</Text>
                  </TouchableOpacity>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>

        {/* 빈 상태 */}
        {entries.length === 0 && (
          <Card style={styles.emptyCard} shadow="soft">
            <CardContent style={styles.emptyContent}>
              <Ionicons name="book-outline" size={48} color={colors.mutedForeground} />
              <Text style={styles.emptyTitle}>아직 방명록이 없어요</Text>
              <Text style={styles.emptyDescription}>
                첫 번째 방명록을 작성해보세요!
              </Text>
              <Button
                title="방명록 작성하기"
                onPress={() => navigation.navigate('GuestbookWrite' as never)}
                style={styles.emptyButton}
              />
            </CardContent>
          </Card>
        )}
      </ScrollView>
    </MobileLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
  },
  writeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  statsContent: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  entriesList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  entryCard: {
    marginBottom: 0,
  },
  entryContent: {
    padding: 16,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  entryInfo: {
    flex: 1,
  },
  entryName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 2,
  },
  entryRelationship: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 2,
  },
  entryDate: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.destructive + '10',
  },
  likeCount: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.destructive,
  },
  entryMessage: {
    fontSize: 16,
    color: colors.foreground,
    lineHeight: 24,
    marginBottom: 12,
  },
  entryActions: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  emptyCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: colors.primary,
  },
});

export default Guestbook;
