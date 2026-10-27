/** Flat, near-camera foliage lives in front of the world and behind the copy. */
export function Foreground() {
  return (
    <div className="foreground" aria-hidden="true">
      <svg
        className="foreground-frond frond-left"
        viewBox="0 0 360 700"
        fill="none"
      >
        <path
          d="M-40 720Q95 400 295 90"
          stroke="currentColor"
          strokeWidth="9"
        />
        {Array.from({ length: 12 }, (_, i) => {
          const x = 18 + i * 22,
            y = 606 - i * 43,
            w = 140 - i * 7;
          return (
            <g key={i}>
              <path
                d={`M${x} ${y}Q${x - w} ${y - 8} ${x - w * 0.8} ${y - 99}Q${x - 20} ${y - 75} ${x} ${y}`}
                fill="currentColor"
              />
              <path
                d={`M${x} ${y}Q${x + 84} ${y + 2} ${x + w} ${y - 52}Q${x + 29} ${y - 48} ${x} ${y}`}
                fill="currentColor"
              />
            </g>
          );
        })}
      </svg>
      <svg
        className="foreground-frond frond-right"
        viewBox="0 0 360 700"
        fill="none"
      >
        <path
          d="M-40 720Q95 400 295 90"
          stroke="currentColor"
          strokeWidth="12"
        />
        {Array.from({ length: 10 }, (_, i) => (
          <path
            key={i}
            d={`M${24 + i * 24} ${610 - i * 48}q-114 -15 -132 -113q96 30 132 113q112 9 142 -75q-100 11 -142 75`}
            fill="currentColor"
          />
        ))}
      </svg>
      <div className="foreground-dust">
        {Array.from({ length: 14 }, (_, i) => (
          <i
            key={i}
            style={{
              left: `${(i * 37 + 7) % 100}%`,
              top: `${(i * 23 + 11) % 100}%`,
              animationDelay: `${-i * 1.7}s`,
              width: i % 3 ? 3 : 7,
              height: i % 3 ? 3 : 7,
            }}
          />
        ))}
      </div>
      <div className="cinema-shade" />
    </div>
  );
}
