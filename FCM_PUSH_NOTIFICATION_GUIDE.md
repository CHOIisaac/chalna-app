# FCM 푸시 알림 구현 가이드 📱

## 📋 목차
1. [개요](#개요)
2. [프론트엔드 구현 완료 사항](#프론트엔드-구현-완료-사항)
3. [백엔드 구현 필요 사항](#백엔드-구현-필요-사항)
4. [테스트 방법](#테스트-방법)
5. [배포 전 체크리스트](#배포-전-체크리스트)

---

## 개요

찰나 앱에 Firebase Cloud Messaging (FCM)을 활용한 푸시 알림 시스템이 구현되었습니다.

### 주요 기능
- ✅ FCM 토큰 자동 등록 및 서버 전송
- ✅ 포그라운드/백그라운드 알림 수신
- ✅ 알림 타입별 화면 네비게이션
- ✅ 개발자 도구 (테스트 알림 전송)
- ✅ Android 알림 채널 관리

---

## 프론트엔드 구현 완료 사항

### 1. 파일 구조

```
src/
├── services/
│   ├── fcmNotificationService.ts  # FCM 알림 서비스 (메인)
│   └── fcmTestService.ts          # FCM 테스트 유틸리티
├── config/
│   └── api.ts                     # FCM API 엔드포인트 추가
├── pages/
│   └── More.tsx                   # 개발자 도구 추가
└── app/
    └── _layout.tsx                # FCM 초기화 로직
```

### 2. FCM 알림 서비스 (fcmNotificationService.ts)

**주요 기능:**
- FCM 토큰 등록 및 권한 요청
- 서버에 토큰 등록/해제
- 알림 리스너 설정
- 알림 타입별 네비게이션 처리
- Android 알림 채널 관리 (기본, 경조사, 장부)

**사용 예시:**
```typescript
import { fcmNotificationService } from '@/src/services/fcmNotificationService';

// FCM 토큰 등록
const token = await fcmNotificationService.registerForPushNotificationsAsync();

// 서버에 토큰 등록
const result = await fcmNotificationService.registerTokenToServer(userId);

// 알림 리스너 설정
const unsubscribe = fcmNotificationService.setupNotificationListeners();
```

### 3. FCM 테스트 서비스 (fcmTestService.ts)

**주요 기능:**
- 테스트 알림 전송
- 경조사/장부 알림 테스트
- FCM 상태 확인
- FCM 토큰 재등록

**사용 예시:**
```typescript
import { fcmTest } from '@/src/services/fcmTestService';

// 테스트 알림 전송
await fcmTest.sendTestNotification('제목', '내용');

// 경조사 알림 테스트
await fcmTest.sendEventTestNotification('wedding');

// FCM 상태 확인
const status = await fcmTest.checkFCMStatus();
```

### 4. App 초기화 (_layout.tsx)

**구현 내용:**
- 앱 시작 시 FCM 자동 초기화
- 로그인 상태일 때만 FCM 토큰 등록
- 알림 리스너 자동 설정

### 5. 개발자 도구 (More.tsx)

**추가된 메뉴:**
1. **푸시 알림 테스트** - 다양한 타입의 테스트 알림 전송
2. **FCM 토큰 재등록** - 토큰 문제 해결용
3. **FCM 정보 확인** - 콘솔에 FCM 정보 출력

### 6. API 엔드포인트 설정 (config/api.ts)

```typescript
FCM_REGISTER: '/api/v1/fcm/register',
FCM_UNREGISTER: '/api/v1/fcm/unregister',
FCM_SEND_TEST: '/api/v1/fcm/send-test',
```

### 7. app.json 설정

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/images/chalna-app-icon1.png",
          "color": "#ffffff",
          "sounds": [],
          "mode": "production"
        }
      ]
    ]
  }
}
```

---

## 백엔드 구현 필요 사항

### 1. Firebase Admin SDK 설정

```python
# backend/main.py
import firebase_admin
from firebase_admin import credentials, messaging

# Firebase 서비스 계정 키 로드
cred = credentials.Certificate("path/to/service-account-key.json")
firebase_admin.initialize_app(cred)
```

### 2. 데이터베이스 모델

```python
# backend/models/fcm_token.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean

