// Home / today's timetable screen

const { useState: useStateHome } = React;

function HomeScreen({ onNav, onPickCourse, charStyle, palette, timetableSource, onTimetableSourceChange }) {
  const courses = window.MOCK.COURSES;
  const days = window.MOCK.DAYS;
  const hours = window.MOCK.HOURS;
  const [importUrl, setImportUrl] = useStateHome('');
  const [importState, setImportState] = useStateHome({ status: 'idle', message: '' });

  // Build day -> [{course, startRow, span}] map
  const gridSlots = useMemo(() => {
    const slots = [];
    const firstHour = parseInt(hours[0], 10) || 9;
    courses.forEach(c => {
      c.schedule.forEach(s => {
        const startH = parseInt(s.start.split(':')[0], 10);
        const startM = parseInt(s.start.split(':')[1], 10);
        const endH = parseInt(s.end.split(':')[0], 10);
        const endM = parseInt(s.end.split(':')[1], 10);
        const startStep = Math.floor((startM || 0) / 30);
        const endStep = Math.ceil((endM || 0) / 30);
        const startRow = (startH - firstHour) * 2 + startStep + 2; // header row offset
        const endRow = (endH - firstHour) * 2 + endStep + 2;
        const dayCol = days.indexOf(s.day) + 2;
        if (dayCol > 1 && endRow > startRow) {
          slots.push({ course: c, dayCol, startRow, endRow });
        }
      });
    });
    return slots;
  }, [courses, days, hours]);

  const today = '월';
  const todaysCourses = courses.filter(c => c.schedule.some(s => s.day === today));
  const timetableGridStyle = {
    gridTemplateColumns: `56px repeat(${days.length}, minmax(0, 1fr))`,
    gridTemplateRows: `32px repeat(${hours.length * 2}, 24px)`,
  };

  async function importEverytime() {
    try {
      setImportState({ status: 'loading', message: '시간표를 가져오는 중이에요.' });
      const identifier = window.TIMETABLE_IMPORT.extractIdentifier(importUrl);
      const response = await fetch('/api/everytime-timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error('에브리타임 시간표를 가져오지 못했어요.');
      }
      const parsed = window.TIMETABLE_IMPORT.parseEverytimeXml(payload.xml);
      const source = {
        type: 'everytime',
        identifier,
        importedAt: new Date().toISOString(),
        courses: parsed.courses,
        meta: parsed.meta,
      };
      onTimetableSourceChange(source);
      setImportState({ status: 'success', message: `${parsed.courses.length}개 수업을 적용했어요.` });
    } catch (error) {
      setImportState({
        status: 'error',
        message: error && error.message ? error.message : '시간표를 가져오지 못했어요.',
      });
    }
  }

  function resetTimetable() {
    onTimetableSourceChange(null);
    setImportUrl('');
    setImportState({ status: 'idle', message: '기본 목업 시간표로 되돌렸어요.' });
  }

  return (
    <div className="home">
      <TopBar
        title="안녕하세요, 아기사자님 🌿"
        subtitle={`오늘은 5월 12일 월요일이에요. 수업 ${todaysCourses.length}개가 기다리고 있어요.`}
        right={<button className="pill ghost">{Icon.bell}</button>}
      />

      <Card className="import-card">
        <div className="import-copy">
          <h2>에브리타임 시간표 가져오기</h2>
          <div className="import-sub">
            공유 URL을 넣으면 수업명, 교수명, 시간, 강의실을 현재 시간표에 적용해요.
          </div>
          {timetableSource && (
            <div className="import-current">
              적용 중: {timetableSource.courses.length}개 수업
              {timetableSource.meta && timetableSource.meta.year ? ` · ${timetableSource.meta.year}-${timetableSource.meta.semester}` : ''}
            </div>
          )}
        </div>
        <div className="import-form">
          <input
            className="import-input"
            placeholder="https://everytime.kr/@TZXBJe5V4sDJkwDb8pNO"
            value={importUrl}
            onChange={event => setImportUrl(event.target.value)}
            onKeyDown={event => { if (event.key === 'Enter') importEverytime(); }}
          />
          <button className="pill primary import-submit" onClick={importEverytime} disabled={importState.status === 'loading'}>
            {importState.status === 'loading' ? '가져오는 중' : '적용'}
          </button>
          {timetableSource && (
            <button className="pill ghost import-reset" onClick={resetTimetable}>초기화</button>
          )}
        </div>
        {importState.message && (
          <div className={`import-message ${importState.status}`}>{importState.message}</div>
        )}
      </Card>

      {/* Today's courses row */}
      <section className="today">
        <div className="section-head">
          <h2>오늘의 수업</h2>
          <span className="muted">월요일</span>
        </div>
        <div className="today-grid">
          {todaysCourses.length === 0 && (
            <Card className="today-empty">
              <div className="empty-emoji">✓</div>
              <div>오늘 등록된 수업이 없어요.</div>
            </Card>
          )}
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
          <div className="tt-grid" style={timetableGridStyle}>
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
