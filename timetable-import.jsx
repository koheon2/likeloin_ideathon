// Everytime timetable import helpers

(function () {
  const STORAGE_KEY = 'bamboo.everytime.timetable';
  const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];
  const COURSE_COLORS = ['#E8B65A', '#FF9B85', '#F2A05A', '#7DA9F7', '#B79DDB', '#9BC4A0', '#7BC6C8'];
  const ANIMALS = ['rabbit', 'bear', 'fox', 'penguin', 'cat', 'raccoon'];
  const ANIMAL_LABELS = ['토끼', '곰', '여우', '펭귄', '고양이', '너구리'];
  const BASE_MOCK = JSON.parse(JSON.stringify(window.MOCK));

  function extractIdentifier(value) {
    const input = String(value || '').trim();
    const urlMatch = input.match(/everytime\.kr\/@([^/?#\s]+)/);
    const raw = urlMatch ? urlMatch[1] : input.replace(/^@/, '');
    const identifier = raw.trim();
    if (!/^[A-Za-z0-9_-]{8,80}$/.test(identifier)) {
      throw new Error('에브리타임 공유 URL 또는 identifier를 확인해주세요.');
    }
    return identifier;
  }

  function hashText(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) {
      hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
  }

  function slotToTime(slot) {
    const numericSlot = Number(slot);
    const hour = Math.floor(numericSlot / 12);
    const minute = (numericSlot % 12) * 5;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  function getValue(node, selector) {
    const found = node.querySelector(selector);
    return found ? (found.getAttribute('value') || '').trim() : '';
  }

  function getHours(courses) {
    const slots = [];
    courses.forEach(course => {
      course.schedule.forEach(item => {
        slots.push(Number(item.startSlot), Number(item.endSlot));
      });
    });

    if (!slots.length) return BASE_MOCK.HOURS;

    const minHour = Math.max(7, Math.floor(Math.min(...slots) / 12));
    const maxHour = Math.min(23, Math.ceil(Math.max(...slots) / 12));
    const hours = [];
    for (let hour = minHour; hour <= maxHour; hour += 1) {
      hours.push(`${String(hour).padStart(2, '0')}:00`);
    }
    return hours;
  }

  function getDays(courses) {
    const maxDayIndex = courses.reduce((max, course) => {
      return Math.max(max, ...course.schedule.map(item => DAY_LABELS.indexOf(item.day)));
    }, 4);
    return DAY_LABELS.slice(0, Math.max(4, maxDayIndex) + 1);
  }

  function parseEverytimeXml(xml) {
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    if (doc.querySelector('parsererror')) {
      throw new Error('시간표 XML을 읽지 못했어요.');
    }

    const table = doc.querySelector('table');
    const subjects = Array.from(doc.querySelectorAll('subject'));
    if (!table || !subjects.length) {
      throw new Error('공유된 시간표에서 수업을 찾지 못했어요.');
    }

    const courses = subjects.map((subject, index) => {
      const name = getValue(subject, 'name') || `수업 ${index + 1}`;
      const professorName = getValue(subject, 'professor') || '담당 교수';
      const color = COURSE_COLORS[index % COURSE_COLORS.length];
      const hash = hashText(`${name}:${professorName}`);
      const animalIndex = hash % ANIMALS.length;
      const schedule = Array.from(subject.querySelectorAll('time data'))
        .map(data => {
          const dayIndex = Number(data.getAttribute('day'));
          const startSlot = Number(data.getAttribute('starttime'));
          const endSlot = Number(data.getAttribute('endtime'));
          if (!Number.isFinite(dayIndex) || !Number.isFinite(startSlot) || !Number.isFinite(endSlot)) return null;
          return {
            day: DAY_LABELS[dayIndex] || '월',
            start: slotToTime(startSlot),
            end: slotToTime(endSlot),
            startSlot,
            endSlot,
            place: (data.getAttribute('place') || '').replace(/<br\s*\/?>/gi, ' ').trim(),
          };
        })
        .filter(Boolean);

      const firstPlace = schedule.find(item => item.place);
      return {
        id: `everytime-${index}-${hash.toString(36)}`,
        code: 'EVERYTIME',
        name,
        college: '가져온 시간표',
        professor: {
          name: professorName,
          title: '교수',
          animal: ANIMAL_LABELS[animalIndex],
          animalKey: ANIMALS[animalIndex],
          hue: hash % 360,
          joined: false,
          bio: '에브리타임 공유 시간표에서 가져온 수업입니다.',
          affinityLevel: 1,
          affinityProgress: 0,
          nextLevelAt: 100,
        },
        schedule,
        location: firstPlace ? firstPlace.place : '강의실 미정',
        color,
        unread: 0,
        affinity: 0,
      };
    }).filter(course => course.schedule.length);

    if (!courses.length) {
      throw new Error('수업 시간이 포함된 과목을 찾지 못했어요.');
    }

    return {
      courses,
      meta: {
        year: table.getAttribute('year') || '',
        semester: table.getAttribute('semester') || '',
        identifier: table.getAttribute('identifier') || '',
      },
    };
  }

  function saveImported(source) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(source));
  }

  function loadImported() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function clearImported() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function applyImported(source) {
    const mock = JSON.parse(JSON.stringify(BASE_MOCK));
    if (!source || !Array.isArray(source.courses) || !source.courses.length) return mock;
    mock.COURSES = source.courses;
    mock.DAYS = getDays(source.courses);
    mock.HOURS = getHours(source.courses);
    return mock;
  }

  window.TIMETABLE_IMPORT = {
    extractIdentifier,
    parseEverytimeXml,
    saveImported,
    loadImported,
    clearImported,
    applyImported,
  };
})();
