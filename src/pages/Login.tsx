import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Card, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import { colors } from '../lib/utils';
import { authService, handleApiError } from '../services/api';

const Login: React.FC = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    if (!formData.username || !formData.password) {
      Alert.alert('입력 오류', '이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login(formData.username, formData.password);
      
      if (response.success) {
        Alert.alert('로그인 성공', '환영합니다!', [
          {
            text: '확인',
            onPress: () => navigation.navigate('Home' as never),
          },
        ]);
      } else {
        Alert.alert('로그인 실패', response.error || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      Alert.alert('로그인 실패', handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    try {
      setLoading(true);
      // 카카오 SDK 로그인은 나중에 구현
      Alert.alert('카카오 로그인', '카카오 로그인은 준비 중입니다.');
    } catch (error) {
      console.error('카카오 로그인 오류:', error);
      Alert.alert('로그인 실패', '카카오 로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
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
                  value={formData.username}
                  onChangeText={(value) => handleInputChange('username', value)}
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

                <TouchableOpacity
                  onPress={handleLogin}
                  style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="white" />
                      <Text style={styles.loginButtonText}>로그인 중...</Text>
                    </View>
                  ) : (
                    <Text style={styles.loginButtonText}>로그인</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>또는</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity 
                  style={[styles.socialButton, loading && styles.socialButtonDisabled]} 
                  activeOpacity={0.7}
                  onPress={handleKakaoLogin}
                  disabled={loading}
                >
                  <Ionicons name="chatbubble" size={20} color={colors.foreground} />
                  <Text style={styles.socialButtonText}>카카오로 계속하기</Text>
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
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: '#999',
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  socialButtonDisabled: {
    opacity: 0.5,
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
