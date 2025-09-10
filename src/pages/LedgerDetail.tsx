import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../lib/utils';
import MobileLayout from '../components/layout/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { useNavigation, useRoute } from '@react-navigation/native';

const LedgerDetail: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as { id: string };

  // Mock data for contact detail
  const contact = {
    id: parseInt(id),
    name: "김철수",
    relationship: "친구",
    phone: "010-1234-5678",
    email: "kimcs@email.com",
    totalGiven: 250000,
    totalReceived: 180000,
    balance: 70000,
    lastEvent: "2024-03-15",
    eventCount: 5,
    events: [
      {
        id: 1,
        type: "결혼식",
        title: "김철수 결혼식",
        date: "2024-03-15",
        amount: 100000,
        status: "완료",
      },
      {
        id: 2,
        type: "돌잔치",
        title: "김철수 아들 돌잔치",
        date: "2023-08-20",
        amount: 50000,
        status: "완료",
      },
      {
        id: 3,
        type: "장례식",
        title: "김철수 어머님 장례식",
        date: "2023-05-10",
        amount: 100000,
        status: "완료",
      },
    ],
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case '결혼식': return colors.accent;
      case '장례식': return colors.mutedForeground;
      case '돌잔치': return colors.primary;
      default: return colors.secondaryForeground;
    }
  };

  const getEventTypeIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case '결혼식': return 'heart';
      case '장례식': return 'flower';
      case '돌잔치': return 'gift';
      default: return 'calendar';
    }
  };

  return (
    <MobileLayout currentPage="contact-detail">
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
          <Text style={styles.title}>연락처 상세</Text>
          <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
            <Ionicons name="pencil" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* 연락처 정보 */}
        <Card style={styles.contactCard} gradient shadow="soft">
          <CardContent style={styles.contactContent}>
            <View style={styles.contactHeader}>
              <Avatar size="xl" fallback={contact.name} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRelationship}>{contact.relationship}</Text>
                <View style={styles.contactStats}>
                  <Text style={styles.statText}>경조사 {contact.eventCount}회</Text>
                  <Text style={styles.statText}>•</Text>
                  <Text style={styles.statText}>최근: {contact.lastEvent}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.contactActions}>
              <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                <Ionicons name="call" size={20} color={colors.primary} />
                <Text style={styles.actionText}>전화</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                <Ionicons name="mail" size={20} color={colors.primary} />
                <Text style={styles.actionText}>이메일</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                <Ionicons name="chatbubble" size={20} color={colors.primary} />
                <Text style={styles.actionText}>메시지</Text>
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>

        {/* 경조사 요약 */}
        <Card style={styles.summaryCard} shadow="soft">
          <CardHeader>
            <CardTitle style={styles.summaryTitle}>경조사 요약</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{contact.totalGiven.toLocaleString()}원</Text>
                <Text style={styles.summaryLabel}>준 금액</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{contact.totalReceived.toLocaleString()}원</Text>
                <Text style={styles.summaryLabel}>받은 금액</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.destructive }]}>
                  {contact.balance.toLocaleString()}원
                </Text>
                <Text style={styles.summaryLabel}>차액</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 연락처 정보 */}
        <Card style={styles.infoCard} shadow="soft">
          <CardHeader>
            <CardTitle style={styles.infoTitle}>연락처 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.infoItem}>
              <Ionicons name="call" size={20} color={colors.mutedForeground} />
              <Text style={styles.infoText}>{contact.phone}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="mail" size={20} color={colors.mutedForeground} />
              <Text style={styles.infoText}>{contact.email}</Text>
            </View>
          </CardContent>
        </Card>

        {/* 경조사 내역 */}
        <Card style={styles.eventsCard} shadow="soft">
          <CardHeader>
            <CardTitle style={styles.eventsTitle}>경조사 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.eventsList}>
              {contact.events.map((event) => {
                const typeColor = getEventTypeColor(event.type);
                const typeIcon = getEventTypeIcon(event.type);
                
                return (
                  <View key={event.id} style={styles.eventItem}>
                    <View style={styles.eventIcon}>
                      <Ionicons name={typeIcon} size={20} color={typeColor} />
                    </View>
                    <View style={styles.eventInfo}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <Text style={styles.eventDate}>{event.date}</Text>
                    </View>
                    <View style={styles.eventAmount}>
                      <Text style={styles.amountText}>{event.amount.toLocaleString()}원</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </CardContent>
        </Card>

        {/* 액션 버튼들 */}
        <View style={styles.actionButtons}>
          <Button
            title="새 경조사 추가"
            onPress={() => navigation.navigate('AddEvent' as never)}
            style={styles.primaryButton}
          />
          <Button
            title="연락처 수정"
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
  contactCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  contactContent: {
    padding: 20,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 4,
  },
  contactRelationship: {
    fontSize: 16,
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  contactStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.primary + '10',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
    marginTop: 4,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    color: colors.foreground,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    color: colors.foreground,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 16,
    color: colors.foreground,
  },
  eventsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  eventsTitle: {
    fontSize: 16,
    color: colors.foreground,
  },
  eventsList: {
    gap: 12,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 2,
  },
  eventDate: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  eventAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.foreground,
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

export default LedgerDetail;
