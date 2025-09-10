import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows } from '../../lib/utils';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  style,
  textStyle,
  children,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Size styles
    switch (size) {
      case 'sm':
        baseStyle.height = 36;
        baseStyle.paddingHorizontal = 12;
        break;
      case 'lg':
        baseStyle.height = 44;
        baseStyle.paddingHorizontal = 32;
        break;
      case 'icon':
        baseStyle.height = 40;
        baseStyle.width = 40;
        baseStyle.paddingHorizontal = 0;
        break;
      default:
        baseStyle.height = 40;
        baseStyle.paddingHorizontal = 16;
    }

    // Variant styles
    switch (variant) {
      case 'destructive':
        baseStyle.backgroundColor = colors.destructive;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = colors.border;
        break;
      case 'secondary':
        baseStyle.backgroundColor = colors.secondary;
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        break;
      case 'link':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.height = 'auto';
        baseStyle.paddingHorizontal = 0;
        break;
      default:
        baseStyle.backgroundColor = colors.primary;
    }

    if (disabled) {
      baseStyle.opacity = 0.5;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '500',
    };

    // Size styles
    switch (size) {
      case 'sm':
        baseStyle.fontSize = 14;
        break;
      case 'lg':
        baseStyle.fontSize = 16;
        break;
      case 'icon':
        baseStyle.fontSize = 16;
        break;
      default:
        baseStyle.fontSize = 14;
    }

    // Variant styles
    switch (variant) {
      case 'destructive':
        baseStyle.color = colors.destructiveForeground;
        break;
      case 'outline':
        baseStyle.color = colors.foreground;
        break;
      case 'secondary':
        baseStyle.color = colors.secondaryForeground;
        break;
      case 'ghost':
        baseStyle.color = colors.foreground;
        break;
      case 'link':
        baseStyle.color = colors.primary;
        baseStyle.textDecorationLine = 'underline';
        break;
      default:
        baseStyle.color = colors.primaryForeground;
    }

    return baseStyle;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={variant === 'default' ? colors.primaryForeground : colors.foreground}
        />
      );
    }

    if (children) {
      return children;
    }

    return <Text style={[getTextStyle(), textStyle]}>{title}</Text>;
  };

  if (variant === 'default' && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[getButtonStyle(), style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#1A1A1A', '#2A2A2A']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyle(), style]}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default Button;