class FCMToken(Base):
    __tablename__ = "fcm_tokens"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(String, nullable=False, index=True)
    token = Column(String, nullable=False, unique=True)
    device_id = Column(String, nullable=False)
    platform = Column(String, nullable=False)  # 'ios' or 'android'
    app_version = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
```

### 3. API 엔드포인트

#### 3-1. FCM 토큰 등록
```python
@router.post("/api/v1/fcm/register")
async def register_fcm_token(
    user_id: str,
    token: str,
    device_id: str,
    platform: str,
    app_version: str,
    db: Session = Depends(get_db)
):
    # 기존 토큰 확인 및 업데이트 또는 신규 생성
    # ...
    return {"success": True, "message": "FCM 토큰 등록 완료"}
```

#### 3-2. FCM 토큰 해제
```python
@router.post("/api/v1/fcm/unregister")
async def unregister_fcm_token(
    token: str,
    db: Session = Depends(get_db)
):
    # 토큰 비활성화
    # ...
    return {"success": True, "message": "FCM 토큰 해제 완료"}
```

#### 3-3. 테스트 알림 전송
```python
@router.post("/api/v1/fcm/send-test")
async def send_test_notification(
    user_id: str,
    title: str = "테스트 알림",
    body: str = "FCM 푸시 알림 테스트입니다.",
    data: dict = {},
    db: Session = Depends(get_db)
):
    # 사용자의 활성 FCM 토큰 조회
    tokens = db.query(FCMToken).filter(
        FCMToken.user_id == user_id,
        FCMToken.is_active == True
    ).all()
    
    # FCM 알림 전송
    for fcm_token in tokens:
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data=data,
            token=fcm_token.token,
        )
        messaging.send(message)
    
    return {"success": True, "message": "테스트 알림 전송 완료"}
```

### 4. FCM 알림 전송 서비스

```python
# backend/services/fcm_service.py
class FCMService:
    @staticmethod
    async def send_event_notification(
        user_id: str,
        event_type: str,
        event_title: str,
        event_date: str,
        event_location: str,
        db: Session
    ):
        """경조사 알림 전송"""
        tokens = db.query(FCMToken).filter(
            FCMToken.user_id == user_id,
            FCMToken.is_active == True
        ).all()
        
        for fcm_token in tokens:
            message = messaging.Message(
                notification=messaging.Notification(
                    title=f"{event_title} 알림",
                    body=f"{event_date}에 {event_location}에서 {event_type}이 있습니다.",
                ),
                data={
                    "type": "event",
                    "eventType": event_type,
                    "eventId": event_id,
                },
                token=fcm_token.token,
                android=messaging.AndroidConfig(
                    notification=messaging.AndroidNotification(
                        channel_id="event",  # 경조사 전용 채널
                    )
                ),
            )
            messaging.send(message)
    
    @staticmethod
    async def send_ledger_notification(
        user_id: str,
        ledger_title: str,
        amount: int,
        db: Session
    ):
        """장부 알림 전송"""
        tokens = db.query(FCMToken).filter(
            FCMToken.user_id == user_id,
            FCMToken.is_active == True
        ).all()
        
        for fcm_token in tokens:
            message = messaging.Message(
                notification=messaging.Notification(
                    title="장부 기록 알림",
                    body=f"{ledger_title} - {amount:,}원이 기록되었습니다.",
                ),
                data={
                    "type": "ledger",
                    "ledgerId": ledger_id,
                },
                token=fcm_token.token,
                android=messaging.AndroidConfig(
                    notification=messaging.AndroidNotification(
                        channel_id="ledger",  # 장부 전용 채널
                    )
                ),
            )
            messaging.send(message)
