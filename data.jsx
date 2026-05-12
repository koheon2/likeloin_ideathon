// Mock data for 대나무의숲 prototype
// Korea University-flavored timetable (humanities + science mixed)

const COURSES = [
  {
    id: 'biz-stat',
    code: 'STAT204',
    name: '경영통계학',
    college: '경영대학',
    professor: {
      name: '오성현',
      title: '교수',
      animal: '곰',
      animalKey: 'bear',
      hue: 32, // amber
      joined: true,
      bio: '경영통계 / 데이터 분석. 학생들의 \"왜?\"를 가장 좋아함.',
      affinityLevel: 4,
      affinityProgress: 72,
      nextLevelAt: 100,
    },
    schedule: [{ day: '월', start: '10:30', end: '12:00' }, { day: '수', start: '10:30', end: '12:00' }],
    location: '경영본관 305',
    color: '#E8B65A',
    unread: 3,
    affinity: 72,
  },
  {
    id: 'kor-lit',
    code: 'KLIT318',
    name: '한국현대문학',
    college: '문과대학',
    professor: {
      name: '윤정아',
      title: '교수',
      animal: '토끼',
      animalKey: 'rabbit',
      hue: 350, // soft pink
      joined: true,
      bio: '1930년대 모더니즘 시 전공. 시 한 편을 같이 천천히 읽는 시간을 가장 좋아함.',
      affinityLevel: 5,
      affinityProgress: 38,
      nextLevelAt: 100,
    },
    schedule: [{ day: '화', start: '13:00', end: '14:30' }, { day: '목', start: '13:00', end: '14:30' }],
    location: '문과대 서관 211',
    color: '#FF9B85',
    unread: 1,
    affinity: 88,
  },
  {
    id: 'ai-society',
    code: 'CSE391',
    name: '인공지능과 사회',
    college: '정보대학',
    professor: {
      name: '한도윤',
      title: '교수',
      animal: '여우',
      animalKey: 'fox',
      hue: 20, // orange
      joined: false, // AI fills in
      bio: '아직 대나무의숲에 가입하지 않은 교수입니다. AI가 임시로 답변합니다.',
      affinityLevel: 2,
      affinityProgress: 60,
      nextLevelAt: 100,
    },
    schedule: [{ day: '월', start: '15:00', end: '16:30' }, { day: '수', start: '15:00', end: '16:30' }],
    location: '정보관 B105',
    color: '#F2A05A',
    unread: 5,
    affinity: 35,
  },
  {
    id: 'micro-econ',
    code: 'ECON211',
    name: '미시경제학',
    college: '정경대학',
    professor: {
      name: '임지환',
      title: '교수',
      animal: '펭귄',
      animalKey: 'penguin',
      hue: 220, // blue
      joined: true,
      bio: '게임이론과 행동경제학. 직관보다 그래프를 그려 설명하는 걸 좋아함.',
      affinityLevel: 3,
      affinityProgress: 20,
      nextLevelAt: 100,
    },
    schedule: [{ day: '화', start: '10:30', end: '12:00' }, { day: '목', start: '10:30', end: '12:00' }],
    location: '정경관 401',
    color: '#7DA9F7',
    unread: 0,
    affinity: 55,
  },
  {
    id: 'east-phil',
    code: 'PHIL204',
    name: '동양철학사',
    college: '문과대학',
    professor: {
      name: '서윤희',
      title: '교수',
      animal: '고양이',
      animalKey: 'cat',
      hue: 280, // soft purple
      joined: true,
      bio: '주자학과 양명학. 학생의 질문 하나에 30분 동안 같이 고민하는 타입.',
      affinityLevel: 3,
      affinityProgress: 85,
      nextLevelAt: 100,
    },
    schedule: [{ day: '금', start: '13:00', end: '15:30' }],
    location: '문과대 동관 108',
    color: '#B79DDB',
    unread: 0,
    affinity: 64,
  },
  {
    id: 'org-chem',
    code: 'CHEM231',
    name: '유기화학',
    college: '이과대학',
    professor: {
      name: '최승호',
      title: '교수',
      animal: '너구리',
      animalKey: 'raccoon',
      hue: 140, // green-ish
      joined: true,
      bio: '유기 반응 메커니즘. 모르겠으면 일단 화살표부터 그리라고 함.',
      affinityLevel: 2,
      affinityProgress: 10,
      nextLevelAt: 100,
    },
    schedule: [{ day: '월', start: '13:00', end: '14:30' }, { day: '수', start: '13:00', end: '14:30' }],
    location: '이학관 R204',
    color: '#9BC4A0',
    unread: 2,
    affinity: 28,
  },
];

const DAYS = ['월', '화', '수', '목', '금'];
const HOURS = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];

