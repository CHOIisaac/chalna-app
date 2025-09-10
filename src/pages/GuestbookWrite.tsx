import React, { useState } from 'react';
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
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useNavigation } from '@react-navigation/native';

const GuestbookWrite: React.FC = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    message: '',
    isAnonymous: false,
  });

  const relationships = [
    '가족', '친구', '직장동료', '지인', '이웃', '기타'
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save guestbook entry logic here
    navigation.goBack();
  };

  return (
    <MobileLayout currentPage="guestbook-write">
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
          <Text style={styles.title}>방명록 작성</Text>
          <View style={styles.placeholder} />
        </View>

        {/* 작성자 정보 */}
        <Card style={styles.sectionCard} shadow="soft">
          <CardHeader>
            <CardTitle style={styles.sectionTitle}>작성자 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              label="이름"
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
            
            <View style={styles.relationshipContainer}>
              <Text style={styles.relationshipLabel}>관계</Text>
              <View style={styles.relationshipGrid}>
                {relationships.map((relationship) => (
                  <TouchableOpacity
                    key={relationship}
                    style={[
                      styles.relationshipButton,
                      formData.relationship === relationship && styles.selectedRelationshipButton,
                    ]}
                    onPress={() => handleInputChange('relationship', relationship)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.relationshipText,
                        formData.relationship === relationship && styles.selectedRelationshipText,
                      ]}
                    >
                      {relationship}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.anonymousOption}
              onPress={() => handleInputChange('isAnonymous', !formData.isAnonymous)}
              activeOpacity={0.7}
            >
              <View style={styles.anonymousInfo}>
                <Ionicons name="eye-off" size={20} color={colors.foreground} />
                <View style={styles.anonymousText}>
                  <Text style={styles.anonymousTitle}>익명으로 작성</Text>
                  <Text style={styles.anonymousDescription}>이름과 관계가 숨겨집니다</Text>
                </View>
              </View>
              <View style={[
                styles.checkbox,
                formData.isAnonymous && styles.checkedBox,
              ]}>
                {formData.isAnonymous && (
                  <Ionicons name="checkmark" size={16} color={colors.primaryForeground} />
                )}
              </View>
            </TouchableOpacity>
          </CardContent>
        </Card>

        {/* 메시지 작성 */}
        <Card style={styles.sectionCard} shadow="soft">
          <CardHeader>
            <CardTitle style={styles.sectionTitle}>메시지</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              label="방명록 메시지"
              placeholder="소중한 마음을 전해주세요..."
              value={formData.message}
              onChangeText={(value) => handleInputChange('message', value)}
              multiline
              numberOfLines={6}
              style={styles.messageInput}
            />
            <Text style={styles.characterCount}>
              {formData.message.length}/500자
            </Text>
          </CardContent>
        </Card>

        {/* 작성 가이드 */}
        <Card style={styles.guideCard} shadow="soft">
          <CardContent style={styles.guideContent}>
            <View style={styles.guideHeader}>
              <Ionicons name="information-circle" size={20} color={colors.primary} />
              <Text style={styles.guideTitle}>작성 가이드</Text>
            </View>
            <Text style={styles.guideText}>
              • 따뜻하고 긍정적인 메시지를 작성해주세요{'\n'}
              • 개인정보나 민감한 내용은 피해주세요{'\n'}
              • 500자 이내로 작성해주세요
            </Text>
          </CardContent>
        </Card>

        {/* 저장 버튼 */}
        <View style={styles.saveButtonContainer}>
          <Button
            title="방명록 등록"
            onPress={handleSave}
            style={styles.saveButton}
            disabled={!formData.message.trim()}
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
  placeholder: {
    width: 40,
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: colors.foreground,
  },
  relationshipContainer: {
    marginBottom: 16,
  },
  relationshipLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 8,
  },
  relationshipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  relationshipButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  selectedRelationshipButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  relationshipText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  selectedRelationshipText: {
    color: colors.primaryForeground,
  },
  anonymousOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  anonymousInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  anonymousText: {
    flex: 1,
  },
  anonymousTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 2,
  },
  anonymousDescription: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: colors.mutedForeground,
    textAlign: 'right',
    marginTop: 4,
  },
  guideCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  guideContent: {
    padding: 16,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  guideText: {
    fontSize: 14,
    color: colors.mutedForeground,
    lineHeight: 20,
  },
  saveButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
});

export default GuestbookWrite;
