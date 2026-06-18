import { useStore } from '../store/useStore';

interface TimePreset {
  label: string;
  scale: number;
}

const TIME_PRESETS: TimePreset[] = [
  { label: '0.1x', scale: 0.1 },
  { label: '1x', scale: 1 },
  { label: '10x', scale: 10 },
  { label: '30x', scale: 30 },
  { label: '100x', scale: 100 },
  { label: '365x', scale: 365 },
];

export function TimeControls() {
  const {
    simTimeDays,
    timeScale,
    paused,
    setTimeScale,
    togglePaused,
    resetTime,
  } = useStore();

  const formatTime = (days: number): string => {
    const absDays = Math.abs(Math.round(days));
    if (absDays < 365) {
      return `Dia ${absDays}`;
    }
    const years = (absDays / 365.25).toFixed(1);
    return `${years} anos`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'var(--space-4)',
        left: 'var(--space-4)',
        zIndex: 20,
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3)',
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-label)',
        color: 'var(--color-text-primary)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        minWidth: '240px',
      }}
    >
      {/* Play/Pause Button */}
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <button
          onClick={togglePaused}
          style={{
            flex: 1,
            padding: 'var(--space-2)',
            backgroundColor: paused
              ? 'var(--color-surface-2)'
              : 'var(--color-accent)',
            color: paused ? 'var(--color-text-primary)' : 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-label)',
            fontWeight: 600,
            transition: 'background-color 150ms, border-color 150ms',
          }}
          onMouseEnter={(e) => {
            if (!paused) {
              e.currentTarget.style.backgroundColor =
                'var(--color-accent-warm)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = paused
              ? 'var(--color-surface-2)'
              : 'var(--color-accent)';
          }}
        >
          {paused ? '▶ INICIAR' : '⏸ PAUSAR'}
        </button>

        <button
          onClick={resetTime}
          style={{
            padding: 'var(--space-2) var(--space-3)',
            backgroundColor: 'var(--color-surface-2)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-label)',
            fontWeight: 600,
            transition: 'background-color 150ms, border-color 150ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface-2)';
            e.currentTarget.style.borderColor = 'var(--color-accent-dim)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface-2)';
            e.currentTarget.style.borderColor = 'var(--color-border)';
          }}
        >
          ⟳ RESET
        </button>
      </div>

      {/* Speed Presets */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-1)',
        }}
      >
        {TIME_PRESETS.map((preset) => (
          <button
            key={preset.scale}
            onClick={() => setTimeScale(preset.scale)}
            style={{
              padding: 'var(--space-1) var(--space-2)',
              backgroundColor:
                timeScale === preset.scale
                  ? 'var(--color-accent)'
                  : 'var(--color-surface-2)',
              color:
                timeScale === preset.scale
                  ? 'var(--color-bg)'
                  : 'var(--color-text-primary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontFamily: 'var(--font-data)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              transition: 'background-color 150ms, border-color 150ms',
            }}
            onMouseEnter={(e) => {
              if (timeScale !== preset.scale) {
                e.currentTarget.style.backgroundColor =
                  'var(--color-surface-2)';
                e.currentTarget.style.borderColor = 'var(--color-accent-dim)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                timeScale === preset.scale
                  ? 'var(--color-accent)'
                  : 'var(--color-surface-2)';
              e.currentTarget.style.borderColor = 'var(--color-border)';
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Time Display */}
      <div
        style={{
          padding: 'var(--space-2)',
          backgroundColor: 'var(--color-bg)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border)',
          fontFamily: 'var(--font-data)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-secondary)',
          textAlign: 'center',
        }}
      >
        {formatTime(simTimeDays)}
      </div>
    </div>
  );
}
