-- Insert sample memo data into the memos table
-- Run this after creating the memos table

INSERT INTO public.memos (id, title, content, category, tags, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  '프로젝트 회의 준비',
  '다음 주 월요일 오전 10시 프로젝트 킥오프 미팅을 위한 준비사항:

- 프로젝트 범위 정의서 작성
- 팀원별 역할 분담
- 일정 계획 수립
- 필요한 리소스 정리',
  'work',
  ARRAY['회의', '프로젝트', '준비'],
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
),
(
  gen_random_uuid(),
  'React 18 새로운 기능 학습',
  'React 18에서 새로 추가된 기능들을 학습해야 함:

1. Concurrent Features
2. Automatic Batching
3. Suspense 개선사항
4. useId Hook
5. useDeferredValue Hook

이번 주말에 공식 문서를 읽고 간단한 예제를 만들어보자.',
  'study',
  ARRAY['React', '학습', '개발'],
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '1 day'
),
(
  gen_random_uuid(),
  '새로운 앱 아이디어: 습관 트래커',
  '매일 실천하고 싶은 습관들을 관리할 수 있는 앱:

핵심 기능:
- 습관 등록 및 관리
- 일일 체크인
- 진행 상황 시각화
- 목표 달성 알림
- 통계 분석

기술 스택: React Native + Supabase
출시 목표: 3개월 후',
  'idea',
  ARRAY['앱개발', '습관', 'React Native'],
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '3 days'
),
(
  gen_random_uuid(),
  '주말 여행 계획',
  '이번 주말 제주도 여행 계획:

토요일:
- 오전: 한라산 등반
- 오후: 성산일출봉 관광
- 저녁: 흑돼지 맛집 방문

일요일:
- 오전: 우도 관광
- 오후: 쇼핑 및 기념품 구매
- 저녁: 공항 이동

준비물: 등산화, 카메라, 선크림',
  'personal',
  ARRAY['여행', '제주도', '주말'],
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '8 days'
),
(
  gen_random_uuid(),
  '🍽️ 저녁 메뉴 아이디어',
  '# 🍽️ 저녁 메뉴 아이디어

## 한식 🇰🇷
- [ ] 김치찌개 + 밥 + 김
- [ ] 불고기 + 쌈채소 + 된장찌개  
- [ ] 비빔밥 + 미역국
- [ ] 갈비탕 + 깍두기
- [ ] 제육볶음 + 계란찜

## 양식 🍝
- [ ] 크림파스타 + 샐러드
- [ ] 토마토파스타 + 마늘빵
- [ ] 스테이크 + 감자 + 와인
- [ ] 리조또 + 브루스케타
- [ ] 오믈렛 + 토스트

## 중식 🥡
- [ ] 짜장면 + 탕수육
- [ ] 짬뽕 + 군만두
- [ ] 볶음밥 + 달걀국
- [ ] 마파두부 + 밥
- [ ] 라조기 + 짬뽕밥

## 일식 🍣
- [ ] 초밥 + 미소시루
- [ ] 규동 + 된장국
- [ ] 라멘 + 교자
- [ ] 텐동 + 우동
- [ ] 연어덮밥 + 장국

## 간편식 🍕
- [ ] 치킨 + 맥주 🍗🍺
- [ ] 피자 주문 🍕
- [ ] 족발 + 보쌈 🐷
- [ ] 햄버거 + 감자튀김 🍔
- [ ] 분식 (떡볶이, 김밥) 🍢

---

> **팁**: 냉장고에 있는 재료를 먼저 확인하고 선택하세요!  
> **오늘의 기분**: 🤔 뭔가 특별한 걸 먹고 싶은 날',
  'personal',
  ARRAY['저녁', '메뉴', '요리', '음식'],
  NOW(),
  NOW()
);