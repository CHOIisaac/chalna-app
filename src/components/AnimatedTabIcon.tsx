import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

interface AnimatedTabIconProps {
  name: string;
  focused: boolean;
  color: string;
  size?: number;
}

const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({
  name,
  focused,
  color,
  size = 24,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      // 활성화될 때 더 역동적인 애니메이션
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.3,
          tension: 200,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
      
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }).start();
    } else {
      // 비활성화될 때 부드러운 복원
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 400,
          friction: 12,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused, scaleAnim, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        transform: [
          { scale: scaleAnim },
          { rotate: rotate },
        ],
      }}
    >
      <Ionicons name={name as any} size={size} color={color} />
    </Animated.View>
  );
};

export default AnimatedTabIcon;
