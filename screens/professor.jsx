// Professor dashboard — question stats, participation, repeated questions

function ProfessorScreen({ onNav, charStyle, palette }) {
  const s = window.MOCK.PROF_STATS;
  const courses = window.MOCK.COURSES;
  const course = courses.find(c => c.name === s.course);
  const maxPart = Math.max(...s.participation.map(p => p.value));

  return (
    <div className="prof-screen">
      <TopBar
        title="교수 뷰 · 대시보드"
        subtitle="질문 패턴과 참여도를 확인해 반복 질문 부담을 줄여보세요"
        right={
          <div className="role-toggle">
            <button className="rt active">교수 뷰</button>
            <button className="rt" onClick={() => onNav('home')}>학생 뷰</button>
          </div>
        }
      />

      <div className="prof-head-card">
        <Character animal={course.professor.animalKey} hue={course.professor.hue} size={64} style={charStyle} />
        <div>
          <div className="phc-course">{s.course}</div>
          <div className="phc-meta">학생 {s.students}명 · 이번 주 질문 {s.weeklyQuestions}건 (지난 주 대비 +{s.weeklyDelta})</div>
        </div>
        <div className="phc-actions">
          <select className="select"><option>{s.course}</option><option>유기화학</option><option>경영전략</option></select>
          <button className="pill ghost">주차 변경</button>
        </div>
      </div>

      <div className="prof-grid">
        {/* KPI tiles */}
        <Card className="kpi"><div className="kpi-lab">이번 주 질문</div><div className="kpi-num">{s.weeklyQuestions}</div><div className="kpi-delta up">▲ +{s.weeklyDelta} 지난주 대비</div></Card>
        <Card className="kpi"><div className="kpi-lab">반복 질문 비율</div><div className="kpi-num">{s.repeatedRate}%</div><div className="kpi-delta down">AI가 자동 답변 처리</div></Card>
        <Card className="kpi"><div className="kpi-lab">평균 응답 시간</div><div className="kpi-num">{s.avgResponseTime}</div><div className="kpi-delta">학과 평균보다 빠름</div></Card>
        <Card className="kpi"><div className="kpi-lab">호감도 평균</div><div className="kpi-num">Lv.4.2</div><div className="kpi-delta up">▲ 0.6 학기 시작 대비</div></Card>

        {/* Participation chart */}
        <Card className="part-card">
          <div className="card-head">
            <h3>주차별 학생 참여도</h3>
            <span className="muted">질문 + 답변 확인 + 복습 합계</span>
          </div>
          <div className="bars">
            {s.participation.map(p => (
              <div key={p.week} className="bar-wrap">
                <div className="bar" style={{ height: `${(p.value / maxPart) * 100}%`, background: course.color }}>
                  <span className="bar-num">{p.value}</span>
                </div>
                <div className="bar-lab">{p.week}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top questions */}
        <Card className="topq-card">
          <div className="card-head">
            <h3>이번 주 자주 나온 질문</h3>
            <button className="pill ghost small">모두 보기</button>
          </div>
          <div className="topq-list">
            {s.topQuestions.map((q, i) => (
              <div key={i} className="topq-row">
                <div className="topq-rank">{i + 1}</div>
                <div className="topq-text">{q.text}</div>
                <div className="topq-count">{q.count}명</div>
                <div className={`topq-status ${q.status === '답변 필요' ? 'urgent' : q.status === 'AI가 안내함' ? 'ai' : 'done'}`}>{q.status}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Repeated-question insights */}
        <Card className="insight-card">
          <h3>이번 주 인사이트</h3>
          <div className="insights">
            <div className="ins-row">
              <span className="ins-tag" style={{ background: '#9BC4A033', color: '#5E8064' }}>강의 보완</span>
              <span>학생 9명이 "회귀분석 가정 4가지"를 헷갈려해요. 다음 강의 도입부 5분 정리 추천.</span>
            </div>
            <div className="ins-row">
              <span className="ins-tag" style={{ background: '#F2C57C33', color: '#A07A2C' }}>참여 정체</span>
              <span>3분반 7명이 최근 2주간 질문이 없어요. 가벼운 안내 메시지를 보내볼까요?</span>
            </div>
            <div className="ins-row">
              <span className="ins-tag" style={{ background: '#FF9B8533', color: '#B85A48' }}>긴급</span>
              <span>"과제2 데이터 위치" 질문 5건이 답변 대기 중이에요.</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

window.ProfessorScreen = ProfessorScreen;
