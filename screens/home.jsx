// Home / today's timetable screen

const { useState: useStateHome } = React;

function HomeScreen({ onNav, onPickCourse, charStyle, palette }) {
  const courses = window.MOCK.COURSES;
  const days = window.MOCK.DAYS;
  const hours = window.MOCK.HOURS;

  // Build day -> [{course, startRow, span}] map
  const gridSlots = useMemo(() => {
    const slots = [];
    courses.forEach(c => {
      c.schedule.forEach(s => {
        const startH = parseInt(s.start.split(':')[0], 10);
        const startM = parseInt(s.start.split(':')[1], 10);
        const endH = parseInt(s.end.split(':')[0], 10);
        const endM = parseInt(s.end.split(':')[1], 10);
        const startRow = (startH - 9) * 2 + (startM === 30 ? 1 : 0) + 2; // header row offset
        const endRow = (endH - 9) * 2 + (endM === 30 ? 1 : 0) + 2;
        const dayCol = days.indexOf(s.day) + 2;
        slots.push({ course: c, dayCol, startRow, endRow });
      });
    });
    return slots;
  }, [courses, days]);

  const today = '월';
  const todaysCourses = courses.filter(c => c.schedule.some(s => s.day === today));

  return (
    <div className="home">
      <TopBar
        title="안녕하세요, 민서님 🌿"
        subtitle="오늘은 5월 12일 월요일이에요. 수업 3개가 기다리고 있어요."
        right={<button className="pill ghost">{Icon.bell}</button>}
      />

      {/* Today's courses row */}
      <section className="today">
        <div className="section-head">
          <h2>오늘의 수업</h2>
          <span className="muted">월요일</span>
        </div>
        <div className="today-grid">
          {todaysCourses.map(c => (
            <Card key={c.id} className="today-card" style={{ '--accent': c.color }}>
              <div className="tc-time">{c.schedule.find(s => s.day === today).start}</div>
              <div className="tc-character">
                <Character animal={c.professor.animalKey} hue={c.professor.hue} size={56} style={charStyle} />
              </div>
              <div className="tc-name">{c.name}</div>
              <div className="tc-prof">{c.professor.name} {c.professor.title}</div>
              <div className="tc-loc">📍 {c.location}</div>
              <div className="tc-row">
                <div className="tc-affinity">
                  <span className="aff-label">호감도 Lv.{c.professor.affinityLevel}</span>
                  <LevelBar value={c.professor.affinityProgress} color={c.color} />
                </div>
              </div>
              <div className="tc-actions">
                <button className="pill primary" onClick={() => onPickCourse(c.id)} style={{ background: c.color }}>
                  수업방 입장
                  {c.unread > 0 && <span className="dot-badge">{c.unread}</span>}
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Weekly timetable grid */}
      <section className="week">
        <div className="section-head">
          <h2>이번 주 시간표</h2>
          <div className="legend">
            <span className="legend-item"><span className="dot" style={{background: palette.primary}}></span>가입한 교수</span>
            <span className="legend-item"><span className="dot dot-ai"></span>AI 임시 답변</span>
          </div>
        </div>
        <Card className="ttable">
          <div className="tt-grid">
            <div></div>
            {days.map(d => <div key={d} className="tt-day">{d}</div>)}
            {hours.map((h, i) => (
              <React.Fragment key={h}>
                <div className="tt-hour" style={{ gridRow: i * 2 + 2 + ' / span 2' }}>{h}</div>
              </React.Fragment>
            ))}
            {gridSlots.map((slot, i) => (
              <button
                key={i}
                className="tt-block"
                style={{
                  gridColumn: slot.dayCol,
                  gridRow: `${slot.startRow} / ${slot.endRow}`,
                  background: slot.course.color + '22',
                  borderLeft: `3px solid ${slot.course.color}`,
                }}
                onClick={() => onPickCourse(slot.course.id)}
              >
                <div className="ttb-name">{slot.course.name}</div>
                <div className="ttb-meta">
                  <Character animal={slot.course.professor.animalKey} hue={slot.course.professor.hue} size={20} style={charStyle} />
                  <span>{slot.course.professor.name}</span>
                </div>
                {!slot.course.professor.joined && <div className="ttb-tag">AI</div>}
              </button>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

window.HomeScreen = HomeScreen;