// Chat messages for the AI-and-Society room (mix of student/prof/AI)
const SAMPLE_THREAD = [
  {
    id: 'm1',
    author: 'student',
    name: '이서연',
    text: '교수님, 다음 주 발표 주제로 \'AI의 저작권 문제\' 잡아도 괜찮을까요?',
    time: '어제 18:42',
    affinityGain: null,
  },
  {
    id: 'm2',
    author: 'ai-proxy', // AI relaying for professor not yet joined
    name: '여우 교수님 (AI 임시 답변)',
    text: '좋은 주제예요! 저작권 쪽은 사례가 빠르게 바뀌고 있어서, 발표 일주일 전 기준으로 가장 최근 판례 한두 개를 꼭 같이 보면 좋을 거예요. 미국 사례(Anthropic, OpenAI 소송)와 국내 사례를 비교해보는 것도 추천해요.',
    time: '어제 18:43',
    affinityGain: null,
    aiNote: '교수님이 아직 가입 전이라 AI가 임시로 답변했어요. 가입 후 답변이 갱신될 수 있어요.',
  },
  {
    id: 'm3',
    author: 'student',
    name: '박재훈',
    text: '저는 \'생성형 AI와 학습 데이터\' 주제 잡으려고 했는데, 너무 광범위할까요?',
    time: '오늘 09:12',
  },
  {
    id: 'm4',
    author: 'ai-summary',
    name: '대나무의숲 AI',
    text: '이전에 비슷한 질문이 있었어요 — "주제 범위 설정" 관련해서 교수님께서 \"문제를 한 문장으로 적을 수 있을 정도로 좁히기\"를 권하신 적 있어요. 그걸 먼저 시도해보고 막히면 다시 물어보는 걸 추천해요.',
    time: '오늘 09:12',
    aiNote: '비슷한 질문(3건)을 바탕으로 미리 정리한 답변이에요.',
  },
  {
    id: 'm5',
    author: 'student',
    name: '나',
    isMe: true,
    text: '교수님, 중간고사는 객관식인가요 서술형인가요?',
    time: '오늘 10:24',
  },
];

const FAQ_QUESTIONS = [
  {
    id: 'f1',
    course: '경영통계학',
    courseId: 'biz-stat',
    text: '중심극한정리 증명이 시험에 나오나요?',
    answer: '증명은 시험 범위가 아니에요. 다만 \"왜 표본이 30 이상이면 정규에 가까워지는지\" 직관적으로 설명할 수 있어야 해요.',
    asked: 12,
    daysAgo: 3,
  },
  {
    id: 'f2',
    course: '한국현대문학',
    courseId: 'kor-lit',
    text: '발제 자료 분량 기준이 있나요?',
    answer: 'A4 두 장 내외면 충분해요. 길이보다 \"어떤 질문을 던지는가\"가 더 중요합니다.',
    asked: 7,
    daysAgo: 1,
  },
  {
    id: 'f3',
    course: '유기화학',
    courseId: 'org-chem',
    text: '메커니즘 화살표 방향이 헷갈리는데 팁이 있을까요?',
    answer: '전자 풍부한 쪽 → 전자 부족한 쪽으로 가는 것이 원칙입니다. 일단 모든 화살표를 \"전자가 어디로 가는가\" 한 줄로 말해보세요.',
    asked: 23,
    daysAgo: 5,
  },
  {
    id: 'f4',
    course: '인공지능과 사회',
    courseId: 'ai-society',
    text: '기말 페이퍼 주제는 자유인가요?',
    answer: '자유입니다. 단, 강의에서 다룬 사회·윤리 쟁점 중 하나와 명확히 연결되어야 해요.',
    asked: 9,
    daysAgo: 2,
  },
  {
    id: 'f5',
    course: '미시경제학',
    courseId: 'micro-econ',
    text: '내쉬균형 문제는 그래프 없이도 풀 수 있나요?',
    answer: '풀 수는 있지만 권장하지 않아요. 그래프를 그리는 5분이 계산 30분을 줄여줍니다.',
    asked: 18,
    daysAgo: 7,
  },
];

const BADGES = [
  { id: 'b1', name: '첫 질문', desc: '대나무의숲에 처음 질문을 남겼어요', icon: '🌱', achieved: true },
  { id: 'b2', name: '꾸준한 학생', desc: '7일 연속 수업방에 들어왔어요', icon: '📅', achieved: true },
  { id: 'b3', name: '복습러', desc: '지난 강의 자료를 10번 다시 봤어요', icon: '📖', achieved: true },
  { id: 'b4', name: '대화의 기술', desc: '교수님 답변에 후속 질문을 5번 했어요', icon: '💬', achieved: true },
  { id: 'b5', name: '식사 한 끼', desc: '교수님과 식사 약속을 잡았어요', icon: '🍱', achieved: false },
  { id: 'b6', name: '만점 학생', desc: '한 학기 모든 과제를 제출했어요', icon: '🏆', achieved: false },
];

const STAMP_DAYS = [
  // 28일 기준 미니 캘린더 (true = 출석, ★ = 질문도 함)
  true, true, true, false, true, true, true,
  true, 'star', true, true, false, true, true,
  true, true, 'star', true, true, true, false,
  true, true, true, 'star', true, 'today', null,
];

// Professor dashboard stats
const PROF_STATS = {
  course: '경영통계학',
  students: 64,
  weeklyQuestions: 23,
  weeklyDelta: +6,
  repeatedRate: 41, // % of questions that were already answered before
  avgResponseTime: '2.4시간',
  topQuestions: [
    { text: '중심극한정리 증명이 시험에 나오나요?', count: 12, status: '답변 완료' },
    { text: '회귀분석 가정 4가지가 헷갈려요', count: 9, status: '답변 완료' },
    { text: '엑셀 데이터 분석 도구 어디서 설치?', count: 7, status: 'AI가 안내함' },
    { text: '과제 2번 데이터 어디서 받나요?', count: 5, status: '답변 필요' },
  ],
  participation: [
    { week: 'W1', value: 18 }, { week: 'W2', value: 22 }, { week: 'W3', value: 31 },
    { week: 'W4', value: 28 }, { week: 'W5', value: 35 }, { week: 'W6', value: 41 },
    { week: 'W7', value: 38 }, { week: 'W8', value: 47 },
  ],
};

window.MOCK = { COURSES, DAYS, HOURS, SAMPLE_THREAD, FAQ_QUESTIONS, BADGES, STAMP_DAYS, PROF_STATS };
