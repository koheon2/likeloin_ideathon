// Ask question composer with AI preview / rewrite

function AskScreen({ onNav, charStyle, palette }) {
  const courses = window.MOCK.COURSES;
  const [selected, setSelected] = useState(courses[0].id);
  const course = courses.find(c => c.id === selected);
  const [raw, setRaw] = useState('과제2 데이터 어디서 받음? 못 찾겠어요 ㅠㅠ');
  const [rewriting, setRewriting] = useState(false);
  const [rewritten, setRewritten] = useState('교수님, 안녕하세요. 과제2 데이터 파일을 어디에서 다운로드할 수 있는지 안내 부탁드려도 될까요? 강의 자료 페이지에서 찾기가 어려워서 여쭤봅니다. 감사합니다.');
  const [showSimilar, setShowSimilar] = useState(true);

  function rewrite() {
    setRewriting(true);
    setTimeout(() => {
      setRewritten('교수님, 안녕하세요. ' + raw.replace(/\?+$/, '').replace(/ㅠㅠ|ㅜㅜ|ㅋㅋ/g, '').trim() + '에 대해 안내해 주시면 감사하겠습니다. 강의 자료에서 찾기 어려워서 여쭙습니다.');
      setRewriting(false);
    }, 1000);
  }

  return (
    <div className="ask-screen">
      <TopBar
        title="질문하기"
        subtitle="편하게 적어주세요. AI가 정중한 말투로 다듬어 교수님께 전달해요."
        right={<button className="pill ghost" onClick={() => onNav('chat')}>대화방으로</button>}
      />

      <div className="ask-grid">
        <Card className="ask-card">
          <label className="field-label">수업 선택</label>
          <div className="course-pills">
            {courses.map(c => (
              <button
                key={c.id}
                className={`cp ${c.id === selected ? 'on' : ''}`}
                onClick={() => setSelected(c.id)}
                style={c.id === selected ? { borderColor: c.color, background: c.color + '22' } : null}
              >
                <Character animal={c.professor.animalKey} hue={c.professor.hue} size={24} style={charStyle} />
                <span>{c.name}</span>
              </button>
            ))}
          </div>

          <label className="field-label">친구한테 묻듯 편하게 적어보세요</label>
          <textarea
            className="raw-input"
            value={raw}
            onChange={e => setRaw(e.target.value)}
            rows={5}
            placeholder="예: 시험 어떻게 나옴? / 과제 양식 어디감?"
          />

          <div className="ask-actions">
            <button className="pill primary big" onClick={rewrite} style={{ background: course.color }}>
              {Icon.spark} AI에게 다듬어달라고 하기
            </button>
            <button className="pill ghost">초안 저장</button>
          </div>
        </Card>

        <Card className="preview-card">
          <div className="prev-head">
            <Character animal={course.professor.animalKey} hue={course.professor.hue} size={40} style={charStyle} />
            <div>
              <div className="prev-to">{course.professor.name} {course.professor.title}에게 전달</div>
              <div className="prev-course muted">{course.name}</div>
            </div>
            <span className="tag tag-soft">AI 다듬은 버전 미리보기</span>
          </div>

          {rewriting ? (
            <div className="prev-loading">
              <div className="typing"><span></span><span></span><span></span></div>
              <div className="muted">AI가 정중하게 다듬는 중…</div>
            </div>
          ) : (
            <div className="prev-body">{rewritten}</div>
          )}

          <div className="prev-row">
            <div className="diff-pill"><span className="d-from">반말</span>→<span className="d-to">존댓말</span></div>
            <div className="diff-pill"><span className="d-from">감정 표현</span>→<span className="d-to">중립 톤</span></div>
            <div className="diff-pill"><span className="d-from">맥락 부족</span>→<span className="d-to">상황 설명 추가</span></div>
          </div>

          <div className="prev-actions">
            <button className="pill primary" style={{ background: course.color }}>이대로 전송 {Icon.send}</button>
            <button className="pill ghost">원문 그대로 전송</button>
            <button className="pill ghost">다시 다듬기</button>
          </div>
        </Card>

        {showSimilar && (
          <Card className="similar-card">
            <div className="sim-head">
              <span className="ai-spark">{Icon.spark}</span>
              <div>
                <div className="sim-title">잠깐, 비슷한 질문이 이미 있어요</div>
                <div className="sim-sub muted">전송 전에 한 번 확인해보세요. 같은 답변이면 바로 해결돼요.</div>
              </div>
              <button className="pill ghost icon-btn small" onClick={() => setShowSimilar(false)}>✕</button>
            </div>
            <div className="sim-list">
              <div className="sim-item">
                <div className="sim-q">"과제 2번 데이터 파일 위치는요?"</div>
                <div className="sim-a">→ 강의 사이트 → 강의자료 → "과제2_data.csv" 폴더에 있어요.</div>
                <div className="sim-meta">5명이 같은 질문 · 3일 전 답변</div>
              </div>
              <div className="sim-item">
                <div className="sim-q">"과제 데이터 사이즈가 너무 큰데요?"</div>
                <div className="sim-a">→ 분석용 축소 버전 제공 예정 (이번 주 내 업로드).</div>
                <div className="sim-meta">2명이 같은 질문 · 1일 전 답변</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

window.AskScreen = AskScreen;
