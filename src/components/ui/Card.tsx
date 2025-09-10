import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: boolean;
  shadow?: 'soft' | 'medium' | 'strong' | 'none';
}

interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CardTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  gradient = false,
  shadow = 'soft',
}) => {
  const getShadowStyle = () => {
    switch (shadow) {
      case 'soft':
        return shadows.soft;
      case 'medium':
        return shadows.medium;
      case 'strong':
        return shadows.strong;
      default:
        return {};
    }
  };

  if (gradient) {
    return (
      <LinearGradient
        colors={['#FFFFFF', '#F8F9FA']}
        style={[styles.card, getShadowStyle(), style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.card, getShadowStyle(), style]}>
      {children}
    </View>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ children, style }) => (
  <View style={[styles.cardHeader, style]}>
    {children}
  </View>
);

const CardTitle: React.FC<CardTitleProps> = ({ children, style }) => (
  <Text style={[styles.cardTitle, style]}>
    {children}
  </Text>
);

const CardDescription: React.FC<CardDescriptionProps> = ({ children, style }) => (
  <Text style={[styles.cardDescription, style]}>
    {children}
  </Text>
);

const CardContent: React.FC<CardContentProps> = ({ children, style }) => (
  <View style={[styles.cardContent, style]}>
    {children}
  </View>
);

const CardFooter: React.FC<CardFooterProps> = ({ children, style }) => (
  <View style={[styles.cardFooter, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'column',
    gap: 6,
    padding: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    color: colors.cardForeground,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  cardContent: {
    padding: 24,
    paddingTop: 0,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 0,
  },
});

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
