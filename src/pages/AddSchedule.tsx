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

const AddSchedule: React.FC = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    date: '',
    time: '',
    location: '',
    description: '',
    reminder: false,
  });

  const scheduleTypes = [
    { id: 'wedding', label: '결혼식', icon: 'heart' as keyof typeof Ionicons.glyphMap },
    { id: 'funeral', label: '장례식', icon: 'flower' as keyof typeof Ionicons.glyphMap },
    { id: 'birthday', label: '돌잔치', icon: 'gift' as keyof typeof Ionicons.glyphMap },
    { id: 'opening', label: '개업식', icon: 'storefront' as keyof typeof Ionicons.glyphMap },
    { id: 'anniversary', label: '기념일', icon: 'calendar' as keyof typeof Ionicons.glyphMap },
    { id: 'other', label: '기타', icon: 'ellipsis-horizontal' as keyof typeof Ionicons.glyphMap },
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save schedule logic here
    navigation.goBack();
  };

  return (
    <MobileLayout currentPage="add-schedule">
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
          <Text style={styles.title}>일정 추가</Text>
          <View style={styles.placeholder} />
        </View>

        {/* 일정 타입 선택 */}
        <Card style={styles.sectionCard} shadow="soft">
          <CardHeader>
            <CardTitle style={styles.sectionTitle}>일정 종류</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.typeGrid}>
              {scheduleTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeButton,
                    formData.type === type.id && styles.selectedTypeButton,
                  ]}
                  onPress={() => handleInputChange('type', type.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={type.icon}
                    size={20}
                    color={formData.type === type.id ? colors.primaryForeground : colors.mutedForeground}
                  />
                  <Text
                    style={[
                      styles.typeLabel,
                      formData.type === type.id && styles.selectedTypeLabel,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* 일정 정보 */}
        <Card style={styles.sectionCard} shadow="soft">
          <CardHeader>
            <CardTitle style={styles.sectionTitle}>일정 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              label="일정 제목"
              placeholder="예: 김철수 결혼식"
              value={formData.title}
              onChangeText={(value) => handleInputChange('title', value)}
            />
            
            <Input
              label="날짜"
              placeholder="YYYY-MM-DD"
              value={formData.date}
              onChangeText={(value) => handleInputChange('date', value)}
            />
            
            <Input
              label="시간"
              placeholder="예: 12:00"
              value={formData.time}
              onChangeText={(value) => handleInputChange('time', value)}
            />
            
            <Input
              label="장소"
              placeholder="예: 롯데호텔 크리스탈볼룸"
              value={formData.location}
              onChangeText={(value) => handleInputChange('location', value)}
            />
            
            <Input
              label="설명"
              placeholder="일정에 대한 추가 설명을 입력하세요"
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
              numberOfLines={3}
              style={styles.textArea}
            />
          </CardContent>
        </Card>

        {/* 알림 설정 */}
        <Card style={styles.sectionCard} shadow="soft">
          <CardHeader>
            <CardTitle style={styles.sectionTitle}>알림 설정</CardTitle>
          </CardHeader>
          <CardContent>
            <TouchableOpacity
              style={styles.reminderOption}
              onPress={() => handleInputChange('reminder', !formData.reminder)}
              activeOpacity={0.7}
            >
              <View style={styles.reminderInfo}>
                <Ionicons name="notifications" size={20} color={colors.foreground} />
                <View style={styles.reminderText}>
                  <Text style={styles.reminderTitle}>알림 받기</Text>
                  <Text style={styles.reminderDescription}>일정 1시간 전에 알림을 받습니다</Text>
                </View>
              </View>
              <View style={[
                styles.checkbox,
                formData.reminder && styles.checkedBox,
              ]}>
                {formData.reminder && (
                  <Ionicons name="checkmark" size={16} color={colors.primaryForeground} />
                )}
              </View>
            </TouchableOpacity>
          </CardContent>
        </Card>

        {/* 저장 버튼 */}
        <View style={styles.saveButtonContainer}>
          <Button
            title="일정 저장"
            onPress={handleSave}
            style={styles.saveButton}
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  selectedTypeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.mutedForeground,
    marginTop: 4,
  },
  selectedTypeLabel: {
    color: colors.primaryForeground,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  reminderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  reminderText: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 2,
  },
  reminderDescription: {
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
  saveButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
});

export default AddSchedule;
