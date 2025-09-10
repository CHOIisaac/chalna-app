import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../lib/utils';
import MobileLayout from '../components/layout/MobileLayout';
import { Card, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useNavigation } from '@react-navigation/native';

const Login: React.FC = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = () => {
    // Login logic here
    navigation.navigate('Home' as never);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A1A1A', '#2A2A2A']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* 로고 및 제목 */}
            <View style={styles.header}>
              <View style={styles.logo}>
                <Ionicons name="heart" size={32} color={colors.primaryForeground} />
              </View>
              <Text style={styles.title}>Remember My Moments</Text>
              <Text style={styles.subtitle}>소중한 인연과의 경조사를 기록하세요</Text>
            </View>

            {/* 로그인 폼 */}
            <Card style={styles.loginCard} shadow="strong">
              <CardContent style={styles.loginContent}>
                <Text style={styles.loginTitle}>로그인</Text>
                
                <Input
                  label="이메일"
                  placeholder="이메일을 입력하세요"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                
                <Input
                  label="비밀번호"
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                />

                <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.7}>
                  <Text style={styles.forgotPasswordText}>비밀번호를 잊으셨나요?</Text>
                </TouchableOpacity>

                <Button
                  title="로그인"
                  onPress={handleLogin}
                  style={styles.loginButton}
                />

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>또는</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                  <Ionicons name="logo-google" size={20} color={colors.foreground} />
                  <Text style={styles.socialButtonText}>Google로 계속하기</Text>
                </TouchableOpacity>

                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>계정이 없으신가요? </Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.signupLink}>회원가입</Text>
                  </TouchableOpacity>
                </View>
              </CardContent>
            </Card>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryForeground + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primaryForeground,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.primaryForeground + 'CC',
    textAlign: 'center',
    lineHeight: 24,
  },
  loginCard: {
    backgroundColor: colors.background,
  },
  loginContent: {
    padding: 24,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary,
  },
  loginButton: {
    backgroundColor: colors.primary,
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 14,
    color: colors.mutedForeground,
    paddingHorizontal: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 24,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.foreground,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
});

export default Login;
