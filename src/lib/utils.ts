import { StyleSheet } from 'react-native';

// 기존 웹 프로젝트의 cn 함수를 React Native용으로 변환
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

// 스타일 유틸리티 함수들
export const createStyles = (styles: any) => StyleSheet.create(styles);

// 색상 상수들 (기존 웹 프로젝트의 CSS 변수들을 React Native용으로 변환)
export const colors = {
  // Light mode colors
  background: '#f8f9fa',
  foreground: '#1A1A1A',
  card: '#FFFFFF',
  cardForeground: '#1A1A1A',
  popover: '#FFFFFF',
  popoverForeground: '#1A1A1A',
  primary: '#1A1A1A',
  primaryForeground: '#FAFAFA',
  secondary: '#F5F5F5',
  secondaryForeground: '#1A1A1A',
  muted: '#F5F5F5',
  mutedForeground: '#737373',
  accent: '#F5F5F5',
  accentForeground: '#1A1A1A',
  success: '#22C55E',
  successForeground: '#FFFFFF',
  warning: '#F59E0B',
  warningForeground: '#FFFFFF',
  destructive: '#1a1a1a',
  destructiveForeground: '#FFFFFF',
  border: '#E5E5E5',
  input: '#F5F5F5',
  ring: '#1A1A1A',
};

// 다크 모드 색상들
export const darkColors = {
  background: '#0A0A0A',
  foreground: '#FAFAFA',
  card: '#111111',
  cardForeground: '#FAFAFA',
  popover: '#111111',
  popoverForeground: '#FAFAFA',
  primary: '#FAFAFA',
  primaryForeground: '#0A0A0A',
  secondary: '#1F1F1F',
  secondaryForeground: '#FAFAFA',
  muted: '#1A1A1A',
  mutedForeground: '#A3A3A3',
  accent: '#1F1F1F',
  accentForeground: '#FAFAFA',
  success: '#4ADE80',
  successForeground: '#0A0A0A',
  warning: '#FBBF24',
  warningForeground: '#0A0A0A',
  destructive: '#F87171',
  destructiveForeground: '#0A0A0A',
  border: '#262626',
  input: '#1A1A1A',
  ring: '#FAFAFA',
};

// 그라디언트 색상들
export const gradients = {
  primary: ['#1A1A1A', '#2A2A2A'],
  secondary: ['#F5F5F5', '#E5E5E5'],
  success: ['#22C55E', '#16A34A'],
  warning: ['#F59E0B', '#D97706'],
  destructive: ['#EF4444', '#DC2626'],
};

// 그림자 스타일들
export const shadows = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 20,
    elevation: 8,
  },
};
