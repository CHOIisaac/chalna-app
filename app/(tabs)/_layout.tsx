import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000000', // 활성 탭 아이콘 색상을 검정색으로
        tabBarInactiveTintColor: '#999999', // 비활성 탭 아이콘 색상을 회색으로
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            borderTopWidth: 1,
            borderTopColor: '#f8f9fa',
          },
          default: {
            backgroundColor: '#ffffff', // Android/Web에서 화이트 배경 설정
            borderTopWidth: 1,
            borderTopColor: '#e5e5e5',
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ledgers"
        options={{
          title: '장부',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'book' : 'book-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: '일정',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'calendar' : 'calendar-outline'}
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: '통계',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'bar-chart' : 'bar-chart-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: '더보기',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'menu' : 'menu-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
