import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
}) => {
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'secondary':
        return {
          container: {
            backgroundColor: colors.secondary,
          },
          text: {
            color: colors.secondaryForeground,
          },
        };
      case 'destructive':
        return {
          container: {
            backgroundColor: colors.destructive,
          },
          text: {
            color: colors.destructiveForeground,
          },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colors.border,
          },
          text: {
            color: colors.foreground,
          },
        };
      default:
        return {
          container: {
            backgroundColor: colors.primary,
          },
          text: {
            color: colors.primaryForeground,
          },
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 8,
          },
          text: {
            fontSize: 10,
            fontWeight: '500',
          },
        };
      case 'lg':
        return {
          container: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          },
          text: {
            fontSize: 14,
            fontWeight: '600',
          },
        };
      default:
        return {
          container: {
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 10,
          },
          text: {
            fontSize: 12,
            fontWeight: '500',
          },
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.badge,
        variantStyles.container,
        sizeStyles.container,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          variantStyles.text,
          sizeStyles.text,
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});

export default Badge;
