// Student mypage — stamps, badges, level summary

function MypageScreen({ onNav, charStyle, palette }) {
  const courses = window.MOCK.COURSES;
  const badges = window.MOCK.BADGES;
  const stamps = window.MOCK.STAMP_DAYS;

  const totalAffinity = courses.reduce((a, c) => a + c.professor.affinityLevel, 0);
  const avgAffinity = (totalAffinity / courses.length).toFixed(1);

  return (
    <div className="mypage">
      <TopBar title="마이페이지" subtitle="이번 학기 캠퍼스 발자국을 확인해보세요" />

      <div className="mp-grid">
        {/* Identity card */}
        <Card className="me-id-card">
          <div className="me-id-top">
            <Character animal="rabbit" hue={200} size={88} style={charStyle} />
            <div>
              <div className="mei-name">아기사자</div>
              <div className="mei-sub">경영학과 22학번 · 4학기차</div>
              <div className="mei-row">
                <span className="mei-pill">Lv.{Math.round(avgAffinity * 2)} 평균</span>
                <span className="mei-pill">14일 연속 출석</span>
              </div>
            </div>
          </div>
          <div className="me-id-stats">
            <div><div className="mis-num">128</div><div className="mis-lab">누적 질문</div></div>
            <div><div className="mis-num">{badges.filter(b => b.achieved).length}/{badges.length}</div><div className="mis-lab">획득 뱃지</div></div>
            <div><div className="mis-num">{avgAffinity}</div><div className="mis-lab">평균 호감도</div></div>
            <div><div className="mis-num">6</div><div className="mis-lab">키우는 캐릭터</div></div>
          </div>
        </Card>

        {/* Stamp calendar */}
        <Card className="stamp-card">
          <div className="card-head">
            <h3>이번 달 출석 스탬프</h3>
            <span className="muted">5월 · 21/28일 출석</span>
          </div>
          <div className="stamp-grid">
            {['월','화','수','목','금','토','일'].map(d => <div key={d} className="stamp-d">{d}</div>)}
            {stamps.map((s, i) => (
              <div key={i} className={`stamp-cell ${s === 'today' ? 'today' : s === 'star' ? 'star' : s === true ? 'done' : s === null ? 'future' : 'miss'}`}>
                {s === 'star' ? '★' : s === 'today' ? '오늘' : s === true ? '✓' : s === null ? '' : '·'}
              </div>
            ))}
          </div>
        </Card>

        {/* Affinity per course */}
        <Card className="aff-card">
          <h3>수업별 호감도</h3>
          <div className="aff-list">
            {courses.sort((a,b) => b.affinity - a.affinity).map(c => (
              <div key={c.id} className="aff-row">
                <Character animal={c.professor.animalKey} hue={c.professor.hue} size={36} style={charStyle} />
                <div className="aff-info">
                  <div className="aff-top">
                    <span className="aff-name">{c.name}</span>
                    <span className="aff-lvl">Lv.{c.professor.affinityLevel}</span>
                  </div>
                  <LevelBar value={c.professor.affinityProgress} color={c.color} />
                </div>
                <button className="pill ghost small" onClick={() => onNav('profile', c.id)}>보기</button>
              </div>
            ))}
          </div>
        </Card>

        {/* Badges */}
        <Card className="badge-card">
          <div className="card-head">
            <h3>뱃지</h3>
            <span className="muted">{badges.filter(b => b.achieved).length} / {badges.length} 획득</span>
          </div>
          <div className="badge-grid">
            {badges.map(b => (
              <div key={b.id} className={`badge ${b.achieved ? 'on' : 'off'}`}>
                <div className="badge-icon">{b.icon}</div>
                <div className="badge-name">{b.name}</div>
                <div className="badge-desc">{b.desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

window.MypageScreen = MypageScreen;
