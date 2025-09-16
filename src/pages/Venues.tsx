import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MobileLayout from '../components/layout/MobileLayout';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { colors } from '../lib/utils';

const Venues: React.FC = () => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: '전체', icon: 'grid' as keyof typeof Ionicons.glyphMap },
    { id: 'wedding', label: '웨딩홀', icon: 'heart' as keyof typeof Ionicons.glyphMap },
    { id: 'funeral', label: '장례식장', icon: 'flower' as keyof typeof Ionicons.glyphMap },
    { id: 'banquet', label: '연회장', icon: 'restaurant' as keyof typeof Ionicons.glyphMap },
    { id: 'convention', label: '컨벤션', icon: 'business' as keyof typeof Ionicons.glyphMap },
  ];

  const venues = [
    {
      id: 1,
      name: "롯데호텔 크리스탈볼룸",
      category: "wedding",
      location: "강남구",
      rating: 4.8,
      price: "200만원~",
      image: null,
      phone: "02-1234-5678",
      description: "럭셔리한 웨딩홀",
    },
    {
      id: 2,
      name: "서울추모공원",
      category: "funeral",
      location: "송파구",
      rating: 4.5,
      price: "50만원~",
      image: null,
      phone: "02-2345-6789",
      description: "24시간 운영 장례식장",
    },
    {
      id: 3,
      name: "강남구청 웨딩홀",
      category: "wedding",
      location: "강남구",
      rating: 4.3,
      price: "150만원~",
      image: null,
      phone: "02-3456-7890",
      description: "합리적인 가격의 웨딩홀",
    },
    {
      id: 4,
      name: "용산구 컨벤션센터",
      category: "convention",
      location: "용산구",
      rating: 4.6,
      price: "100만원~",
      image: null,
      phone: "02-4567-8901",
      description: "대규모 컨벤션 센터",
    },
  ];

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || venue.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
    switch (category) {
      case 'wedding': return 'heart';
      case 'funeral': return 'flower';
      case 'banquet': return 'restaurant';
      case 'convention': return 'business';
      default: return 'location';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'wedding': return colors.accent;
      case 'funeral': return colors.mutedForeground;
      case 'banquet': return colors.primary;
      case 'convention': return colors.success;
      default: return colors.secondaryForeground;
    }
  };

  return (
    <MobileLayout currentPage="venues">
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
          <Text style={styles.title}>업체 정보</Text>
          <View style={styles.placeholder} />
        </View>

        {/* 검색 */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={colors.mutedForeground} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="업체명이나 지역으로 검색..."
              placeholderTextColor={colors.mutedForeground}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
        </View>

        {/* 카테고리 필터 */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoriesList}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.selectedCategoryButton,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={category.icon}
                    size={16}
                    color={selectedCategory === category.id ? colors.primaryForeground : colors.mutedForeground}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category.id && styles.selectedCategoryText,
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 업체 목록 */}
        <View style={styles.venuesList}>
          {filteredVenues.map((venue) => {
            const categoryIcon = getCategoryIcon(venue.category);
            const categoryColor = getCategoryColor(venue.category);
            
            return (
              <Card key={venue.id} style={styles.venueCard} shadow="soft">
                <CardContent style={styles.venueContent}>
                  <View style={styles.venueHeader}>
                    <View style={[styles.venueIcon, { backgroundColor: categoryColor + '20' }]}>
                      <Ionicons name={categoryIcon} size={20} color={categoryColor} />
                    </View>
                    <View style={styles.venueInfo}>
                      <Text style={styles.venueName}>{venue.name}</Text>
                      <Text style={styles.venueLocation}>{venue.location}</Text>
                      <Text style={styles.venueDescription}>{venue.description}</Text>
                    </View>
                    <View style={styles.venueRating}>
                      <Ionicons name="star" size={16} color={colors.warning} />
                      <Text style={styles.ratingText}>{venue.rating}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.venueDetails}>
                    <View style={styles.venueDetail}>
                      <Ionicons name="call" size={16} color={colors.mutedForeground} />
                      <Text style={styles.detailText}>{venue.phone}</Text>
                    </View>
                    <View style={styles.venueDetail}>
                      <Ionicons name="cash" size={16} color={colors.mutedForeground} />
                      <Text style={styles.detailText}>{venue.price}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.venueActions}>
                    <Button
                      title="전화하기"
                      onPress={() => {}}
                      variant="outline"
                      size="sm"
                      style={styles.actionButton}
                    />
                    <Button
                      title="상세보기"
                      onPress={() => {}}
                      size="sm"
                      style={styles.actionButton}
                    />
                  </View>
                </CardContent>
              </Card>
            );
          })}
        </View>

        {/* 빈 상태 */}
        {filteredVenues.length === 0 && (
          <Card style={styles.emptyCard} shadow="soft">
            <CardContent style={styles.emptyContent}>
              <Ionicons name="search" size={48} color={colors.mutedForeground} />
              <Text style={styles.emptyTitle}>검색 결과가 없습니다</Text>
              <Text style={styles.emptyDescription}>
                다른 검색어나 카테고리를 시도해보세요
              </Text>
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
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.input,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.foreground,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  selectedCategoryButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  selectedCategoryText: {
    color: colors.primaryForeground,
  },
  venuesList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  venueCard: {
    marginBottom: 0,
  },
  venueContent: {
    padding: 16,
  },
  venueHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  venueIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  venueInfo: {
    flex: 1,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 2,
  },
  venueLocation: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  venueDescription: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  venueRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
  venueDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  venueDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  venueActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
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
  },
});

export default Venues;
