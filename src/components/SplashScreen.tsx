import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';


interface SplashScreenProps {
  onAnimationFinish: () => void;
  isDevMode?: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationFinish, isDevMode = false }) => {
  // 토스 스타일 애니메이션
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoOpacityAnim = useRef(new Animated.Value(0)).current;
  const textOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 토스와 완전히 동일한 애니메이션
    const startTossAnimation = () => {
      // 즉시 로고와 텍스트 표시 (토스는 매우 빠름)
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();

      // 로고 애니메이션 (토스는 거의 즉시 나타남)
      Animated.timing(logoOpacityAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();

      // 텍스트 애니메이션 (로고와 거의 동시)
      setTimeout(() => {
        Animated.timing(textOpacityAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start();
      }, 100);

      // 토스는 매우 빠르게 전환 (800ms)
      if (!isDevMode) {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }).start(() => {
            onAnimationFinish();
          });
        }, 800);
      }
    };

    startTossAnimation();
  }, [fadeAnim, scaleAnim, logoOpacityAnim, textOpacityAnim, onAnimationFinish, isDevMode]);


  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* 토스 스타일 배경 */}
      <View style={styles.tossBackground}>
        {/* 토스 스타일 로고 */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.tossLogo}>
            <Text style={styles.tossLogoText}>찰나</Text>
          </View>
        </Animated.View>

        {/* 토스 스타일 텍스트 */}
        <Animated.View
          style={[
            styles.textContainer,
            { opacity: textOpacityAnim },
          ]}
        >
          <Text style={styles.tossSubtitle}>마음을 나누는 순간</Text>
        </Animated.View>

        {/* 개발 모드일 때 수동 전환 버튼 */}
        {isDevMode && (
          <View style={styles.devButtonContainer}>
            <TouchableOpacity
              style={styles.tossDevButton}
              onPress={onAnimationFinish}
            >
              <Text style={styles.tossDevButtonText}>메인 화면으로</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tossBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  tossLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0064FF', // 토스의 정확한 파란색
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0064FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  tossLogoText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
    letterSpacing: 1,
  },
  textContainer: {
    alignItems: 'center',
  },
  tossSubtitle: {
    fontSize: 24,
    fontWeight: '400',
    color: '#191F28', // 토스의 정확한 텍스트 색상
    fontFamily: 'System',
    letterSpacing: -0.5,
    textAlign: 'center',
    lineHeight: 32,
  },
  devButtonContainer: {
    position: 'absolute',
    top: 60,
    right: 24,
  },
  tossDevButton: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  tossDevButtonText: {
    color: '#6C757D',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default SplashScreen;
