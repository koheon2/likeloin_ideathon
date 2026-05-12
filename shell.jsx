// Shared UI primitives and app shell for 대나무의숲

const { useState, useEffect, useRef, useMemo } = React;

// ============== Icons (tiny inline SVGs, only basic strokes) ==============
const Icon = {
  home: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9"/></svg>,
  chat: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8 8 0 11-3.5 6.6L4 20l1.4-3.6A8 8 0 0121 12z"/></svg>,
  heart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 8.2a5.5 5.5 0 00-9.3-2.7A5.5 5.5 0 002.2 9.7C2.2 16 12 21 12 21s9.8-5 9.8-11.3c0-.5 0-1-.2-1.5z"/></svg>,
  edit: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h4l11-11-4-4L4 16v4z"/><path d="M14 6l4 4"/></svg>,
  search: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>,
  chart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/></svg>,
  user: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg>,
  bamboo: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3v3M14 3v3M9 8h6v3H9zM9 13h6v3H9zM9 18h6v3H9z"/><path d="M16 9c2 0 3-1 3-3"/><path d="M8 14c-2 0-3-1-3-3"/></svg>,
  send: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 11l18-8-8 18-2-8-8-2z"/></svg>,
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  spark: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6z"/></svg>,
  arrow: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>,
  back: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  bell: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 1112 0c0 7 3 7 3 9H3c0-2 3-2 3-9z"/><path d="M10 21a2 2 0 004 0"/></svg>,
};

// ============== App shell with sidebar navigation ==============
const NAV = [
  { id: 'home', label: '홈 · 시간표', icon: Icon.home },
  { id: 'chat', label: '수업방', icon: Icon.chat },
  { id: 'profile', label: '교수 캐릭터', icon: Icon.heart },
  { id: 'ask', label: '질문하기', icon: Icon.edit },
  { id: 'faq', label: '이미 나온 질문', icon: Icon.search },
  { id: 'mypage', label: '내 마이페이지', icon: Icon.user },
  { id: 'professor', label: '교수 뷰', icon: Icon.chart },
];

function Sidebar({ active, onNav, charStyle, palette }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon" style={{ background: palette.primary }}>
          {Icon.bamboo}
        </div>
        <div>
          <div className="brand-name">대나무의숲</div>
          <div className="brand-sub">캠퍼스 AI 소통</div>
        </div>
      </div>

      <nav className="nav">
        {NAV.map(item => (
          <button
            key={item.id}
            className={`nav-item ${active === item.id ? 'active' : ''}`}
            onClick={() => onNav(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.id === 'chat' && <span className="nav-badge">9</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="me-card">
          <Character animal="rabbit" hue={200} size={40} style={charStyle} />
          <div>
            <div className="me-name">아기사자</div>
            <div className="me-sub">경영학과 · 22학번</div>
          </div>
        </div>
        <div className="me-stats">
          <div>
            <div className="ms-num">Lv.7</div>
            <div className="ms-lab">평균 호감도</div>
          </div>
          <div>
            <div className="ms-num">128</div>
            <div className="ms-lab">누적 질문</div>
          </div>
          <div>
            <div className="ms-num">14</div>
            <div className="ms-lab">연속 출석</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ title, subtitle, right }) {
  return (
    <header className="topbar">
      <div>
        <h1 className="topbar-title">{title}</h1>
        {subtitle && <div className="topbar-sub">{subtitle}</div>}
      </div>
      <div className="topbar-right">{right}</div>
    </header>
  );
}

// ============== Reusable: rounded card, pill button, level bar ==============
function Card({ children, className = '', style }) {
  return <div className={`card ${className}`} style={style}>{children}</div>;
}

function LevelBar({ value, max = 100, color }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="lvbar">
      <div className="lvbar-fill" style={{ width: `${pct}%`, background: color }}></div>
    </div>
  );
}

function CharacterTag({ course, size = 32, charStyle }) {
  return (
    <div className="char-tag">
      <Character animal={course.professor.animalKey} hue={course.professor.hue} size={size} style={charStyle} />
      <div>
        <div className="ct-name">{course.professor.name} {course.professor.title}</div>
        <div className="ct-sub">{course.name}</div>
      </div>
    </div>
  );
}

Object.assign(window, { Icon, NAV, Sidebar, TopBar, Card, LevelBar, CharacterTag });
