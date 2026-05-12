// Professor character profile + affinity (키우기) screen

function ProfileScreen({ courseId, onPickCourse, onNav, charStyle, palette }) {
  const courses = window.MOCK.COURSES;
  const course = courses.find(c => c.id === courseId) || courses[0];
  const prof = course.professor;
  const [bouncing, setBouncing] = useState(false);

  const milestones = [
    { lv: 1, label: '첫 만남', reward: '인사 카드' },
    { lv: 2, label: '말 트기', reward: '캐릭터 인사말 해금' },
    { lv: 3, label: '익숙해지기', reward: '연구실 위치 안내' },
    { lv: 4, label: '신뢰', reward: '식사 약속 가능' },
    { lv: 5, label: '단골 학생', reward: '학기 회고 편지' },
    { lv: 7, label: '제자', reward: '추천서 요청 가능' },
  ];

  const actions = [
    { name: '질문하기', gain: '+8', desc: '대화방에서 질문 남기기' },
    { name: 'AI 답변 확인하기', gain: '+2', desc: '교수님 답변 다 읽기' },
    { name: '과제 제출하기', gain: '+15', desc: '마감 24시간 전 제출 시 +5 보너스' },
    { name: '복습 카드 풀기', gain: '+5', desc: '강의 자료 요약 카드 풀기' },
    { name: '식사 약속 신청', gain: '+25', desc: 'Lv.4 이상부터 가능' },
  ];

  return (
    <div className="profile-screen">
      <TopBar
        title="교수 캐릭터"
        subtitle="학습 행동을 쌓으면 교수님과의 호감도가 올라가요"
        right={<button className="pill ghost" onClick={() => onNav('home')}>{Icon.back} 시간표로</button>}
      />

      {/* Character course tabs */}
      <div className="char-tabs">
        {courses.map(c => (
          <button
            key={c.id}
            className={`char-tab ${c.id === course.id ? 'active' : ''}`}
            onClick={() => onPickCourse(c.id)}
          >
            <Character animal={c.professor.animalKey} hue={c.professor.hue} size={32} style={charStyle} />
            <div>
              <div className="cht-name">{c.professor.name}</div>
              <div className="cht-sub">Lv.{c.professor.affinityLevel}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="profile-grid">
        {/* Big character card */}
        <Card className="big-char" style={{ '--accent': course.color }}>
          <div className="bc-bg">
            <div className="bc-cloud"></div>
            <div className="bc-cloud bc-cloud-2"></div>
            <div className="bc-ground" style={{ background: course.color + '33' }}></div>
          </div>
          <div className={`bc-char ${bouncing ? 'bounce' : ''}`} onClick={() => { setBouncing(true); setTimeout(() => setBouncing(false), 700); }}>
            <Character animal={prof.animalKey} hue={prof.hue} size={180} style={charStyle} mood="happy" />
          </div>
          <div className="bc-speech">{prof.bio}</div>
          <div className="bc-name">
            <span className="bc-animal">{prof.animal}</span>
            <span className="bc-real">{prof.name} {prof.title}</span>
          </div>
          <div className="bc-course">{course.name} · {course.code}</div>
          <div className="bc-affinity">
            <div className="bc-aff-head">
              <span>Lv.{prof.affinityLevel}</span>
              <span className="muted">{prof.affinityProgress} / {prof.nextLevelAt}</span>
              <span>Lv.{prof.affinityLevel + 1}</span>
            </div>
            <LevelBar value={prof.affinityProgress} color={course.color} />
            <div className="bc-aff-next">다음 레벨까지 {prof.nextLevelAt - prof.affinityProgress}점 · 질문 4번이면 닿아요</div>
          </div>
        </Card>

        {/* Actions to grow affinity */}
        <Card className="actions-card">
          <h3>호감도가 오르는 행동</h3>
          <div className="actions">
            {actions.map(a => (
              <div key={a.name} className="action-row">
                <div>
                  <div className="ar-name">{a.name}</div>
                  <div className="ar-desc">{a.desc}</div>
                </div>
                <span className="ar-gain" style={{ color: course.color }}>{a.gain}</span>
              </div>
            ))}
          </div>
          <button className="pill primary big" style={{ background: course.color }} onClick={() => onNav('ask')}>
            지금 질문하기 {Icon.arrow}
          </button>
        </Card>

        {/* Milestones */}
        <Card className="milestones-card">
          <h3>레벨별 보상</h3>
          <div className="milestones">
            {milestones.map(m => {
              const achieved = m.lv <= prof.affinityLevel;
              const current = m.lv === prof.affinityLevel;
              return (
                <div key={m.lv} className={`milestone ${achieved ? 'achieved' : ''} ${current ? 'current' : ''}`}>
                  <div className="ms-lv" style={{ background: achieved ? course.color : undefined }}>Lv.{m.lv}</div>
                  <div className="ms-info">
                    <div className="ms-label">{m.label}</div>
                    <div className="ms-reward">{m.reward}</div>
                  </div>
                  {achieved && <span className="ms-check">✓</span>}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Meal / consultation invite */}
        <Card className="meal-card" style={{ background: `linear-gradient(135deg, ${course.color}11, ${course.color}22)` }}>
          <div className="meal-icon">🍱</div>
          <h3>식사 / 가벼운 상담 신청</h3>
          <p>호감도 Lv.4 이상이 되면 교수님께 가벼운 식사나 상담을 신청할 수 있어요. 정중한 신청서를 AI가 함께 다듬어줘요.</p>
          {prof.affinityLevel >= 4 ? (
            <button className="pill primary" style={{ background: course.color }}>식사 시간 제안하기</button>
          ) : (
            <button className="pill disabled" disabled>Lv.{4 - prof.affinityLevel}만 더 올리면 열려요</button>
          )}
        </Card>
      </div>
    </div>
  );
}

window.ProfileScreen = ProfileScreen;
