// 기존 웹 프로젝트의 타입들을 React Native용으로 변환

// 경조사 타입 정의
export enum EventType {
  WEDDING = "결혼식",
  FUNERAL = "장례식", 
  BIRTHDAY = "생일",
  FIRST_BIRTHDAY = "돌잔치",
  GRADUATION = "졸업식",
  OPENING = "개업식",
  ANNIVERSARY = "기념일",
  OTHER = "기타"
}

// 관계 타입 정의
export enum RelationshipType {
  FAMILY = "가족",
  FRIEND = "친구",
  COLLEAGUE = "직장동료",
  ACQUAINTANCE = "지인",
  NEIGHBOR = "이웃",
  RELATIVE = "친척",
  TEACHER = "선생님",
  OTHER = "기타"
}

export interface Event {
  id: string;
  type: EventType;
  title: string;
  date: string;
  location: string;
  amount: number;
  status: '완료' | '예정' | '진행중';
  time?: string;
  attendees?: number;
}

export interface Contact {
  id: number;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  totalGiven: number;
  totalReceived: number;
  balance: number;
  lastEvent: string;
  eventCount: number;
}

export interface StatItem {
  title: string;
  amount: string;
  change: string;
  changeLabel: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  bgColor: string;
  iconColor: string;
  border: string;
}

export interface QuickAction {
  icon: string;
  label: string;
  description: string;
  variant: 'default' | 'outline';
  className: string;
  path: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  events: number;
  net: number;
}

export interface EventTypeStat {
  type: EventType;
  count: number;
  amount: number;
  color: string;
  percentage: number;
}

export interface RelationshipStat {
  relation: string;
  count: number;
  amount: number;
  avgAmount: number;
  color: string;
}

// 네비게이션 타입들
export type RootStackParamList = {
  Home: undefined;
  Events: undefined;
  Contacts: undefined;
  Stats: undefined;
  More: undefined;
  AddEvent: undefined;
  AddSchedule: undefined;
  ContactDetail: { id: string };
  LedgerDetail: { id: string };
  EventDetail: { id: string };
  Login: undefined;
  Settings: undefined;
  Notifications: undefined;
  Guestbook: undefined;
  GuestbookWrite: undefined;
  Venues: undefined;
};

export type TabParamList = {
  Home: undefined;
  Contacts: undefined;
  Events: undefined;
  Stats: undefined;
  More: undefined;
};
