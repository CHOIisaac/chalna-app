import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';

export default function BlurTabBarBackground() {
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#f8f9fa' }]} />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