```

### 5. 일정 생성 시 자동 알림 예약

```python
@router.post("/api/v1/schedules/")
async def create_schedule(
    schedule_data: ScheduleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 일정 생성
    schedule = Schedule(**schedule_data.dict())
    db.add(schedule)
    db.commit()
    
    # FCM 알림 예약 (1일 전, 1시간 전)
    await FCMService.schedule_event_notifications(
        user_id=current_user.id,
        event_id=schedule.id,
        event_type=schedule.event_type,
        event_title=schedule.title,
        event_date=schedule.event_date,
        event_location=schedule.location,
        db=db
    )
    
    return schedule
```

---

## 테스트 방법

### 1. 실제 디바이스에서 테스트

**시뮬레이터는 FCM 지원 안 됨!**

```bash
# iOS
npx expo run:ios --device

# Android
npx expo run:android --device
```

### 2. 더보기 페이지에서 테스트

1. 앱 실행 후 로그인
2. **더보기** 탭으로 이동
3. **🔧 개발자 도구** 섹션에서:
   - **푸시 알림 테스트** 클릭
   - 원하는 알림 타입 선택 (일반/결혼식/장부)
   - 알림 수신 확인

### 3. 콘솔 로그 확인

```bash
# 터미널에서 로그 확인
npx expo start

# 로그에서 다음 메시지 확인:
✅ FCM 푸시 토큰 등록 완료: ExponentPushToken[...]
✅ 서버에 FCM 토큰 등록 완료
📱 포그라운드 알림 수신: ...
```

### 4. Firebase Console에서 직접 테스트

1. Firebase Console → Cloud Messaging
2. "새 알림" 클릭
3. 제목, 내용 입력
4. "단일 기기"로 FCM 토큰 입력
5. 전송

---

## 배포 전 체크리스트

### Firebase 설정
- [ ] Firebase 프로젝트 생성 완료
- [ ] `google-services.json` (Android) 추가
- [ ] `GoogleService-Info.plist` (iOS) 추가
- [ ] Firebase 서비스 계정 키 생성
- [ ] 백엔드에 Firebase Admin SDK 설치

### 백엔드 구현
- [ ] FCM 토큰 등록/해제 API 구현
- [ ] FCM 토큰 데이터베이스 테이블 생성
- [ ] 테스트 알림 전송 API 구현
- [ ] 경조사/장부 알림 전송 서비스 구현
- [ ] 일정 생성 시 자동 알림 예약 로직 구현

### 프론트엔드 확인
- [ ] `expo-notifications` 패키지 설치 확인
- [ ] `app.json`에 알림 플러그인 설정 확인
- [ ] 실제 디바이스에서 알림 권한 요청 확인
- [ ] FCM 토큰 자동 등록 확인
- [ ] 포그라운드/백그라운드 알림 수신 확인
- [ ] 알림 탭 시 네비게이션 동작 확인

### 보안 설정
- [ ] Firebase 서비스 계정 키 안전하게 관리 (.gitignore 추가)
- [ ] API 엔드포인트 인증 확인
- [ ] FCM 토큰 암호화 저장 (선택사항)

### 테스트
- [ ] iOS 실제 디바이스 테스트
- [ ] Android 실제 디바이스 테스트
- [ ] 포그라운드 알림 테스트
- [ ] 백그라운드 알림 테스트
- [ ] 알림 탭 시 화면 이동 테스트
- [ ] 여러 디바이스 동시 알림 수신 테스트

---

## 문제 해결

### 1. FCM 토큰이 등록되지 않아요
- 실제 디바이스에서 테스트하고 있나요? (시뮬레이터 불가)
- 알림 권한을 허용했나요?
- 콘솔 로그를 확인하세요: `fcmTest.printFCMInfo()`

### 2. 알림이 수신되지 않아요
- 백엔드 API가 구현되었나요?
- Firebase 서비스 계정 키가 올바른가요?
- FCM 토큰이 서버에 등록되었나요?
- 앱이 백그라운드/포그라운드 상태인지 확인하세요

### 3. 알림을 탭해도 화면이 이동하지 않아요
- `handleNotificationTap` 함수에서 router.push 주석을 해제하세요
- 알림 데이터에 올바른 `type`, `eventId`, `ledgerId`가 포함되어 있나요?

---

## 참고 자료

- [Expo Notifications 문서](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Firebase Cloud Messaging 문서](https://firebase.google.com/docs/cloud-messaging)
- [Firebase Admin SDK (Python)](https://firebase.google.com/docs/admin/setup)

---

## 개발자 연락처

문제가 발생하거나 질문이 있으시면:
- GitHub Issues
- 이메일: support@chalna.com

