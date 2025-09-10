import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/utils';
import MobileLayout from '../components/layout/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigation, useRoute } from '@react-navigation/native';

const EventDetail: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as { id: string };

  // Mock data for event detail
  const event = {
    id: parseInt(id),
    title: "김철수 ♥ 이영희 결혼식",
    type: "결혼식",
    date: "2024-08-25",
    time: "12:00",
    location: "롯데호텔 크리스탈볼룸",
    amount: 100000,
    status: "예정",
    attendees: 150,
    notes: "신랑 신부 모두 대학교 동기입니다.",
  };

  return (
    <MobileLayout currentPage="event-detail">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.title}>이벤트 상세</Text>
          <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
            <Ionicons name="pencil" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* 이벤트 정보 */}
        <Card style={styles.eventCard} gradient shadow="soft">
          <CardContent style={styles.eventContent}>
            <View style={styles.eventHeader}>
              <View style={styles.eventIcon}>
                <Ionicons name="heart" size={24} color={colors.accent} />
              </View>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventType}>{event.type}</Text>
                <Text style={styles.eventStatus}>{event.status}</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 상세 정보 */}
        <Card style={styles.detailCard} shadow="soft">
          <CardHeader>
            <CardTitle style={styles.detailTitle}>상세 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.detailItem}>
              <Ionicons name="calendar" size={20} color={colors.mutedForeground} />
              <Text style={styles.detailText}>{event.date}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time" size={20} color={colors.mutedForeground} />
              <Text style={styles.detailText}>{event.time}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="location" size={20} color={colors.mutedForeground} />
              <Text style={styles.detailText}>{event.location}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="people" size={20} color={colors.mutedForeground} />
              <Text style={styles.detailText}>참석자 {event.attendees}명</Text>
            </View>
          </CardContent>
        </Card>

        {/* 경조사 정보 */}
        <Card style={styles.amountCard} shadow="soft">
          <CardHeader>
            <CardTitle style={styles.amountTitle}>경조사 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>경조사 금액</Text>
              <Text style={styles.amountValue}>{event.amount.toLocaleString()}원</Text>
            </View>
            {event.notes && (
              <View style={styles.notesContainer}>
                <Text style={styles.notesLabel}>메모</Text>
                <Text style={styles.notesText}>{event.notes}</Text>
              </View>
            )}
          </CardContent>
        </Card>

        {/* 액션 버튼들 */}
        <View style={styles.actionButtons}>
          <Button
            title="경조사 기록"
            onPress={() => navigation.navigate('Contacts' as never)}
            style={styles.primaryButton}
          />
          <Button
            title="일정 수정"
            onPress={() => {}}
            variant="outline"
            style={styles.secondaryButton}
          />
        </View>
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  eventContent: {
    padding: 20,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  eventIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 4,
  },
  eventType: {
    fontSize: 16,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  eventStatus: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  detailCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 16,
    color: colors.foreground,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  detailText: {
    fontSize: 16,
    color: colors.foreground,
  },
  amountCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  amountTitle: {
    fontSize: 16,
    color: colors.foreground,
  },
  amountContainer: {
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  notesContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  notesLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  notesText: {
    fontSize: 16,
    color: colors.foreground,
    lineHeight: 24,
  },
  actionButtons: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    borderColor: colors.border,
  },
});

export default EventDetail;
