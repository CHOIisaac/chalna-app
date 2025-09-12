import { StyleSheet, View } from 'react-native';

// Android와 Web에서 사용할 배경 컴포넌트
export default function TabBarBackground() {
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#ffffff' }]} />
  );
}

export function useBottomTabOverflow() {
  return 0;
}
