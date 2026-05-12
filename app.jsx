// Main app — router between screens

const { useState: useStateApp } = React;

const PALETTES = {
  warm: {
    name: '따뜻한 화이트',
    bg: '#FFF8F0',
    surface: '#FFFFFF',
    text: '#2A2622',
    muted: '#8B8174',
    line: '#EDE5D7',
    softLine: '#F5EEDF',
    primary: '#9BC4A0',
    primaryDark: '#6E9C75',
    secondary: '#F2C57C',
    accent: '#FF9B85',
    aiBubble: '#E8EEF7',
    aiAccent: '#7DA9F7',
  },
  forest: {
    name: '대나무 숲',
    bg: '#F2F6F0',
    surface: '#FFFFFF',
    text: '#1F2A20',
    muted: '#6F7B6F',
    line: '#E1EADF',
    softLine: '#EBF1E8',
    primary: '#5E9B6E',
    primaryDark: '#3E7B4E',
    secondary: '#E8C36A',
    accent: '#E08866',
    aiBubble: '#EAF1EC',
    aiAccent: '#5BA678',
  },
  cream: {
    name: '크림 베이지',
    bg: '#FAF6EE',
    surface: '#FFFFFF',
    text: '#2E2820',
    muted: '#8A7E6A',
    line: '#EDE3CF',
    softLine: '#F4ECD9',
    primary: '#D9A45B',
    primaryDark: '#A77933',
    secondary: '#A8C49E',
    accent: '#D87A5F',
    aiBubble: '#F1ECE2',
    aiAccent: '#A6916F',
  },
  cool: {
    name: '쿨 미니멀',
    bg: '#F6F7FA',
    surface: '#FFFFFF',
    text: '#1F2530',
    muted: '#7B8595',
    line: '#E4E8EF',
    softLine: '#EEF1F6',
    primary: '#7DA9F7',
    primaryDark: '#4F7BD0',
    secondary: '#F2C57C',
    accent: '#FF9B85',
    aiBubble: '#EFF3FB',
    aiAccent: '#7DA9F7',
  },
};

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "warm",
  "charStyle": "soft"
}/*EDITMODE-END*/;

const paletteOptions = [
  ['#FFF8F0', '#9BC4A0', '#F2C57C', '#FF9B85'],
  ['#F2F6F0', '#5E9B6E', '#E8C36A', '#E08866'],
  ['#FAF6EE', '#D9A45B', '#A8C49E', '#D87A5F'],
  ['#F6F7FA', '#7DA9F7', '#F2C57C', '#FF9B85'],
];

function App() {
  const [tweaks, setTweak] = useTweaks(DEFAULTS);
  const palette = PALETTES[tweaks.palette] || PALETTES.warm;
  const charStyle = tweaks.charStyle;

  const [timetableSource, setTimetableSource] = useStateApp(() => window.TIMETABLE_IMPORT.loadImported());
  const [screen, setScreen] = useState('home');
  const [activeCourseId, setActiveCourseId] = useState('biz-stat');
  const activeMock = React.useMemo(() => window.TIMETABLE_IMPORT.applyImported(timetableSource), [timetableSource]);
  window.MOCK = activeMock;

  React.useEffect(() => {
    if (!window.MOCK.COURSES.some(course => course.id === activeCourseId)) {
      setActiveCourseId(window.MOCK.COURSES[0] ? window.MOCK.COURSES[0].id : '');
    }
  }, [activeCourseId, timetableSource]);

  function nav(s, id) {
    setScreen(s);
    if (id) setActiveCourseId(id);
  }

  function pickCourse(id) {
    if (id) {
      setActiveCourseId(id);
      setScreen('chat');
    } else {
      setScreen('home');
    }
  }

  function applyTimetableSource(source) {
    if (source) {
      window.TIMETABLE_IMPORT.saveImported(source);
    } else {
      window.TIMETABLE_IMPORT.clearImported();
    }
    setTimetableSource(source);
  }

  // Apply CSS vars from palette
  const cssVars = {
    '--bg': palette.bg,
    '--surface': palette.surface,
    '--text': palette.text,
    '--muted': palette.muted,
    '--line': palette.line,
    '--soft-line': palette.softLine,
    '--primary': palette.primary,
    '--primary-dark': palette.primaryDark,
    '--secondary': palette.secondary,
    '--accent': palette.accent,
    '--ai-bubble': palette.aiBubble,
    '--ai-accent': palette.aiAccent,
  };

  return (
    <div className="app" style={cssVars}>
      <Sidebar active={screen} onNav={s => setScreen(s)} charStyle={charStyle} palette={palette} />
      <main className="main" data-screen-label={screen}>
        {screen === 'home' && (
          <HomeScreen
            onNav={nav}
            onPickCourse={pickCourse}
            charStyle={charStyle}
            palette={palette}
            timetableSource={timetableSource}
            onTimetableSourceChange={applyTimetableSource}
          />
        )}
        {screen === 'chat' && <ChatScreen courseId={activeCourseId} onPickCourse={pickCourse} charStyle={charStyle} palette={palette} />}
        {screen === 'profile' && <ProfileScreen courseId={activeCourseId} onPickCourse={(id) => setActiveCourseId(id || activeCourseId)} onNav={nav} charStyle={charStyle} palette={palette} />}
        {screen === 'ask' && <AskScreen onNav={nav} charStyle={charStyle} palette={palette} />}
        {screen === 'faq' && <FaqScreen onNav={nav} charStyle={charStyle} palette={palette} />}
        {screen === 'mypage' && <MypageScreen onNav={nav} charStyle={charStyle} palette={palette} />}
        {screen === 'professor' && <ProfessorScreen onNav={nav} charStyle={charStyle} palette={palette} />}
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="컬러 팔레트">
          <TweakColor
            label="전체 팔레트"
            value={paletteOptions[Object.keys(PALETTES).indexOf(tweaks.palette)]}
            options={paletteOptions}
            onChange={(opt) => {
              const idx = paletteOptions.findIndex(p => p === opt);
              const key = Object.keys(PALETTES)[idx] || 'warm';
              setTweak('palette', key);
            }}
          />
          <div className="t-note">{palette.name}</div>
        </TweakSection>
        <TweakSection label="캐릭터 스타일">
          <TweakRadio
            label="동물 캐릭터"
            value={tweaks.charStyle}
            options={[
              { value: 'soft', label: '동물 얼굴' },
              { value: 'placeholder', label: '자리표시자' },
            ]}
            onChange={(v) => setTweak('charStyle', v)}
          />
          <div className="t-note">"자리표시자"는 일러스트 자리를 모노스페이스 라벨로 표시</div>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
