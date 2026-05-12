// FAQ search — previously-asked questions across courses

function FaqScreen({ onNav, charStyle, palette }) {
  const courses = window.MOCK.COURSES;
  const faqs = window.MOCK.FAQ_QUESTIONS;
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const courseById = courses.reduce((map, course) => {
    map[course.id] = course;
    return map;
  }, {});

  const filtered = faqs.filter(f =>
    courseById[f.courseId] &&
    (filter === 'all' || f.courseId === filter) &&
    (!query || f.text.toLowerCase().includes(query.toLowerCase()) || f.answer.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="faq-screen">
      <TopBar title="이미 나온 질문" subtitle="질문하기 전, 같은 질문이 있었는지 한 번 보기" />

      <Card className="search-card">
        <div className="search-bar">
          <span className="search-icon">{Icon.search}</span>
          <input
            placeholder="궁금한 키워드로 검색 — 예: '시험', '발제', '데이터 위치'"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="filter-pills">
          <button className={`fp ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>전체</button>
          {courses.map(c => (
            <button
              key={c.id}
              className={`fp ${filter === c.id ? 'on' : ''}`}
              onClick={() => setFilter(c.id)}
              style={filter === c.id ? { background: c.color + '22', borderColor: c.color } : null}
            >
              <Character animal={c.professor.animalKey} hue={c.professor.hue} size={20} style={charStyle} />
              {c.name}
            </button>
          ))}
        </div>
      </Card>

      <div className="faq-list">
        {filtered.map(f => {
          const c = courseById[f.courseId];
          const open = expanded === f.id;
          return (
            <Card key={f.id} className={`faq-item ${open ? 'open' : ''}`} style={{ '--accent': c.color }}>
              <button className="faq-q" onClick={() => setExpanded(open ? null : f.id)}>
                <span className="faq-tag" style={{ background: c.color + '22', color: c.color }}>{c.name}</span>
                <span className="faq-text">{f.text}</span>
                <span className="faq-meta">
                  <span>{f.asked}명 질문</span>
                  <span>·</span>
                  <span>{f.daysAgo}일 전</span>
                </span>
              </button>
              {open && (
                <div className="faq-a">
                  <Character animal={c.professor.animalKey} hue={c.professor.hue} size={36} style={charStyle} />
                  <div>
                    <div className="faq-a-from">{c.professor.name} {c.professor.title}의 답변</div>
                    <div className="faq-a-text">{f.answer}</div>
                    <div className="faq-a-actions">
                      <button className="pill ghost small">도움 됐어요 👍</button>
                      <button className="pill ghost small">대화방에서 이어 질문</button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="empty">
            <div className="empty-emoji">🌿</div>
            <div>{query ? `"${query}"에 대한 질문이 아직 없어요.` : '가져온 시간표에는 아직 쌓인 질문이 없어요.'}</div>
            <button className="pill primary" onClick={() => onNav('ask')}>그럼 내가 처음 물어볼까요?</button>
          </div>
        )}
      </div>
    </div>
  );
}

window.FaqScreen = FaqScreen;
