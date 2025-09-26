# 카카오 로그인 설정 가이드

## 1. 카카오 개발자 계정 생성

1. [카카오 개발자 사이트](https://developers.kakao.com/) 접속
2. 카카오 계정으로 로그인
3. 개발자 등록 완료

## 2. 애플리케이션 등록

### 2.1 애플리케이션 생성
1. **내 애플리케이션** → **애플리케이션 추가하기**
2. **앱 이름**: "찰나" 또는 원하는 이름
3. **카테고리**: "기타" 선택
4. **저장** 클릭

### 2.2 앱 키 확인
1. **앱 설정** → **앱 키**에서 확인:
   - **JavaScript 키**: 웹용 (사용 안함)
   - **REST API 키**: 서버용 (사용 안함)
   - **네이티브 앱 키**: 모바일용 (사용 안함)

## 3. 플랫폼 설정

### 3.1 Web 플랫폼 등록
1. **앱 설정** → **플랫폼** → **Web 플랫폼 등록**
2. **사이트 도메인**: `https://yourdomain.com` (임시)
3. **Redirect URI**: `chalna://auth/kakao/callback`

### 3.2 Android 플랫폼 등록 (선택사항)
1. **앱 설정** → **플랫폼** → **Android 플랫폼 등록**
2. **패키지명**: `com.anonymous.chalna`
3. **키 해시**: 개발용 키 해시 등록
   ```bash
   keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
   ```

### 3.3 iOS 플랫폼 등록 (선택사항)
1. **앱 설정** → **플랫폼** → **iOS 플랫폼 등록**
2. **번들 ID**: `com.anonymous.chalna`

## 4. 카카오 로그인 활성화

1. **제품 설정** → **카카오 로그인** → **활성화 설정**
2. **카카오 로그인 활성화** 체크
3. **Redirect URI**: `chalna://auth/kakao/callback`
4. **동의항목** 설정:
   - **닉네임**: 필수
   - **이메일**: 선택

## 5. 코드 설정

### 5.1 REST API 키 설정
`src/services/kakaoAuth.ts` 파일에서 `YOUR_KAKAO_REST_API_KEY`를 실제 REST API 키로 교체:

```typescript
const KAKAO_CONFIG = {
  clientId: 'YOUR_ACTUAL_REST_API_KEY_HERE', // 여기에 실제 키 입력
  // ... 나머지 설정
};
```

### 5.2 리다이렉트 URI 확인
앱이 생성하는 리다이렉트 URI를 확인하고 카카오 개발자 콘솔에 등록:

```typescript
// 개발 중에 콘솔에서 확인 가능
console.log('리다이렉트 URI:', kakaoAuthService.getRedirectUri());
```

## 6. 테스트

### 6.1 앱 실행
```bash
npx expo start
```

### 6.2 카카오 로그인 테스트
1. 앱에서 **더보기** → **카카오 로그인 테스트** 이동
2. **카카오 설정 정보 보기**로 리다이렉트 URI 확인
3. **카카오로 로그인** 버튼 클릭
4. 카카오 로그인 페이지에서 로그인
5. 앱으로 돌아와서 사용자 정보 확인

## 7. 주의사항

### 7.1 개발 환경
- Expo Go 앱에서는 카카오 로그인이 제한될 수 있음
- 실제 디바이스나 시뮬레이터에서 테스트 권장

### 7.2 프로덕션 배포
- EAS Build로 앱 빌드 시 실제 패키지명/번들 ID로 카카오 앱 설정 업데이트 필요
- 프로덕션 키 해시 등록 필요

### 7.3 보안
- REST API 키는 클라이언트에 노출되므로 중요하지 않은 정보만 요청
- 실제 사용자 인증은 백엔드에서 처리 권장

## 8. 백엔드 연동

### 8.1 API 엔드포인트
```
POST /api/v1/auth/kakao
{
  "access_token": "카카오_액세스_토큰"
}

Response:
{
  "success": true,
  "data": {
    "access_token": "JWT_토큰",
    "refresh_token": "JWT_리프레시_토큰",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "사용자명",
      "profile_image": "프로필_이미지_URL"
    }
  }
}
```

### 8.2 백엔드 처리
1. 카카오 액세스 토큰으로 사용자 정보 조회
2. 사용자 데이터베이스에 저장/업데이트
3. JWT 토큰 발급하여 클라이언트에 전달

## 9. 문제 해결

### 9.1 일반적인 오류
- **"Invalid redirect_uri"**: 리다이렉트 URI가 카카오 앱 설정과 일치하지 않음
- **"Invalid client_id"**: REST API 키가 잘못됨
- **"Access denied"**: 사용자가 로그인을 취소함

### 9.2 디버깅
- 브라우저 개발자 도구에서 네트워크 탭 확인
- Expo 로그에서 상세한 오류 메시지 확인
- 카카오 개발자 콘솔에서 로그 확인

## 10. 추가 리소스

- [카카오 로그인 REST API 문서](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)
- [Expo AuthSession 문서](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [카카오 개발자 콘솔](https://developers.kakao.com/console/app)
