import React from 'react';
import {
    Image,
    ImageSourcePropType,
    ImageStyle,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';
import { colors } from '../../lib/utils';

interface AvatarProps {
  src?: ImageSourcePropType;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallback,
  size = 'md',
  style,
}) => {
  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          width: 32,
          height: 32,
          borderRadius: 16,
        };
      case 'lg':
        return {
          width: 64,
          height: 64,
          borderRadius: 32,
        };
      case 'xl':
        return {
          width: 80,
          height: 80,
          borderRadius: 40,
        };
      default:
        return {
          width: 48,
          height: 48,
          borderRadius: 24,
        };
    }
  };

  const getImageStyles = (): ImageStyle => {
    switch (size) {
      case 'sm':
        return {
          width: 32,
          height: 32,
          borderRadius: 16,
        };
      case 'lg':
        return {
          width: 64,
          height: 64,
          borderRadius: 32,
        };
      case 'xl':
        return {
          width: 80,
          height: 80,
          borderRadius: 40,
        };
      default:
        return {
          width: 48,
          height: 48,
          borderRadius: 24,
        };
    }
  };

  const getTextSize = (): number => {
    switch (size) {
      case 'sm':
        return 12;
      case 'lg':
        return 24;
      case 'xl':
        return 32;
      default:
        return 18;
    }
  };

  const sizeStyles = getSizeStyles();
  const imageStyles = getImageStyles();
  const textSize = getTextSize();

  return (
    <View style={[styles.avatar, sizeStyles, style]}>
      {src ? (
        <Image source={src} style={imageStyles} />
      ) : (
        <Text style={[styles.fallback, { fontSize: textSize }]}>
          {fallback || alt?.charAt(0) || '?'}
        </Text>
      )}
    </View>
  );
};

const AvatarFallback: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children,
  style,
}) => (
  <View style={[styles.fallbackContainer, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fallbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    fontWeight: '600',
    color: colors.mutedForeground,
  },
});

export { Avatar, AvatarFallback };
