// 경조사 타입별 멘트 정의 공통 함수
export const getEventMessage = (type: string, title: string, date: Date, location: string) => {
  const eventName = title.replace(' 알림', '');
  const dateStr = date.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
  
  switch (type) {
    case 'wedding':
      return `💒 결혼식이 곧 다가옵니다!\n\n${eventName}이 ${dateStr}에 진행됩니다. 새로운 시작을 함께 축하해주시면 감사하겠습니다.`;
    case 'funeral':
      return `🕊️ 조문 안내\n\n${eventName}이 ${dateStr}에 진행됩니다. 고인의 명복을 빌어주시면 감사하겠습니다.`;
    case 'birthday':
      return `🎂 돌잔치 초대\n\n${eventName}이 ${dateStr}에 진행됩니다. 아이의 건강한 성장을 함께 축하해주시면 감사하겠습니다.`;
    case 'opening':
      return `🎊 개업식 초대\n\n${eventName}이 ${dateStr}에 진행됩니다. 새로운 시작을 함께 축하해주시면 감사하겠습니다.`;
    case 'graduation':
      return `🎓 졸업식 축하\n\n${eventName}이 ${dateStr}에 진행됩니다. 새로운 도전을 함께 축하해주시면 감사하겠습니다.`;
    case 'promotion':
      return `🎉 승진 축하\n\n${eventName}이 ${dateStr}에 진행됩니다. 새로운 시작을 함께 축하해주시면 감사하겠습니다.`;
    default:
      return `📅 경조사 알림\n\n${eventName}이 ${dateStr}에 진행됩니다. 참석해주시면 감사하겠습니다.`;
  }
};
