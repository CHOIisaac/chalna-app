import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/utils';
import MobileLayout from '../components/layout/MobileLayout';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigation } from '@react-navigation/native';

const NotFound: React.FC = () => {
  const navigation = useNavigation();

  return (
    <MobileLayout currentPage="not-found">
      <View style={styles.container}>
        <View style={styles.content}>
          {/* 404 아이콘 */}
          <View style={styles.iconContainer}>
            <Ionicons name="help-circle-outline" size={80} color={colors.mutedForeground} />
          </View>

          {/* 에러 메시지 */}
          <Text style={styles.title}>페이지를 찾을 수 없습니다</Text>
          <Text style={styles.description}>
            요청하신 페이지가 존재하지 않거나{'\n'}
            이동되었을 수 있습니다.
          </Text>

          {/* 액션 버튼들 */}
          <View style={styles.actions}>
            <Button
              title="홈으로 돌아가기"
              onPress={() => navigation.navigate('Home' as never)}
              style={styles.primaryButton}
            />
            <Button
              title="이전 페이지"
              onPress={() => navigation.goBack()}
              variant="outline"
              style={styles.secondaryButton}
            />
          </View>

          {/* 도움말 카드 */}
          <Card style={styles.helpCard} shadow="soft">
            <CardContent style={styles.helpContent}>
              <View style={styles.helpHeader}>
                <Ionicons name="information-circle" size={20} color={colors.primary} />
                <Text style={styles.helpTitle}>도움이 필요하신가요?</Text>
              </View>
              <Text style={styles.helpText}>
                문제가 지속되면 고객지원팀에 문의해주세요.
              </Text>
              <TouchableOpacity style={styles.helpButton} activeOpacity={0.7}>
                <Text style={styles.helpButtonText}>고객지원 문의하기</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.primary} />
              </TouchableOpacity>
            </CardContent>
          </Card>
        </View>
      </View>
    </MobileLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  actions: {
    width: '100%',
    gap: 12,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    borderColor: colors.border,
  },
  helpCard: {
    width: '100%',
  },
  helpContent: {
    padding: 16,
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  helpText: {
    fontSize: 14,
    color: colors.mutedForeground,
    lineHeight: 20,
    marginBottom: 12,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
});

export default NotFound;
