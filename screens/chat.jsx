// Class chatroom — student/professor/AI conversation with typing animation

function ChatScreen({ courseId, onPickCourse, charStyle, palette }) {
  const courses = window.MOCK.COURSES;
  const course = courses.find(c => c.id === courseId) || courses[0];
  const [thread, setThread] = useState(window.MOCK.SAMPLE_THREAD);
  const [input, setInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const [showAffinityPop, setShowAffinityPop] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [thread, aiTyping]);

  function send() {
    if (!input.trim()) return;
    const myMsg = {
      id: 'u' + Date.now(),
      author: 'student',
      name: '나',
      isMe: true,
      text: input.trim(),
      time: '방금',
    };
    setThread(t => [...t, myMsg]);
    setInput('');
    // Show affinity gain
    setShowAffinityPop({ amount: 8, label: '질문하기 +8' });
    setTimeout(() => setShowAffinityPop(null), 1800);
    // AI / prof typing
    setAiTyping(true);
    setTimeout(() => {
      setAiTyping(false);
      const reply = course.professor.joined ? {
        id: 'p' + Date.now(),
        author: 'prof',
        name: `${course.professor.name} ${course.professor.title}`,
        text: '좋은 질문이에요. 다음 강의 시작 전에 짧게 정리해서 드릴게요. 일단 강의 노트 14쪽 부분을 다시 한 번 보면 비슷한 흐름이 있어요.',
        time: '방금',
        aiTranslated: true,
      } : {
        id: 'a' + Date.now(),
        author: 'ai-proxy',
        name: `${course.professor.animal} 교수님 (AI 임시 답변)`,
        text: '교수님이 아직 가입 전이라 제가 임시로 안내해요 — 이런 질문은 보통 강의 자료의 \"평가 방법\" 섹션에 답이 있어요. 거기를 먼저 확인해보고 다시 알려주세요.',
        time: '방금',
        aiNote: '가입 후 답변이 갱신될 수 있어요.',
      };
      setThread(t => [...t, reply]);
    }, 1800);
  }

  return (
    <div className="chat-screen">
      <header className="chat-head">
        <button className="pill ghost icon-btn" onClick={() => onPickCourse(null)}>{Icon.back}</button>
        <div className="chat-head-info">
          <Character animal={course.professor.animalKey} hue={course.professor.hue} size={48} style={charStyle} />
          <div>
            <div className="ch-title">{course.name}</div>
            <div className="ch-sub">
              {course.professor.name} {course.professor.title}
              {!course.professor.joined && <span className="tag tag-ai">AI 임시 응답 중</span>}
              {course.professor.joined && <span className="tag tag-live">답변 평균 2시간</span>}
            </div>
          </div>
        </div>
        <div className="chat-head-aff">
          <span className="aff-label">호감도 Lv.{course.professor.affinityLevel}</span>
          <LevelBar value={course.professor.affinityProgress} color={course.color} />
          <span className="aff-pct">{course.professor.affinityProgress}/100</span>
        </div>
      </header>

      {/* Course selector strip */}
      <div className="course-strip">
        {courses.map(c => (
          <button
            key={c.id}
            className={`cstrip-item ${c.id === course.id ? 'active' : ''}`}
            onClick={() => onPickCourse(c.id)}
            style={{ '--c': c.color }}
          >
            <Character animal={c.professor.animalKey} hue={c.professor.hue} size={28} style={charStyle} />
            <span>{c.name}</span>
            {c.unread > 0 && <span className="cstrip-badge">{c.unread}</span>}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="chat-body" ref={scrollRef}>
        <div className="chat-day-divider">오늘 · 5월 12일</div>
        {thread.map(m => <Message key={m.id} m={m} course={course} charStyle={charStyle} />)}
        {aiTyping && (
          <div className="msg msg-prof">
            <Character animal={course.professor.animalKey} hue={course.professor.hue} size={36} style={charStyle} />
            <div className="msg-content">
              <div className="msg-name">{course.professor.joined ? `${course.professor.name} ${course.professor.title}` : `${course.professor.animal} 교수님 (AI 임시 답변)`}</div>
              <div className="bubble bubble-prof typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="composer">
        <div className="composer-tips">
          <span className="tip-chip">💡 친구한테 묻듯 편하게 적어도, AI가 정중하게 다듬어 전달해요</span>
        </div>
        <div className="composer-input">
          <textarea
            placeholder="궁금한 점을 적어보세요. 예: 다음 시험 어떤 형태로 나와요?"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            rows={2}
          />
          <button className="send-btn" onClick={send} disabled={!input.trim()} style={{ background: course.color }}>
            {Icon.send}
          </button>
        </div>
      </div>

      {/* Affinity pop */}
      {showAffinityPop && (
        <div className="aff-pop">
          <Character animal={course.professor.animalKey} hue={course.professor.hue} size={48} style={charStyle} mood="happy" />
          <div>
            <div className="ap-title">호감도 +{showAffinityPop.amount}</div>
            <div className="ap-sub">{course.professor.name} {course.professor.title}이(가) 좋아해요</div>
          </div>
        </div>
      )}
    </div>
  );
}

function Message({ m, course, charStyle }) {
  if (m.isMe) {
    return (
      <div className="msg msg-me">
        <div className="msg-content">
          <div className="msg-name">나</div>
          <div className="bubble bubble-me">{m.text}</div>
          <div className="msg-time">{m.time}</div>
        </div>
      </div>
    );
  }
  if (m.author === 'ai-summary') {
    return (
      <div className="msg msg-ai-card">
        <div className="ai-card">
          <div className="ai-card-head">
            <span className="ai-spark">{Icon.spark}</span>
            <span>대나무의숲 AI · 이전 답변 요약</span>
          </div>
          <div className="ai-card-body">{m.text}</div>
          {m.aiNote && <div className="ai-card-foot">{m.aiNote}</div>}
        </div>
      </div>
    );
  }
  // Professor or AI proxy
  return (
    <div className="msg msg-prof">
      <Character animal={course.professor.animalKey} hue={course.professor.hue} size={36} style={charStyle} />
      <div className="msg-content">
        <div className="msg-name">
          {m.name}
          {m.aiTranslated && <span className="tag tag-soft">AI가 친근하게 다듬음</span>}
        </div>
        <div className={`bubble ${m.author === 'ai-proxy' ? 'bubble-ai' : 'bubble-prof'}`}>{m.text}</div>
        {m.aiNote && <div className="msg-aside">{m.aiNote}</div>}
        <div className="msg-time">{m.time}</div>
      </div>
    </div>
  );
}

window.ChatScreen = ChatScreen;
