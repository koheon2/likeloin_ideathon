// Animal Crossing-tone character placeholder: simple geometric face
// Built from circles only — face, ears, eyes, nose. No SVG illustration work.

function AnimalAvatar({ animal = 'bear', hue = 30, size = 64, style = 'soft', mood = 'happy', ringed = false }) {
  // Each animal differs only in ear shape and small accent geometry,
  // intentionally simple so they read as placeholders, not custom art.
  const cfg = {
    bear:     { earY: 8,  earSize: 18, earGap: 32, earShape: 'round', noseColor: '#3A2A1F' },
    rabbit:   { earY: -4, earSize: 12, earGap: 20, earShape: 'tall', noseColor: '#C76A6A' },
    fox:      { earY: 6,  earSize: 16, earGap: 36, earShape: 'tri', noseColor: '#3A2A1F' },
    penguin:  { earY: 14, earSize: 10, earGap: 30, earShape: 'flat', noseColor: '#E8A95A' },
    cat:      { earY: 4,  earSize: 14, earGap: 30, earShape: 'tri', noseColor: '#C76A6A' },
    raccoon:  { earY: 8,  earSize: 14, earGap: 32, earShape: 'round', noseColor: '#3A2A1F' },
  }[animal] || { earY: 8, earSize: 16, earGap: 32, earShape: 'round', noseColor: '#3A2A1F' };

  const s = size;
  const bg = `oklch(0.86 0.08 ${hue})`;
  const faceColor = `oklch(0.92 0.05 ${hue})`;
  const darkAccent = `oklch(0.45 0.08 ${hue})`;
  const ringColor = `oklch(0.78 0.12 ${hue})`;

  // Scale all internal positions to 64 baseline
  const k = s / 64;
  const px = (n) => `${n * k}px`;

  const earBase = {
    position: 'absolute',
    width: px(cfg.earSize),
    height: px(cfg.earSize),
    top: px(cfg.earY),
    background: faceColor,
    border: `${k * 2}px solid ${darkAccent}`,
    boxSizing: 'border-box',
  };

  const earShapeStyle =
    cfg.earShape === 'tall' ? { borderRadius: '50% 50% 40% 40%', height: px(cfg.earSize * 1.6), top: px(cfg.earY - 6) } :
    cfg.earShape === 'tri'  ? { borderRadius: '50% 50% 10% 50%', transform: 'rotate(-15deg)' } :
    cfg.earShape === 'flat' ? { borderRadius: '50% 50% 0 0', height: px(cfg.earSize * 0.6) } :
                              { borderRadius: '50%' };

  const eyeStyle = {
    position: 'absolute',
    width: px(5),
    height: px(7),
    borderRadius: '50%',
    background: darkAccent,
    top: '50%',
    transform: 'translateY(-30%)',
  };

  // Mask shape (raccoon) or cheek blush
  const accent = animal === 'raccoon' ? (
    <div style={{
      position: 'absolute',
      left: '15%', right: '15%',
      top: '42%', height: '22%',
      background: darkAccent, opacity: 0.4,
      borderRadius: '40%',
    }}></div>
  ) : animal === 'fox' ? (
    <div style={{
      position: 'absolute',
      left: '30%', right: '30%',
      bottom: '14%', height: '30%',
      background: '#FFFFFF', opacity: 0.7,
      borderRadius: '50%',
    }}></div>
  ) : null;

  return (
    <div style={{
      width: px(64), height: px(64),
      position: 'relative',
      flexShrink: 0,
      filter: ringed ? `drop-shadow(0 0 0 ${k*3}px ${ringColor})` : undefined,
    }}>
      {/* Left ear */}
      <div style={{ ...earBase, ...earShapeStyle, left: `calc(50% - ${px(cfg.earGap / 2 + cfg.earSize / 2)})` }}></div>
      {/* Right ear */}
      <div style={{ ...earBase, ...earShapeStyle, right: `calc(50% - ${px(cfg.earGap / 2 + cfg.earSize / 2)})`, transform: cfg.earShape === 'tri' ? 'rotate(15deg)' : undefined }}></div>
      {/* Face circle */}
      <div style={{
        position: 'absolute',
        inset: px(6),
        background: bg,
        border: `${k * 2.5}px solid ${darkAccent}`,
        borderRadius: '50%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}>
        {/* Inner face highlight (snout area) */}
        <div style={{
          position: 'absolute',
          left: '22%', right: '22%',
          bottom: '15%', height: '38%',
          background: faceColor,
          borderRadius: '50%',
        }}></div>
        {accent}
        {/* Eyes */}
        <div style={{ ...eyeStyle, left: '28%' }}></div>
        <div style={{ ...eyeStyle, right: '28%' }}></div>
        {/* Nose */}
        <div style={{
          position: 'absolute',
          left: '50%', top: '58%',
          transform: 'translateX(-50%)',
          width: px(7), height: px(5),
          background: cfg.noseColor,
          borderRadius: '50%',
        }}></div>
        {/* Mouth */}
        {mood === 'happy' && (
          <div style={{
            position: 'absolute',
            left: '50%', top: '68%',
            transform: 'translateX(-50%)',
            width: px(10), height: px(5),
            borderBottom: `${k*1.5}px solid ${darkAccent}`,
            borderRadius: '0 0 50% 50%',
          }}></div>
        )}
        {/* Cheek blush */}
        <div style={{ position: 'absolute', left: '15%', top: '60%', width: px(8), height: px(5), background: '#FF9B85', opacity: 0.5, borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', right: '15%', top: '60%', width: px(8), height: px(5), background: '#FF9B85', opacity: 0.5, borderRadius: '50%' }}></div>
      </div>
    </div>
  );
}

// "Placeholder pattern" variant — used when user explicitly wants the placeholder/wireframe look
function AnimalPlaceholder({ animal = 'bear', hue = 30, size = 64, label }) {
  const bg = `oklch(0.92 0.04 ${hue})`;
  const stripe = `oklch(0.85 0.06 ${hue})`;
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: `repeating-linear-gradient(135deg, ${bg} 0 6px, ${stripe} 6px 12px)`,
      border: `1.5px dashed oklch(0.55 0.08 ${hue})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
      fontSize: Math.max(9, size * 0.13),
      color: `oklch(0.40 0.08 ${hue})`,
      textAlign: 'center',
      flexShrink: 0,
    }}>
      {label || animal}
    </div>
  );
}

function Character({ animal, hue, size = 64, style, mood, ringed, label }) {
  if (style === 'placeholder') return <AnimalPlaceholder animal={animal} hue={hue} size={size} label={label} />;
  return <AnimalAvatar animal={animal} hue={hue} size={size} mood={mood} ringed={ringed} />;
}

Object.assign(window, { Character, AnimalAvatar, AnimalPlaceholder });
