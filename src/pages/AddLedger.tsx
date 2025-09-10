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

const AddLedger: React.FC = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    date: '',
    time: '',
    location: '',
    amount: '',
    notes: '',
  });

  const eventTypes = [
    { id: 'wedding', label: '결혼식', icon: 'heart' as keyof typeof Ionicons.glyphMap },
    { id: 'funeral', label: '장례식', icon: 'flower' as keyof typeof Ionicons.glyphMap },
    { id: 'birthday', label: '돌잔치', icon: 'gift' as keyof typeof Ionicons.glyphMap },
    { id: 'opening', label: '개업식', icon: 'storefront' as keyof typeof Ionicons.glyphMap },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save event logic here
    navigation.goBack();
  };

  return (
    <MobileLayout currentPage="add">
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
          <Text style={styles.title}>경조사 추가</Text>
          <View style={styles.placeholder} />
        </View>

        {/* 이벤트 타입 선택 */}
        <Card style={styles.sectionCard} shadow="soft">
          <CardHeader>
            <CardTitle style={styles.sectionTitle}>이벤트 종류</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.typeGrid}>
              {eventTypes.map((type) => (
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
                    size={24}
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

        {/* 기본 정보 */}
        <Card style={styles.sectionCard} shadow="soft">
          <CardHeader>
            <CardTitle style={styles.sectionTitle}>기본 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              label="이벤트 제목"
              placeholder="예: 김철수 ♥ 이영희 결혼식"
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
          </CardContent>
        </Card>

        {/* 경조사 정보 */}
        <Card style={styles.sectionCard} shadow="soft">
          <CardHeader>
            <CardTitle style={styles.sectionTitle}>경조사 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              label="경조사 금액"
              placeholder="예: 100000"
              value={formData.amount}
              onChangeText={(value) => handleInputChange('amount', value)}
              keyboardType="numeric"
            />
            
            <Input
              label="메모"
              placeholder="추가 정보나 메모를 입력하세요"
              value={formData.notes}
              onChangeText={(value) => handleInputChange('notes', value)}
              multiline
              numberOfLines={3}
              style={styles.textArea}
            />
          </CardContent>
        </Card>

        {/* 저장 버튼 */}
        <View style={styles.saveButtonContainer}>
          <Button
            title="경조사 저장"
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
    gap: 12,
  },
  typeButton: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  selectedTypeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.mutedForeground,
    marginTop: 8,
  },
  selectedTypeLabel: {
    color: colors.primaryForeground,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
});

export default AddLedger;
